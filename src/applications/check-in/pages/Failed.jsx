import React, { useEffect } from 'react';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import { focusElement } from 'platform/utilities/ui';

const Failed = () => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <h1 tabIndex="-1">Check in with a staff member.</h1>
      <p>They can help you update your information before your appointment.</p>
      <Footer header={'Not sure who to check in with?'} />
      <BackToHome />
    </div>
  );
};

export default Failed;
