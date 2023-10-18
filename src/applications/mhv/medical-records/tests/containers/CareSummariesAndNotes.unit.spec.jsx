import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import CareSummariesAndNotes from '../../containers/CareSummariesAndNotes';
import reducer from '../../reducers';
import { convertNote } from '../../reducers/careSummariesAndNotes';
import notes from '../fixtures/notes.json';

describe('CareSummariesAndNotes list container', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesList: notes.entry.map(note => convertNote(note)),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<CareSummariesAndNotes />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes',
    });
  });

  it('renders without errors', () => {
    expect(
      screen.getByText('Most care summaries and notes are available', {
        exact: false,
      }),
    ).to.exist;
  });
});

describe('CareSummariesAndNotes list container still loading', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesList: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<CareSummariesAndNotes />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes',
    });
  });

  it('shows a loading indicator', () => {
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});
