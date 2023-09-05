import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCareSummaryAndNotesDetails } from '../actions/careSummariesAndNotes';
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
      if (careSummary?.name) {
        dispatch(
          setBreadcrumbs(
            [
              {
                url: '/my-health/medical-records/care-summaries-and-notes',
                label: 'Care summaries and notes',
              },
            ],
            {
              url: `/my-health/medical-records/care-summaries-and-notes/${summaryId}`,
              label: careSummary?.name,
            },
          ),
        );
      }
    },
    [careSummary, dispatch],
  );

  useEffect(
    () => {
      if (summaryId) {
        dispatch(getCareSummaryAndNotesDetails(summaryId));
      }
    },
    [summaryId, dispatch],
  );

  if (careSummary?.name) {
    switch (careSummary.type) {
      case loincCodes.DISCHARGE_SUMMARY:
        return <AdmissionAndDischargeDetails record={careSummary} />;
      case loincCodes.PHYSICIAN_PROCEDURE_NOTE:
        return <ProgressNoteDetails record={careSummary} />;
      default:
        return <p>Something else</p>;
    }
  } else {
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
        class="loading-indicator"
      />
    );
  }
};

export default CareSummariesDetails;
