import React from 'react';
import PropTypes from 'prop-types';
import CernerFacilityAlert from './CernerFacilityAlert';
import { CernerAlertContent } from '../../util/constants';

import useAcceleratedData from '../../hooks/useAcceleratedData';

const AcceleratedCernerFacilityAlert = ({ linkPath, pageName }) => {
  const {
    isCerner,
    isAccelerating,
    isAcceleratingCareNotes,
    isAcceleratingVitals,
    isAcceleratingVaccines,
    isAcceleratingLabsAndTests,
    isAcceleratingConditions,
  } = useAcceleratedData();

  const hideOnPage = [
    CernerAlertContent.MR_LANDING_PAGE.pageName,
    isAcceleratingVitals ? CernerAlertContent.VITALS.pageName : null,
    isCerner ? CernerAlertContent.ALLERGIES.pageName : null,
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
