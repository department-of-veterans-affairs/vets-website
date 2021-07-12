import React, { useEffect } from 'react';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import { focusElement } from 'platform/utilities/ui';

const Confirmation = () => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <h1 tabIndex="-1" aria-label="Thank you for checking in. ">
        Thank you for checking in
      </h1>

      <va-alert status="success">
        <h3 slot="headline" tabIndex="-1">
          We'll let you know when we're ready for you.
        </h3>
      </va-alert>
      <Footer header={'Not sure where to wait?'} />
      <BackToHome />
    </div>
  );
};

export default Confirmation;
