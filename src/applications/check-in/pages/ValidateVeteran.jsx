import React, { useState, useEffect } from 'react';

import { VaTextInput } from 'web-components/react-bindings';
import { focusElement } from 'platform/utilities/ui';

import { goToNextPage, URLS } from '../utils/navigation';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';

const ValidateVeteran = props => {
  const { router } = props;
  const [isLoading] = useState(false);
  const [lastName, setLastName] = useState('');
  const [last4Ssn, setLast4Ssn] = useState('');
  const onClick = async () => {
    goToNextPage(router, URLS.UPDATE_INSURANCE);
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

export default ValidateVeteran;
