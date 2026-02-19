import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import {
  updatePageTitle,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';

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
  noteTypes,
} from '../util/constants';
import useAlerts from '../hooks/use-alerts';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import { useTrackAction } from '../hooks/useTrackAction';

const CareSummariesDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const careSummary = useSelector(
    state => state.mr.careSummariesAndNotes.careSummariesAndNotesDetails,
  );
  const careSummariesList = useSelector(
    state => state.mr.careSummariesAndNotes.careSummariesAndNotesList,
  );
  const { summaryId } = useParams();
  const activeAlert = useAlerts(dispatch);
  const hasFetchedRef = useRef(false);

  const { isAcceleratingCareNotes } = useAcceleratedData();

  useTrackAction(statsdFrontEndActions.CARE_SUMMARIES_AND_NOTES_DETAILS);

  useEffect(
    () => {
      return () => {
        dispatch(clearCareSummariesDetails());
        hasFetchedRef.current = false;
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (isAcceleratingCareNotes) {
        // Accelerated path: redirect if the list is empty
        if (!careSummariesList || careSummariesList.length === 0) {
          history.push('/summaries-and-notes/');
          return;
        }
        // Redirect if the note ID doesn't exist in the loaded list
        const noteExistsInList = careSummariesList.some(
          item => item.id === summaryId,
        );
        if (summaryId && !noteExistsInList) {
          history.push('/summaries-and-notes/');
          return;
        }
        // Dispatch details only once per mount to prevent infinite re-fetch on error
        if (summaryId && !careSummary && !hasFetchedRef.current) {
          hasFetchedRef.current = true;
          dispatch(
            getCareSummaryAndNotesDetails(
              summaryId,
              careSummariesList,
              isAcceleratingCareNotes,
            ),
          );
        }
      } else {
        // Legacy path
        if (summaryId && !careSummary?.notFound) {
          dispatch(
            getCareSummaryAndNotesDetails(
              summaryId,
              careSummariesList,
              isAcceleratingCareNotes,
            ),
          );
        }
        if (careSummary?.notFound || !careSummariesList) {
          history.push('/summaries-and-notes/');
        }
      }
      updatePageTitle(pageTitles.CARE_SUMMARIES_AND_NOTES_DETAILS_PAGE_TITLE);
    },
    [
      summaryId,
      careSummariesList,
      dispatch,
      isAcceleratingCareNotes,
      history,
      careSummary,
    ],
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
  const isDischargeSummary =
    careSummary?.type === noteTypes.DISCHARGE_SUMMARY ||
    careSummary?.type === loincCodes.DISCHARGE_SUMMARY;
  if (isDischargeSummary) {
    return <AdmissionAndDischargeDetails record={careSummary} />;
  }

  const isPhysicianProcedureNote =
    careSummary?.type === noteTypes.PHYSICIAN_PROCEDURE_NOTE ||
    careSummary?.type === loincCodes.PHYSICIAN_PROCEDURE_NOTE;

  const isConsultResult =
    careSummary?.type === noteTypes.CONSULT_RESULT ||
    careSummary?.type === loincCodes.CONSULT_RESULT;

  const isOther = careSummary?.type === noteTypes.OTHER;

  if (isPhysicianProcedureNote || isConsultResult || isOther) {
    return <ProgressNoteDetails record={careSummary} />;
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

export default CareSummariesDetails;
