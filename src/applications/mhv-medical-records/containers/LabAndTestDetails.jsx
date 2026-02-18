import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import {
  updatePageTitle,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';

import {
  clearLabsAndTestDetails,
  getLabsAndTestsDetails,
} from '../actions/labsAndTests';
import RadiologyDetails from '../components/LabsAndTests/RadiologyDetails';
import MicroDetails from '../components/LabsAndTests/MicroDetails';
import PathologyDetails from '../components/LabsAndTests/PathologyDetails';
import ChemHemDetails from '../components/LabsAndTests/ChemHemDetails';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  labTypes,
  pageTitles,
  statsdFrontEndActions,
} from '../util/constants';
import { isRadiologyId } from '../util/helpers';
import useAlerts from '../hooks/use-alerts';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import UnifiedLabsAndTests from '../components/LabsAndTests/UnifiedLabAndTest';
import { useTrackAction } from '../hooks/useTrackAction';

const LabAndTestDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const labAndTestDetails = useSelector(
    state => state.mr.labsAndTests.labsAndTestsDetails,
  );
  const labAndTestList = useSelector(
    state => state.mr.labsAndTests.labsAndTestsList,
  );
  const fullState = useSelector(state => state);
  const user = useSelector(state => state.user.profile);

  const { labId } = useParams();
  const activeAlert = useAlerts(dispatch);
  const { isAcceleratingLabsAndTests, isLoading } = useAcceleratedData();
  useTrackAction(statsdFrontEndActions.LABS_AND_TESTS_DETAILS);

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
      if (labId && !isLoading && !labAndTestDetails?.notFound) {
        dispatch(
          getLabsAndTestsDetails(
            labId,
            labAndTestList,
            isAcceleratingLabsAndTests,
          ),
        );
      }
      if (labAndTestDetails?.notFound) {
        history.push('/labs-and-tests');
      }
      updatePageTitle(pageTitles.LAB_AND_TEST_RESULTS_DETAILS_PAGE_TITLE);
    },
    [
      labId,
      labAndTestList,
      dispatch,
      isAcceleratingLabsAndTests,
      isLoading,
      labAndTestDetails?.id,
      labAndTestDetails?.notFound,
      history,
    ],
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
  if (isAcceleratingLabsAndTests && labAndTestDetails && !isLoading) {
    if (isRadiologyId(labId)) {
      return (
        <RadiologyDetails record={labAndTestDetails} fullState={fullState} />
      );
    }
    return <UnifiedLabsAndTests record={labAndTestDetails} user={user} />;
  }
  // TODO: Delete this with the feature toggle
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
        set-focus
        data-testid="loading-indicator"
      />
    </div>
  );
};

export default LabAndTestDetails;
