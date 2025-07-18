import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import {
  getCareSummaryAndNotesDetails,
  clearCareSummariesDetails,
} from '../actions/careSummariesAndNotes';
import AdmissionAndDischargeDetails from '../components/CareSummaries/AdmissionAndDischargeDetails';
import ProgressNoteDetails from '../components/CareSummaries/ProgressNoteDetails';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  loincCodes,
  pageTitles,
  statsdFrontEndActions,
} from '../util/constants';
import useAlerts from '../hooks/use-alerts';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import { useTrackAction } from '../hooks/useTrackAction';

const CareSummariesDetails = () => {
  const dispatch = useDispatch();
  const careSummary = useSelector(
    state => state.mr.careSummariesAndNotes.careSummariesAndNotesDetails,
  );
  const careSummariesList = useSelector(
    state => state.mr.careSummariesAndNotes.careSummariesAndNotesList,
  );
  const { summaryId } = useParams();
  const activeAlert = useAlerts(dispatch);
  useTrackAction(statsdFrontEndActions.CARE_SUMMARIES_AND_NOTES_DETAILS);

  useEffect(
    () => {
      return () => {
        dispatch(clearCareSummariesDetails());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (summaryId) {
        dispatch(getCareSummaryAndNotesDetails(summaryId, careSummariesList));
      }
      updatePageTitle(pageTitles.CARE_SUMMARIES_AND_NOTES_DETAILS_PAGE_TITLE);
    },
    [summaryId, careSummariesList, dispatch],
  );

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  if (accessAlert) {
    return (
      <AccessTroubleAlertBox
        alertType={accessAlertTypes.CARE_SUMMARIES_AND_NOTES}
        className="vads-u-margin-bottom--9"
      />
    );
  }
  if (careSummary?.type === loincCodes.DISCHARGE_SUMMARY) {
    return <AdmissionAndDischargeDetails record={careSummary} />;
  }
  if (
    careSummary?.type === loincCodes.PHYSICIAN_PROCEDURE_NOTE ||
    careSummary?.type === loincCodes.CONSULT_RESULT
  ) {
    return <ProgressNoteDetails record={careSummary} />;
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

export default CareSummariesDetails;
