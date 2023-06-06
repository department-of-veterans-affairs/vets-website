import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RecordListItem from '../../components/RecordList/RecordListItem';
import reducer from '../../reducers';
import careSummariesAndNotes from '../fixtures/careSummariesAndNotes.json';

describe('CareSummariesAndNotesListItem component', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesList: careSummariesAndNotes,
        careSummariesAndNotesDetails: careSummariesAndNotes[0],
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <RecordListItem
        record={careSummariesAndNotes[0]}
        type="care summaries and notes"
      />,
      {
        initialState: state,
        reducers: reducer,
        path: '/care-summaries-and-notes',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Primary care progress note', { exact: true })).to
      .exist;
  });

  it('should contain the name and date of the record', () => {
    const screen = setup();
    const recordName = screen.getByText('Primary care progress note', {
      exact: true,
    });
    const recordDate = screen.getByText('April', { exact: false });
    expect(recordName).to.exist;
    expect(recordDate).to.exist;
  });

  it('should contain a link to view record details', () => {
    const screen = setup();
    const recordDetailsLink = screen.getByRole('link', {
      name: 'Details',
    });
    expect(recordDetailsLink).to.exist;
  });
});
