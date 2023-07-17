import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecordList from '../components/RecordList/RecordList';
import { getCareSummariesAndNotesList } from '../actions/careSummariesAndNotes';
import { setBreadcrumbs } from '../actions/breadcrumbs';

const CareSummariesAndNotes = () => {
  const dispatch = useDispatch();
  const careSummariesAndNotes = useSelector(
    state => state.mr.careSummariesAndNotes.careSummariesAndNotesList,
  );

  useEffect(() => {
    dispatch(getCareSummariesAndNotesList());
  }, []);

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs(
          [
            { url: '/my-health/medical-records/', label: 'Dashboard' },
            {
              url: '/my-health/medical-records/health-history',
              label: 'Health history',
            },
          ],
          {
            url:
              '/my-health/medical-records/health-history/care-summaries-and-notes',
            label: 'VA care summaries and notes',
          },
        ),
      );
    },
    [dispatch],
  );

  const content = () => {
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
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
      />
    );
  };

  return (
    <div id="care-summaries-and-notes">
      <h1 className="page-title">Care summaries and notes</h1>
      <section className="set-width-486">
        <p>Review care summaries and notes in your VA medical records.</p>
        <va-additional-info trigger="What to know about your care summaries and notes">
          This is some additional info about your care summaries and notes,
          though we are waiting on the Content Team to tell us what should be
          here...
        </va-additional-info>
      </section>
      {content()}
    </div>
  );
};

export default CareSummariesAndNotes;
