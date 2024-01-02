import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { setTopicID } from '../../actions';
import { ServerErrorAlert } from '../../config/helpers';
import { URL, requireSignInTopics } from '../../constants';
import RequireSignInModal from '../RequireSignInModal';

const TopicSelect = props => {
  const { id, onChange, value, loggedIn, categoryID } = props;
  const dispatch = useDispatch();

  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showModal, setShowModal] = useState({ show: false, selected: '' });

  const errorMessages = { required: 'Please provide a response' };

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
    setDirty(true);
    if (requireSignInTopics.includes(selectedValue) && !loggedIn)
      setShowModal({ show: true, selected: selectedValue });
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
        `${environment.API_URL}${URL.GET_CATEGORIES}/${categoryID}${
          URL.GET_TOPICS
        }?mock=true`,
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
        {apiData.map(topic => (
          <option key={topic.id} value={topic.attributes.name} id={topic.id}>
            {topic.attributes.name}
          </option>
        ))}
      </VaSelect>

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
