import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';

import {
  clearRadiologyDetails,
  getRadiologyDetails,
} from '../actions/radiology';
import RadiologyDetails from '../components/LabsAndTests/RadiologyDetails';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  pageTitles,
  statsdFrontEndActions,
} from '../util/constants';
import useAlerts from '../hooks/use-alerts';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import { useTrackAction } from '../hooks/useTrackAction';

const RadiologyDetailsPage = () => {
  const dispatch = useDispatch();

  const radiologyDetails = useSelector(
    state => state.mr.radiology.radiologyDetails,
  );
  const radiologyList = useSelector(state => state.mr.radiology.radiologyList);
  const fullState = useSelector(state => state);

  const { radiologyId } = useParams();
  const activeAlert = useAlerts(dispatch);

  useTrackAction(statsdFrontEndActions.IMAGING_RESULTS_DETAILS);

  useEffect(
    () => {
      return () => {
        dispatch(clearRadiologyDetails());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (radiologyId) {
        dispatch(getRadiologyDetails(radiologyId, radiologyList));
      }
      updatePageTitle(pageTitles.RADIOLOGY_DETAILS_PAGE_TITLE);
    },
    [radiologyId, radiologyList, dispatch],
  );

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  if (accessAlert) {
    return (
      <AccessTroubleAlertBox
        alertType={accessAlertTypes.RADIOLOGY}
        className="vads-u-margin-bottom--9"
      />
    );
  }

  if (radiologyDetails) {
    return (
      <RadiologyDetails
        record={radiologyDetails}
        fullState={fullState}
        basePath="/imaging-results"
      />
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

export default RadiologyDetailsPage;
