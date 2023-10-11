import React, { useEffect, useState } from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  VaSelect,
  VaModal,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { ServerErrorAlert } from '../../config/helpers';
import { URL } from '../../constants';

const CategorySelect = props => {
  const { id, onChange, value, loggedIn } = props;

  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showModal, setShowModal] = useState(false);

  //   define our error message(s)
  const errorMessages = { required: 'Please provide a response' };

  const onModalNo = () => {
    onChange('');
    setShowModal(false);
  };

  // define our custom onchange event
  const handleChange = event => {
    const selectedValue = event.detail.value;
    setDirty(true);
    onChange(selectedValue);
    // TODO: change this to look for education and other categories that require loggedIn
    if (selectedValue === 'Test Category 1' && !loggedIn) setShowModal(true);
  };

  //   define our custom onblur event
  const handleBlur = () => {
    setDirty(true);
  };

  //   check field for validation errors only if field is dirty or form has been submitted
  const showError = () => {
    return dirty && !value ? errorMessages.required : false;
  };

  // fetch, map and set our list of facilities based on the state selection
  const getApiData = url => {
    isLoading(true);
    // TODO: Update this to work with data when we get it
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
      getApiData(`${environment.API_URL}${URL.GET_CATEGORIES}`);
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
        label="Select a category"
        error={showError() || null}
        onVaSelect={handleChange}
        onBlur={handleBlur}
      >
        <option value="">&nbsp;</option>
        {/* TODO: Update this to work with data when we get it */}
        {apiData.map(f => (
          <option key={f.id} value={f.attributes.name}>
            {f.attributes.name}
          </option>
        ))}
      </VaSelect>

      <VaModal
        clickToClose
        status="info TEST"
        modalTitle="You must Sign In to continue"
        onCloseEvent={onModalNo}
        visible={showModal}
      >
        <p>
          To continue with "Education" selected you must Sign In or select
          another category.
        </p>
        <Link aria-label="Go sign in" to="/contact-us/ask-va-too/introduction">
          <VaButton onClick={() => {}} primary text="Sign in and Start Over" />
        </Link>
        <VaButton onClick={onModalNo} secondary text="Do Not Sign In" />
      </VaModal>
    </>
  ) : (
    <ServerErrorAlert />
  );
};

CategorySelect.propTypes = {
  loggedIn: PropTypes.bool,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
  };
}

export default connect(mapStateToProps)(CategorySelect);
