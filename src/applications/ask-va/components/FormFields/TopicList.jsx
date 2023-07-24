import React, { useEffect, useState, useCallback } from 'react';
import environment from 'platform/utilities/environment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router';
import {
  VaSelect,
  VaModal,
  VaButton,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { apiRequest } from 'platform/utilities/api';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import { ServerErrorAlert } from '../../config/helpers'; // '  ../config/helpers';
// import { set } from 'date-fns';

const TopicList = props => {
  const {
    formContext,
    id,
    onChange,
    required,
    value,
    loggedIn,
    profile,
  } = props;
  const { reviewMode, submitted } = formContext;

  const [devs, setDevs] = useState([]);
  //   const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // define our error message(s)
  const errorMessages = { required: 'Please provide a response' };

  // define our custom onchange event
  const handleChange = event => {
    const selectedValue = event.detail.value;
    setDirty(true);
    onChange(selectedValue);
    if (selectedValue === 'eddie' && !loggedIn) setShowModal(true);
  };

  const onModalNo = () => {
    onChange('');
    setShowModal(false);
  };

  // define our custom onblur event
  const handleBlur = () => {
    setDirty(true);
  };

  // check field for validation errors only if field is dirty or form has been submitted
  const showError = () => {
    return (submitted || dirty) && !value ? errorMessages.required : false;
  };

  const STATIC_DATA = `${environment.API_URL}/v0/ask_va/static_data`;
  const STATIC_DATA_AUTH = `${environment.API_URL}/v0/ask_va/static_data_auth`;

  // fetch, map and set our list of facilities based on the state selection
  const getUsers = async url => {
    const response = await apiRequest(url)
      .then(res => {
        return res;
      })
      .catch(() => {
        hasError(true);
      });

    // format for the widget
    const data = [];
    for (const key of Object.keys(response)) {
      data.push({ id: response[key].dataInfo, name: key });
    }

    // set the dev list in the formConfig
    setDevs(data);
  };

  const hasPermission = () => {
    if (loggedIn) {
      const email = profile.email.split('@')[1];
      if (email === 'email.com') setShowAlert(true);
      getUsers(STATIC_DATA_AUTH);
    } else {
      getUsers(STATIC_DATA);
    }
  };

  useEffect(
    () => {
      hasPermission();
    },
    [loggedIn],
  );

  const getDev = useCallback(
    val => {
      const dev = devs.find(f => f.name === val);
      return dev ? `${dev.name} (${dev.id})` : '\u2014';
    },
    [devs],
  );

  // render the developer info on review page
  if (reviewMode) {
    return <span data-testid="ez-facility-reviewmode">{getDev(value)}</span>;
  }

  return !error ? (
    <>
      {loggedIn && (
        <strong>
          {`Hello, ${profile.userFullName.first} ${
            profile.userFullName.last
          } Email: ${profile.email}`}
        </strong>
      )}
      {showAlert ? (
        <VaAlert status="info" class="vads-u-margin-y--4">
          <h2 slot="headline" data-testid="expired-alert-message">
            You are not allowed to view this content
          </h2>
          <Link
            aria-label="Go sign in"
            to="/contact-us/ask-va-too/introduction"
          >
            <VaButton
              onClick={() => {}}
              primary
              text="Sign in with Approved User"
            />
          </Link>
        </VaAlert>
      ) : (
        <VaSelect
          id={id}
          name={id}
          value={value}
          label="Dev List"
          error={showError() || null}
          required={required}
          onVaSelect={handleChange}
          onBlur={handleBlur}
        >
          <option value="">&nbsp;</option>
          {devs.map(f => (
            <option key={f.id} value={f.name}>
              {f.name}
            </option>
          ))}
        </VaSelect>
      )}
      <VaModal
        clickToClose
        status="info TEST"
        modalTitle="You must Sign In to continue"
        onCloseEvent={onModalNo}
        visible={showModal}
      >
        <p>
          To continue with "Eddie" selected you must Sign In or select another
          dev.
        </p>
        <Link aria-label="Go sign in" to="/contact-us/ask-va-too/introduction">
          <VaButton onClick={() => {}} primary text="Sign in and Start Over" />
        </Link>
        <VaButton onClick={onModalNo} secondary text="Do Not Sign In" />
      </VaModal>
    </>
  ) : (
    <div className="server-error-message vads-u-margin-top--4">
      <ServerErrorAlert />
    </div>
  );
};

TopicList.propTypes = {
  loggedIn: PropTypes.bool,
  profile: PropTypes.shape({
    userFullName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
    }),
    dob: PropTypes.string,
    gender: PropTypes.string,
    email: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
    profile: selectProfile(state),
  };
}

export default connect(mapStateToProps)(TopicList);
