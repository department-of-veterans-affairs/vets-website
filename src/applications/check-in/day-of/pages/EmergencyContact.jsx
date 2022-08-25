import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import { useFormRouting } from '../../hooks/useFormRouting';
import BackButton from '../../components/BackButton';
import BackToHome from '../../components/BackToHome';
import Footer from '../../components/layout/Footer';
import { seeStaffMessageUpdated } from '../../actions/day-of';
import { recordAnswer } from '../../actions/universal';
import EmergencyContactDisplay from '../../components/pages/emergencyContact/EmergencyContactDisplay';
import { makeSelectVeteranData } from '../../selectors';

import { URLS } from '../../utils/navigation';

const EmergencyContact = props => {
  const { isDayOfDemographicsFlagsEnabled } = props;
  const { router } = props;
  const { t } = useTranslation();
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const { emergencyContact } = demographics;

  const {
    goToNextPage,
    jumpToPage,
    goToErrorPage,
    goToPreviousPage,
  } = useFormRouting(router);
  const seeStaffMessage = t(
    'our-staff-can-help-you-update-your-emergency-contact-information',
  );
  const dispatch = useDispatch();
  const updateSeeStaffMessage = useCallback(
    message => {
      dispatch(seeStaffMessageUpdated(message));
    },
    [dispatch],
  );

  const yesClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'yes-to-emergency-contact-information',
      });
      if (isDayOfDemographicsFlagsEnabled) {
        dispatch(recordAnswer({ emergencyContactUpToDate: 'yes' }));
      }
      goToNextPage();
    },
    [dispatch, goToNextPage, isDayOfDemographicsFlagsEnabled],
  );

  const noClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'no-to-emergency-contact-information',
      });
      if (isDayOfDemographicsFlagsEnabled) {
        dispatch(recordAnswer({ emergencyContactUpToDate: 'no' }));
      }
      updateSeeStaffMessage(seeStaffMessage);
      jumpToPage(URLS.SEE_STAFF);
    },
    [
      isDayOfDemographicsFlagsEnabled,
      dispatch,
      updateSeeStaffMessage,
      jumpToPage,
      seeStaffMessage,
    ],
  );

  if (!emergencyContact) {
    goToErrorPage();
    return <></>;
  }
  return (
    <>
      <BackButton router={router} action={goToPreviousPage} />
      <EmergencyContactDisplay
        emergencyContact={emergencyContact}
        yesAction={yesClick}
        noAction={noClick}
        Footer={Footer}
      />
      <BackToHome />
    </>
  );
};

EmergencyContact.propTypes = {
  isDayOfDemographicsFlagsEnabled: PropTypes.bool,
  router: PropTypes.object,
};

export default EmergencyContact;
