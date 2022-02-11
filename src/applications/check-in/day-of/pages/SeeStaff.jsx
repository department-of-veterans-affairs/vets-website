import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';

import { makeSelectSeeStaffMessage } from '../../selectors';
import TravelPayReimbursementLink from '../../components/TravelPayReimbursementLink';

const SeeStaff = props => {
  const { router } = props;
  const { goBack } = router;
  const selectSeeStaffMessage = useMemo(makeSelectSeeStaffMessage, []);
  const { message } = useSelector(selectSeeStaffMessage);
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <div className="vads-l-grid-container vads-u-padding-top--3 vads-u-padding-bottom--3">
      <BackButton router={router} action={goBack} />
      <h1 tabIndex="-1" className="vads-u-margin-top--2">
        Check in with a staff member
      </h1>
      {message ? (
        <span>{message}</span>
      ) : (
        <p>Our staff can help you update your contact information.</p>
      )}
      <TravelPayReimbursementLink />
      <Footer />
      <BackToHome />
    </div>
  );
};

SeeStaff.propTypes = {
  router: PropTypes.object,
};

export default SeeStaff;
