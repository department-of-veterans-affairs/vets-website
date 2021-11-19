import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { VaTextInput } from 'web-components/react-bindings';
import { focusElement } from 'platform/utilities/ui';

import { api } from '../api';

import { permissionsUpdated } from '../actions';
import { goToNextPage, URLS } from '../utils/navigation';
import { SCOPES } from '../../utils/token-format-validator';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';

import { makeSelectContext } from '../hooks/selectors';

const ValidateVeteran = props => {
  const {
    isUpdatePageEnabled,
    isDemographicsPageEnabled,
    router,
    setPermissions,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [lastName, setLastName] = useState('');
  const [last4Ssn, setLast4Ssn] = useState('');

  const [lastNameErrorMessage, setLastNameErrorMessage] = useState();
  const [last4ErrorMessage, setLast4ErrorMessage] = useState();

  const selectContext = useMemo(makeSelectContext, []);
  const { token } = useSelector(selectContext);

  const onClick = async () => {
    setLastNameErrorMessage();
    setLast4ErrorMessage();
    if (!lastName || !last4Ssn) {
      if (!lastName) {
        setLastNameErrorMessage('Please enter your last name.');
      }
      if (!last4Ssn) {
        setLast4ErrorMessage(
          'Please enter the last 4 digits of your Social Security number.',
        );
      }
    } else {
      // API call
      setIsLoading(true);

      api.v2
        .postSession({ lastName, last4: last4Ssn, token })
        .then(data => {
          // update sessions with new permissions
          setPermissions(data);
          // routing
          if (isDemographicsPageEnabled) {
            goToNextPage(router, URLS.DEMOGRAPHICS);
          } else if (isUpdatePageEnabled) {
            goToNextPage(router, URLS.UPDATE_INSURANCE);
          } else {
            goToNextPage(router, URLS.DETAILS);
          }
        })
        .catch(() => {
          goToNextPage(router, URLS.ERROR);
        });
    }
  };
  useEffect(() => {
    focusElement('h1');
  }, []);

  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 ">
      <h1>Check in at VA</h1>
      <p>
        We need some information to verify your identity so we can check you in.
      </p>
      <form className="vads-u-margin-bottom--2p5" onSubmit={() => false}>
        <VaTextInput
          autoCorrect="false"
          error={lastNameErrorMessage}
          label="Your last name"
          name="last-name"
          onVaChange={event => setLastName(event.detail.value)}
          required
          spellCheck="false"
          value={lastName}
        />
        <VaTextInput
          error={last4ErrorMessage}
          inputmode="numeric"
          label="Last 4 digits of your Social Security number"
          maxlength="4"
          onVaChange={event => setLast4Ssn(event.detail.value)}
          name="last-4-ssn"
          required
          value={last4Ssn}
        />
      </form>
      <button
        type="button"
        className="usa-button usa-button-big"
        onClick={onClick}
        data-testid="check-in-button"
        disabled={isLoading}
        aria-label="Check in now for your appointment"
      >
        {isLoading ? <>Loading...</> : <>Continue</>}
      </button>
      <Footer />
      <BackToHome />
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    setPermissions: data =>
      dispatch(permissionsUpdated(data, SCOPES.READ_FULL)),
  };
};

ValidateVeteran.propTypes = {
  isUpdatePageEnabled: PropTypes.bool,
  isDemographicsPageEnabled: PropTypes.bool,
  router: PropTypes.object,
  setPermissions: PropTypes.func,
};

export default connect(
  null,
  mapDispatchToProps,
)(ValidateVeteran);
