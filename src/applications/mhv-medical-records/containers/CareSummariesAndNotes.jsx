import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import RecordList from '../components/RecordList/RecordList';
import { getCareSummariesAndNotesList } from '../actions/careSummariesAndNotes';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import useListRefresh from '../hooks/useListRefresh';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  pageTitles,
  recordType,
  refreshExtractTypes,
} from '../util/constants';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';

const CareSummariesAndNotes = () => {
  const dispatch = useDispatch();
  const careSummariesAndNotes = useSelector(
    state => state.mr.careSummariesAndNotes.careSummariesAndNotesList,
  );
  const careSummariesAndNotesCurrentAsOf = useSelector(
    state => state.mr.careSummariesAndNotes.listCurrentAsOf,
  );
  const listState = useSelector(
    state => state.mr.careSummariesAndNotes.listState,
  );
  const refresh = useSelector(state => state.mr.refresh);
  const activeAlert = useAlerts(dispatch);

  useListRefresh({
    listState,
    listCurrentAsOf: careSummariesAndNotesCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction: getCareSummariesAndNotesList,
    dispatch,
  });

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          {
            url: '/',
            label: 'Medical records',
          },
        ]),
      );
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.CARE_SUMMARIES_AND_NOTES_PAGE_TITLE);
    },
    [dispatch],
  );

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  const content = () => {
    if (accessAlert) {
      return (
        <AccessTroubleAlertBox
          alertType={accessAlertTypes.CARE_SUMMARIES_AND_NOTES}
        />
      );
    }
    if (careSummariesAndNotes?.length === 0) {
      return <NoRecordsMessage type={recordType.CARE_SUMMARIES_AND_NOTES} />;
    }
    if (careSummariesAndNotes?.length) {
      return (
        <RecordList
          records={careSummariesAndNotes}
          type="care summaries and notes"
          hideRecordsLabel
        />
      );
    }
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator
          message="We’re loading your records. This could take up to a minute."
          setFocus
          data-testid="loading-indicator"
        />
      </div>
    );
  };

  return (
    <div id="care-summaries-and-notes">
      <h1 data-testid="care-summaries-and-notes" className="page-title">
        Care summaries and notes
      </h1>
      <p>
        Most care summaries and notes are available{' '}
        <span className="vads-u-font-weight--bold">36 hours</span> after
        providers sign them. This list doesn’t include care summaries from
        before 2013.
      </p>
      {content()}
    </div>
  );
};

export default CareSummariesAndNotes;
