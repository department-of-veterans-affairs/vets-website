import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import CareSummariesAndNotes from '../../containers/CareSummariesAndNotes';
import reducer from '../../reducers';

describe('CareSummariesAndNotes list container', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesList: null,
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
