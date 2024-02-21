import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { ServerErrorAlert } from '../../config/helpers';
import { URL } from '../../constants';

const SubtopicSelect = props => {
  const { id, onChange, value, loggedIn, topicID } = props;

  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [dirty, setDirty] = useState(false);

  const errorMessages = { required: 'Please provide a response' };

  const handleChange = event => {
    const selectedValue = event.detail.value;
    onChange(selectedValue);
    setDirty(true);
  };

  const handleBlur = () => {
    setDirty(true);
  };

  const showError = () => {
    return dirty && !value ? errorMessages.required : false;
  };

  const getApiData = url => {
    isLoading(true);
    return apiRequest(url)
      .then(res => {
        setApiData(res.data);
        isLoading(false);
      })
      .catch(() => {
        isLoading(false);
        hasError(true);
      });
  };

  useEffect(
    () => {
      getApiData(
        `${environment.API_URL}${
          URL.GET_SUBTOPICS
        }/${topicID}/subtopics?mock=true`,
      );
    },
    [loggedIn],
  );

  // render loading indicator while we fetch
  if (loading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }

  return !error ? (
    <VaSelect
      id={id}
      name={id}
      value={value}
      error={showError() || null}
      onVaSelect={handleChange}
      onBlur={handleBlur}
      uswds
    >
      <option value="">&nbsp;</option>
      {apiData.map(subTopic => (
        <option
          key={subTopic.id}
          value={subTopic.attributes.name}
          id={subTopic.id}
        >
          {subTopic.attributes.name}
        </option>
      ))}
    </VaSelect>
  ) : (
    <ServerErrorAlert />
  );
};

SubtopicSelect.propTypes = {
  loggedIn: PropTypes.bool,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  topicID: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
    topicID: state.askVA.topicID,
  };
}

export default connect(mapStateToProps)(SubtopicSelect);
