import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import ProgressNoteDetails from '../../components/CareSummaries/ProgressNoteDetails';
import note from '../fixtures/note.json';
import { convertNote } from '../../reducers/careSummariesAndNotes';

describe('Progress Note details component', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: convertNote(note),
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <ProgressNoteDetails record={convertNote(note)} />,
      {
        initialState: state,
        reducers: reducer,
        path: '/care-summaries-and-notes/954',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('should display the summary name', () => {
    const screen = setup();
    const header = screen.getAllByText('Physician procedure note', {
      exact: true,
      selector: 'h1',
    });
    expect(header).to.exist;
  });

  it('should display the formatted date', () => {
    const screen = setup();

    const formattedDate = screen.getAllByText('August', {
      exact: false,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });
});
