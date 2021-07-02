import React from 'react';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';

const Failed = () => {
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <h1 tabIndex="-1">Please check in with a staff member.</h1>
      <Footer header={'Not sure who to check in with?'} />
      <BackToHome />
    </div>
  );
};

export default Failed;
