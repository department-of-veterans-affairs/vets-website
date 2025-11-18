import React from 'react';
import PropTypes from 'prop-types';
import { useAcceleratedData } from '@department-of-veterans-affairs/mhv/exports';
import CernerFacilityAlert from './CernerFacilityAlert';
import { CernerAlertContent } from '../../util/constants';

const AcceleratedCernerFacilityAlert = ({ linkPath, pageName }) => {
  const {
    isCerner,
    isAccelerating,
    isAcceleratingAllergies,
    isAcceleratingCareNotes,
    isAcceleratingVitals,
    isAcceleratingVaccines,
    isAcceleratingLabsAndTests,
    isAcceleratingConditions,
  } = useAcceleratedData();

  const hideOnPage = [
    CernerAlertContent.MR_LANDING_PAGE.pageName,
    isCerner || isAcceleratingVitals
      ? CernerAlertContent.VITALS.pageName
      : null,
    isCerner || isAcceleratingAllergies
      ? CernerAlertContent.ALLERGIES.pageName
      : null,
    isAcceleratingVaccines ? CernerAlertContent.VACCINES.pageName : null,
    isAcceleratingCareNotes
      ? CernerAlertContent.CARE_SUMMARIES_AND_NOTES.pageName
      : null,
    isAcceleratingConditions
      ? CernerAlertContent.HEALTH_CONDITIONS.pageName
      : null,
    isAcceleratingLabsAndTests
      ? CernerAlertContent.LABS_AND_TESTS.pageName
      : null,
  ].filter(Boolean);

  if (hideOnPage.includes(pageName) && (isCerner || isAccelerating)) {
    return <></>;
  }
  return <CernerFacilityAlert {...{ linkPath, pageName }} />;
};

AcceleratedCernerFacilityAlert.propTypes = {
  linkPath: PropTypes.string,
  pageName: PropTypes.string,
};

export default AcceleratedCernerFacilityAlert;
