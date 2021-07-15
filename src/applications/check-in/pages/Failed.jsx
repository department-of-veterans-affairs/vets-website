import React, { useEffect } from 'react';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import { focusElement } from 'platform/utilities/ui';
import BackButton from '../components/BackButton';

const Failed = props => {
  const { router } = props;
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--3">
      <BackButton router={router} />
      <h1 tabIndex="-1">Check in with a staff member.</h1>
      <p className="vads-u-margin-bottom--0">
        They can help you update your information before your appointment.
      </p>
      <Footer header={'Not sure who to check in with?'} message="Call us at" />
      <BackToHome />
    </div>
  );
};

export default Failed;
