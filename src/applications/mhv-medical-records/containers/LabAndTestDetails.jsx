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
  loadStates,
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
  const loading =
    useSelector(state => state.mr.labsAndTests.listState) !==
    loadStates.FETCHED;
  const testType = labAndTestDetails?.type;

  useEffect(
    () => {
      return () => {
        dispatch(clearLabsAndTestDetails());
      };
    },
    [dispatch, loading],
  );

  useEffect(
    () => {
      if (labId) {
        dispatch(getlabsAndTestsDetails(labId, labAndTestList));
      }
      updatePageTitle(pageTitles.LAB_AND_TEST_RESULTS_DETAILS_PAGE_TITLE);
    },
    [labId, labAndTestList, dispatch, loading],
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

  if (loading) {
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator
          message="Loading..."
          set-focus
          data-testid="loading-indicator"
        />
      </div>
    );
  }

  return (
    <>
      {testType === labTypes.CHEM_HEM && (
        <ChemHemDetails record={labAndTestDetails} fullState={fullState} />
      )}
      {testType === labTypes.MICROBIOLOGY && (
        <MicroDetails record={labAndTestDetails} fullState={fullState} />
      )}
      {testType === labTypes.PATHOLOGY && (
        <PathologyDetails record={labAndTestDetails} fullState={fullState} />
      )}
      {testType === labTypes.EKG && <EkgDetails record={labAndTestDetails} />}
      {(testType === labTypes.RADIOLOGY ||
        testType === labTypes.CVIX_RADIOLOGY) && (
        <RadiologyDetails record={labAndTestDetails} fullState={fullState} />
      )}
    </>
  );
};

export default LabAndTestDetails;
