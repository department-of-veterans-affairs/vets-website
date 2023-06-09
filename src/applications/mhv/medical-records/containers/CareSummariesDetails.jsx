import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCareSummaryAndNotesDetails } from '../actions/careSummariesAndNotes';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import AdmissionAndDischargeDetails from '../components/CareSummaries/AdmissionAndDischargeDetails';
import ProgressNoteDetails from '../components/CareSummaries/ProgressNoteDetails';

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
              { url: '/my-health/medical-records/', label: 'Dashboard' },
              { url: '/my-health/health-history', label: 'Health history' },
              {
                url:
                  '/my-health/medical-records/health-history/care-summaries-and-notes',
                label: 'VA care summaries and notes',
              },
            ],
            {
              url: `/my-health/medical-records/health-history/care-summaries-and-notes/${summaryId}`,
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
    switch (careSummary?.name.toLowerCase()) {
      case 'discharge summary':
        return <AdmissionAndDischargeDetails results={careSummary} />;
      case 'primary care progress note':
        return <ProgressNoteDetails results={careSummary} />;
      default:
        return <p>Something else</p>;
    }
  } else {
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
      />
    );
  }
};

export default CareSummariesDetails;
