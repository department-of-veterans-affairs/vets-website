import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RecordListItem from '../../components/RecordList/RecordListItem';
import reducer from '../../reducers';
import notes from '../fixtures/notes.json';
import { convertNote } from '../../reducers/careSummariesAndNotes';

describe('CareSummariesAndNotesListItem', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesList: notes.entry.map(item =>
          convertNote(item.resource),
        ),
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <RecordListItem
        record={convertNote(notes.entry[0].resource)}
        type="care summaries and notes"
      />,
      {
        initialState: state,
        reducers: reducer,
        path: '/summaries-and-notes',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Physician procedure note', { exact: true })).to
      .exist;
  });

  it('should contain the name of the record', () => {
    const screen = setup();
    const recordName = screen.getByText('Physician procedure note', {
      exact: true,
    });
    expect(recordName).to.exist;
  });

  it('should contain the date of the record', () => {
    const screen = setup();
    const recordDate = screen.getAllByText('August', { exact: false });
    expect(recordDate).to.exist;
  });

  it('should contain a link to view record details', () => {
    const screen = setup();
    const recordDetailsLink = screen.getByRole('link', {
      name: /Details/,
    });
    expect(recordDetailsLink).to.exist;
  });
});
