import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import { focusElement } from 'platform/utilities/ui';
import BackButton from '../components/BackButton';

import { makeSelectSeeStaffMessage } from '../hooks/selectors';

const SeeStaff = props => {
  const { router } = props;
  const selectSeeStaffMessage = useMemo(makeSelectSeeStaffMessage, []);
  const { message } = useSelector(selectSeeStaffMessage);
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <div className="vads-l-grid-container vads-u-padding-top--3 vads-u-padding-bottom--3">
      <BackButton router={router} />
      <h1 tabIndex="-1" className="vads-u-margin-top--2">
        Check in with a staff member
      </h1>
      {message ? (
        <>{message}</>
      ) : (
        <p>Our staff can help you update your contact information.</p>
      )}
      <Footer />
      <BackToHome />
    </div>
  );
};

SeeStaff.propTypes = {
  router: PropTypes.object,
};

export default SeeStaff;
