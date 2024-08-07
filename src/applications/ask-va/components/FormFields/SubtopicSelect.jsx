import {
  VaRadio,
  VaRadioOption,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { ServerErrorAlert } from '../../config/helpers';
import { URL, envUrl } from '../../constants';

const SubtopicSelect = props => {
  const { id, onChange, value, loggedIn, topicID } = props;

  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);

  const handleChange = event => {
    const selectedValue = event.detail.value;
    onChange(selectedValue);
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
        `${envUrl}${
          URL.GET_SUBTOPICS
        }/${topicID}/subtopics?user_mock_data=true`,
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
    <>
      {apiData.length > 15 ? (
        <VaSelect
          id={id}
          name={id}
          value={value}
          onVaSelect={handleChange}
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
        <VaRadio
          onVaValueChange={handleChange}
          className="vads-u-margin-top--neg3"
          uswds
        >
          {apiData.map(subTopic => (
            <VaRadioOption
              key={subTopic.id}
              name={subTopic.attributes.name}
              id={subTopic.id}
              value={subTopic.attributes.name}
              label={subTopic.attributes.name}
              uswds
            />
          ))}
        </VaRadio>
      )}
    </>
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
