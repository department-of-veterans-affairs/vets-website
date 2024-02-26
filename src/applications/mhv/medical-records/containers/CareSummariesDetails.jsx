import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getCareSummaryAndNotesDetails,
  clearCareSummariesDetails,
} from '../actions/careSummariesAndNotes';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import AdmissionAndDischargeDetails from '../components/CareSummaries/AdmissionAndDischargeDetails';
import ProgressNoteDetails from '../components/CareSummaries/ProgressNoteDetails';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  loincCodes,
} from '../util/constants';
import useAlerts from '../hooks/use-alerts';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';

const CareSummariesDetails = () => {
  const dispatch = useDispatch();
  const careSummary = useSelector(
    state => state.mr.careSummariesAndNotes.careSummariesAndNotesDetails,
  );
  const careSummariesList = useSelector(
    state => state.mr.careSummariesAndNotes.careSummariesAndNotesList,
  );
  const { summaryId } = useParams();
  const activeAlert = useAlerts();

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          {
            url: '/summaries-and-notes',
            label: 'Care summaries and notes',
          },
        ]),
      );
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
    },
    [summaryId, careSummariesList, dispatch],
  );

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  if (accessAlert) {
    return (
      <AccessTroubleAlertBox
        alertType={accessAlertTypes.CARE_SUMMARIES_AND_NOTES}
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
