import React from 'react';
import PropTypes from 'prop-types';
import CernerFacilityAlert from './CernerFacilityAlert';
import { CernerAlertContent } from '../../util/constants';

import useAcceleratedData from '../../hooks/useAcceleratedData';

const AcceleratedCernerFacilityAlert = ({ linkPath, pageName }) => {
  const {
    isAccelerating,
    isAcceleratingAllergies,
    isAcceleratingVitals,
  } = useAcceleratedData();

  const hideOnPage = [
    CernerAlertContent.MR_LANDING_PAGE.pageName,
    isAcceleratingVitals ? CernerAlertContent.VITALS.pageName : '',
    isAcceleratingAllergies ? CernerAlertContent.ALLERGIES.pageName : '',
  ];

  if (hideOnPage.includes(pageName) && isAccelerating) {
    return <></>;
  }
  return <CernerFacilityAlert {...{ linkPath, pageName }} />;
};

AcceleratedCernerFacilityAlert.propTypes = {
  cernerFacilities: PropTypes.arrayOf(PropTypes.object),
  linkPath: PropTypes.string,
  pageName: PropTypes.string,
};

export default AcceleratedCernerFacilityAlert;
