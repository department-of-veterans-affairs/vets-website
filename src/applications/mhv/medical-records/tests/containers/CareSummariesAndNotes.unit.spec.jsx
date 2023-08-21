import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
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

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<CareSummariesAndNotes />, {
      initialState: state,
      reducers: reducer,
      path: '/care-summaries-and-notes',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Care summaries and notes', { exact: true })).to
      .exist;
  });

  it('displays additional info', () => {
    const screen = setup();
    expect(
      screen.getByText(
        'Review care summaries and notes in your VA medical records.',
        {
          exact: true,
        },
      ),
    ).to.exist;
  });
});
