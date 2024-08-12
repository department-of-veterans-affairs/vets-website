import {
  VaRadio,
  VaRadioOption,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { setTopicID } from '../../actions';
import { ServerErrorAlert } from '../../config/helpers';
import { URL, envUrl, requireSignInTopics } from '../../constants';
import RequireSignInModal from '../RequireSignInModal';

const TopicSelect = props => {
  const { id, onChange, value, loggedIn, categoryID } = props;
  const dispatch = useDispatch();

  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [showModal, setShowModal] = useState({ show: false, selected: '' });

  const onModalNo = () => {
    onChange('');
    setShowModal({ show: false, selected: '' });
  };

  const handleChange = event => {
    const selectedValue = event.detail.value;
    const selected = apiData.find(
      topic => topic.attributes.name === selectedValue,
    );
    dispatch(setTopicID(selected.id));
    onChange(selectedValue);
    if (requireSignInTopics.includes(selectedValue) && !loggedIn)
      setShowModal({ show: true, selected: selectedValue });
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
        `${envUrl}${URL.GET_CATEGORIESTOPICS}/${categoryID}/${URL.GET_TOPICS}`,
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
          {apiData.map(topic => (
            <option key={topic.id} value={topic.attributes.name} id={topic.id}>
              {topic.attributes.name}
            </option>
          ))}
        </VaSelect>
      ) : (
        <VaRadio
          onVaValueChange={handleChange}
          className="vads-u-margin-top--neg3"
          uswds
        >
          {apiData.map(topic => (
            <VaRadioOption
              key={topic.id}
              name={topic.attributes.name}
              id={topic.id}
              value={topic.attributes.name}
              label={topic.attributes.name}
              uswds
            />
          ))}
        </VaRadio>
      )}

      <RequireSignInModal
        onClose={onModalNo}
        show={showModal.show}
        restrictedItem={showModal.selected}
      />
    </>
  ) : (
    <ServerErrorAlert />
  );
};

TopicSelect.propTypes = {
  categoryID: PropTypes.string,
  id: PropTypes.string,
  loggedIn: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
    categoryID: state.askVA.categoryID,
  };
}

export default connect(mapStateToProps)(TopicSelect);
