import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import { URLS } from '../../utils/navigation/day-of';
import { useFormRouting } from '../../hooks/useFormRouting';
import BackButton from '../components/BackButton';
import BackToHome from '../components/BackToHome';
import { focusElement } from 'platform/utilities/ui';
import Footer from '../components/Footer';
import { seeStaffMessageUpdated } from '../../actions/day-of';
import EmergencyContactDisplay from '../../components/pages/emergencyContact/EmergencyContactDisplay';

const EmergencyContact = props => {
  const { emergencyContact, isLoading, router, demographicsStatus } = props;
  const { emergencyContactNeedsUpdate } = demographicsStatus;
  const { goToNextPage, jumpToPage, goToErrorPage } = useFormRouting(
    router,
    URLS,
  );
  const seeStaffMessage =
    'Our staff can help you update your emergency contact information.';
  const dispatch = useDispatch();
  const updateSeeStaffMessage = useCallback(
    message => {
      dispatch(seeStaffMessageUpdated(message));
    },
    [dispatch],
  );
  useEffect(() => {
    focusElement('h1');
  }, []);

  const yesClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'yes-to-emergency-contact-information',
      });
      goToNextPage();
    },
    [goToNextPage],
  );

  const noClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'no-to-emergency-contact-information',
      });
      updateSeeStaffMessage(seeStaffMessage);
      jumpToPage(URLS.SEE_STAFF);
    },
    [updateSeeStaffMessage, jumpToPage],
  );
  useEffect(
    () => {
      if (emergencyContactNeedsUpdate === false) {
        goToNextPage();
      }
    },
    [emergencyContactNeedsUpdate, goToNextPage],
  );
  if (isLoading) {
    return (
      <va-loading-indicator message="Loading your appointments for today" />
    );
  } else if (!emergencyContact) {
    goToErrorPage();
    return <></>;
  } else {
    return (
      <>
        <BackButton router={router} />
        <EmergencyContactDisplay
          data={emergencyContact}
          yesAction={yesClick}
          noAction={noClick}
          Footer={Footer}
        />
        <BackToHome />
      </>
    );
  }
};

EmergencyContact.propTypes = {
  emergencyContact: PropTypes.object,
  isLoading: PropTypes.bool,
  isUpdatePageEnabled: PropTypes.bool,
  router: PropTypes.object,
  demographicsStatus: PropTypes.object,
};

export default EmergencyContact;
