import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/dom';
import CareSummariesAndNotes from '../../containers/CareSummariesAndNotes';
import reducer from '../../reducers';
import { convertCareSummariesAndNotesRecord } from '../../reducers/careSummariesAndNotes';
import notes from '../fixtures/notes.json';
import user from '../fixtures/user.json';

describe('CareSummariesAndNotes list container', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesList: notes.entry.map(note =>
          convertCareSummariesAndNotesRecord(note.resource),
        ),
        dateRange: {
          option: '3',
          fromDate: '2025-08-13',
          toDate: '2025-11-13',
        },
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
      screen.getByText(
        'This list doesn’t include care summaries from before 2013.',
        {
          exact: false,
        },
      ),
    ).to.exist;
  });
});

describe('CareSummariesAndNotes list container still loading', () => {
  it('shows a loading indicator', () => {
    const initialState = {
      mr: {
        careSummariesAndNotes: {
          dateRange: {
            option: '3',
            fromDate: '2025-08-13',
            toDate: '2025-11-13',
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<CareSummariesAndNotes />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes',
    });

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('CareSummariesAndNotes list container with no records', () => {
  it('shows a no records message', () => {
    const initialState = {
      careSummariesAndNotes: {
        careSummariesAndNotesList: [],
        dateRange: {
          option: '3',
          fromDate: '2025-08-13',
          toDate: '2025-11-13',
        },
      },
      alerts: {
        alertList: [],
      },
    };

    const screen = renderWithStoreAndRouter(<CareSummariesAndNotes />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes',
    });

    waitFor(() => {
      expect(
        screen.getByText(
          'There are no care summaries and notes in your VA medical records.',
          { exact: false },
        ),
      ).to.exist;
    });
  });
});

describe('CareSummariesAndNotes list container with errors', () => {
  it('displays an error', async () => {
    const initialState = {
      user,
      mr: {
        careSummariesAndNotesList: {
          dateRange: {
            option: '3',
            fromDate: '2025-08-13',
            toDate: '2025-11-13',
          },
        },

        alerts: {
          alertList: [
            {
              datestamp: '2023-10-10T16:03:28.568Z',
              isActive: true,
              type: 'error',
            },
            {
              datestamp: '2023-10-10T16:03:28.572Z',
              isActive: true,
              type: 'error',
            },
          ],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<CareSummariesAndNotes />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes',
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'We can’t access your care summaries and notes records right now',
          {
            exact: false,
          },
        ),
      ).to.exist;
    });
  });
});

describe('CareSummariesAndNotes does not flash NoRecordsMessage before data loads', () => {
  it('does not show NoRecordsMessage when careSummariesAndNotesList is undefined', () => {
    const initialState = {
      user,
      mr: {
        careSummariesAndNotes: {
          careSummariesAndNotesList: undefined, // Data not yet fetched
          dateRange: {
            option: '3',
            fromDate: '2025-08-13',
            toDate: '2025-11-13',
          },
        },
        alerts: { alertList: [] },
      },
    };

    const screen = renderWithStoreAndRouter(<CareSummariesAndNotes />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes',
    });

    // Should NOT show the no records message when data is undefined
    expect(
      screen.queryByText(
        'There are no care summaries and notes in your VA medical records',
        { exact: false },
      ),
    ).to.not.exist;
  });
});

describe('CareSummariesAndNotes global isLoading states', () => {
  const baseState = {
    user,
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesList: [],
        dateRange: {
          option: '3',
          fromDate: '2025-08-13',
          toDate: '2025-11-13',
        },
      },
      alerts: { alertList: [] },
    },
  };

  it('renders TrackedSpinner when feature toggles are loading', () => {
    const initialState = {
      ...baseState,
      featureToggles: { loading: true },
      drupalStaticData: { vamcEhrData: { loading: false } },
    };
    const screen = renderWithStoreAndRouter(<CareSummariesAndNotes />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes',
    });
    expect(screen.queryByTestId('loading-indicator')).to.exist;
  });

  it('renders TrackedSpinner when Drupal EHR data is loading', () => {
    const initialState = {
      ...baseState,
      featureToggles: { loading: false },
      drupalStaticData: { vamcEhrData: { loading: true } },
    };
    const screen = renderWithStoreAndRouter(<CareSummariesAndNotes />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes',
    });
    expect(screen.queryByTestId('loading-indicator')).to.exist;
  });
});
