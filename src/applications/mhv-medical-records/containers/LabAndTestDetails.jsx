import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import {
  clearLabsAndTestDetails,
  getlabsAndTestsDetails,
} from '../actions/labsAndTests';
import EkgDetails from '../components/LabsAndTests/EkgDetails';
import RadiologyDetails from '../components/LabsAndTests/RadiologyDetails';
import MicroDetails from '../components/LabsAndTests/MicroDetails';
import PathologyDetails from '../components/LabsAndTests/PathologyDetails';
import ChemHemDetails from '../components/LabsAndTests/ChemHemDetails';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  labTypes,
  pageTitles,
} from '../util/constants';
import useAlerts from '../hooks/use-alerts';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';

const LabAndTestDetails = () => {
  const dispatch = useDispatch();
  const labAndTestDetails = useSelector(
    state => state.mr.labsAndTests.labsAndTestsDetails,
  );
  const labAndTestList = useSelector(
    state => state.mr.labsAndTests.labsAndTestsList,
  );
  const fullState = useSelector(state => state);
  const { labId } = useParams();
  const activeAlert = useAlerts(dispatch);

  useEffect(
    () => {
      return () => {
        dispatch(clearLabsAndTestDetails());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (labId) {
        dispatch(getlabsAndTestsDetails(labId, labAndTestList));
      }
      updatePageTitle(pageTitles.LAB_AND_TEST_RESULTS_DETAILS_PAGE_TITLE);
    },
    [labId, labAndTestList, dispatch],
  );

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  if (accessAlert) {
    return (
      <AccessTroubleAlertBox
        alertType={accessAlertTypes.LABS_AND_TESTS}
        className="vads-u-margin-bottom--9"
      />
    );
  }
  if (labAndTestDetails?.type === labTypes.CHEM_HEM) {
    return <ChemHemDetails record={labAndTestDetails} fullState={fullState} />;
  }
  if (labAndTestDetails?.type === labTypes.MICROBIOLOGY) {
    return <MicroDetails record={labAndTestDetails} fullState={fullState} />;
  }
  if (labAndTestDetails?.type === labTypes.PATHOLOGY) {
    return (
      <PathologyDetails record={labAndTestDetails} fullState={fullState} />
    );
  }
  if (labAndTestDetails?.type === labTypes.EKG) {
    return <EkgDetails record={labAndTestDetails} />;
  }
  if (
    labAndTestDetails?.type === labTypes.RADIOLOGY ||
    labAndTestDetails?.type === labTypes.CVIX_RADIOLOGY
  ) {
    return (
      <RadiologyDetails record={labAndTestDetails} fullState={fullState} />
    );
  }
  return (
    <div className="vads-u-margin-y--8">
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
      />
    </div>
  );
};

export default LabAndTestDetails;
