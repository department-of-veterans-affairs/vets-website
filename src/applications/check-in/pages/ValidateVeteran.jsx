import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { VaTextInput } from 'web-components/react-bindings';
import { focusElement } from 'platform/utilities/ui';

import { v1 } from '../api';

import { permissionsUpdated } from '../actions';
import { goToNextPage, URLS } from '../utils/navigation';
import { SCOPES } from '../utils/token-format-validator';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';

const ValidateVeteran = props => {
  const { router, isUpdatePageEnabled, setPermissions, context } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [lastName, setLastName] = useState('');
  const [last4Ssn, setLast4Ssn] = useState('');

  const { token } = context;

  const onClick = async () => {
    // API call
    setIsLoading(true);
    v1.postSession({ lastName, last4: last4Ssn, token }).then(json => {
      const { data } = json;

      // update sessions with new permissions
      setPermissions(data);

      if (isUpdatePageEnabled) {
        goToNextPage(router, URLS.UPDATE_INSURANCE);
      } else {
        goToNextPage(router, URLS.DETAILS);
      }
    });
  };
  useEffect(() => {
    focusElement('h1');
  }, []);

  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 ">
      <h1>Check in at VA</h1>
      <p>We need some information to verify your identity to check you in.</p>
      <form onSubmit={() => false}>
        <VaTextInput
          label="Your last name"
          name="last-name"
          value={lastName}
          onVaChange={event => setLastName(event.detail.value)}
        />
        <VaTextInput
          label="Last 4 digits of your Social Security number"
          name="last-4-ssn"
          value={last4Ssn}
          onVaChange={event => setLast4Ssn(event.detail.value)}
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
const mapStateToProps = state => {
  return {
    appointments: state.checkInData.appointments,
    context: state.checkInData.context,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setPermissions: data =>
      dispatch(permissionsUpdated(data, SCOPES.READ_FULL)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ValidateVeteran);
