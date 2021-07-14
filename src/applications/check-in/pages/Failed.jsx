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
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--3  vads-u-padding-bottom--3">
      <BackButton router={router} />
      <h1 tabIndex="-1" className={' vads-u-padding-top--2'}>
        Check in with a staff member.
      </h1>
      <p>They can help you update your information before your appointment.</p>
      <Footer header={'Not sure who to check in with?'} />
      <BackToHome />
    </div>
  );
};

export default Failed;
