import React from 'react';
import PropTypes from 'prop-types';
import CernerFacilityAlert from './CernerFacilityAlert';
import { CernerAlertContent } from '../../util/constants';

const AcceleratedCernerFacilityAlert = ({ linkPath, pageName }) => {
  const hideOnPage = [
    CernerAlertContent.MR_LANDING_PAGE.pageName,
    CernerAlertContent.VITALS.pageName,
    CernerAlertContent.ALLERGIES.pageName,
  ];
  if (hideOnPage.includes(pageName)) {
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
