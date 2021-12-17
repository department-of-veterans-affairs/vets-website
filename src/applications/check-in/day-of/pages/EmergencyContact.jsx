import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import { goToNextPage, URLS } from '../utils/navigation';
import BackButton from '../components/BackButton';
import BackToHome from '../components/BackToHome';
import { focusElement } from 'platform/utilities/ui';
import Footer from '../components/Footer';
import { seeStaffMessageUpdated } from '../actions';
import EmergencyContactDisplay from '../../components/pages/emergencyContact/EmergencyContactDisplay';

const EmergencyContact = props => {
  const {
    emergencyContact,
    isLoading,
    isUpdatePageEnabled,
    router,
    updateSeeStaffMessage,
    demographicsStatus,
  } = props;
  const { emergencyContactNeedsUpdate } = demographicsStatus;
  const seeStaffMessage =
    'Our staff can help you update your emergency contact information.';

  useEffect(() => {
    focusElement('h1');
  }, []);
  const findNextPage = useCallback(
    () => {
      if (isUpdatePageEnabled) {
        goToNextPage(router, URLS.UPDATE_INSURANCE);
      } else {
        goToNextPage(router, URLS.DETAILS);
      }
    },
    [isUpdatePageEnabled, router],
  );
  const yesClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'yes-to-emergency-contact-information',
      });
      findNextPage();
    },
    [findNextPage],
  );

  const noClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'no-to-emergency-contact-information',
      });
      updateSeeStaffMessage(seeStaffMessage);
      goToNextPage(router, URLS.SEE_STAFF);
    },
    [router, updateSeeStaffMessage],
  );
  useEffect(
    () => {
      if (emergencyContactNeedsUpdate === false) {
        findNextPage();
      }
    },
    [emergencyContactNeedsUpdate, findNextPage],
  );
  if (isLoading) {
    return (
      <va-loading-indicator message="Loading your appointments for today" />
    );
  } else if (!emergencyContact) {
    goToNextPage(router, URLS.ERROR);
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

const mapDispatchToProps = dispatch => {
  return {
    updateSeeStaffMessage: seeStaffMessage => {
      dispatch(seeStaffMessageUpdated(seeStaffMessage));
    },
  };
};

EmergencyContact.propTypes = {
  emergencyContact: PropTypes.object,
  isLoading: PropTypes.bool,
  isUpdatePageEnabled: PropTypes.bool,
  router: PropTypes.object,
  updateSeeStaffMessage: PropTypes.func,
  demographicsStatus: PropTypes.object,
};

export default connect(
  null,
  mapDispatchToProps,
)(EmergencyContact);
