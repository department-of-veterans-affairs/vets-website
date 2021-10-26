import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
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
    <div className="vads-l-grid-container vads-u-padding-top--3 vads-u-padding-bottom--3">
      <BackButton router={router} />
      <h1 tabIndex="-1" className="vads-u-margin-top--2">
        Check in with a staff member
      </h1>
      <p>Our staff can help you update your contact information.</p>
      <p className="vads-u-margin-bottom--0">
        If you don’t live at a fixed address right now, we’ll help you find the
        best way to stay connected with us.
      </p>
      <Footer />
      <BackToHome />
    </div>
  );
};

Failed.propTypes = {
  router: PropTypes.object,
};

export default Failed;
