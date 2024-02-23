import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  clearLabsAndTestDetails,
  getlabsAndTestsDetails,
} from '../actions/labsAndTests';
import EkgDetails from '../components/LabsAndTests/EkgDetails';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import RadiologyDetails from '../components/LabsAndTests/RadiologyDetails';
import MicroDetails from '../components/LabsAndTests/MicroDetails';
import PathologyDetails from '../components/LabsAndTests/PathologyDetails';
import ChemHemDetails from '../components/LabsAndTests/ChemHemDetails';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  labTypes,
} from '../util/constants';
import useAlerts from '../hooks/use-alerts';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';

const LabAndTestDetails = () => {
  const dispatch = useDispatch();
  const labAndTestDetails = useSelector(
    state => state.mr.labsAndTests.labsAndTestsDetails,
  );
  const fullState = useSelector(state => state);
  const { labId } = useParams();
  const activeAlert = useAlerts();

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          {
            url: '/labs-and-tests',
            label: 'Lab and test results',
          },
        ]),
      );
      return () => {
        dispatch(clearLabsAndTestDetails());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (labId) {
        dispatch(getlabsAndTestsDetails(labId));
      }
    },
    [labId, dispatch],
  );

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  if (accessAlert) {
    return (
      <AccessTroubleAlertBox alertType={accessAlertTypes.LABS_AND_TESTS} />
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
  if (labAndTestDetails?.type === labTypes.RADIOLOGY) {
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
