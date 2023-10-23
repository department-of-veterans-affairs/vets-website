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
import { loincCodes } from '../util/constants';

const CareSummariesDetails = () => {
  const dispatch = useDispatch();
  const careSummary = useSelector(
    state => state.mr.careSummariesAndNotes.careSummariesAndNotesDetails,
  );
  const { summaryId } = useParams();

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          {
            url: '/my-health/medical-records/summaries-and-notes',
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
        dispatch(getCareSummaryAndNotesDetails(summaryId));
      }
    },
    [summaryId, dispatch],
  );

  if (careSummary?.type === loincCodes.DISCHARGE_SUMMARY) {
    return <AdmissionAndDischargeDetails record={careSummary} />;
  }
  if (careSummary?.type === loincCodes.PHYSICIAN_PROCEDURE_NOTE) {
    return <ProgressNoteDetails record={careSummary} />;
  }
  return (
    <va-loading-indicator
      message="Loading..."
      setFocus
      data-testid="loading-indicator"
      class="loading-indicator"
    />
  );
};

export default CareSummariesDetails;
