import React, { useEffect } from 'react';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import { focusElement } from 'platform/utilities/ui';

const Error = () => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5 ">
      <va-alert status="error">
        <h1 tabIndex="-1" slot="headline">
          We couldn’t check you in
        </h1>
        <p data-testid="error-message">
          We’re sorry. Something went wrong on our end. Check in with a staff
          member.
        </p>
      </va-alert>
      <Footer />
      <BackToHome />
    </div>
  );
};

export default Error;
