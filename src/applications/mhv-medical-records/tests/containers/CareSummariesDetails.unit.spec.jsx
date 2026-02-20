import { expect } from 'chai';
import React from 'react';
import { Route } from 'react-router-dom';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import user from '../fixtures/user.json';
import { convertCareSummariesAndNotesRecord } from '../../reducers/careSummariesAndNotes';
import physicianProcedureNote from '../fixtures/physicianProcedureNote.json';
import dischargeSummary from '../fixtures/dischargeSummary.json';
import CareSummariesDetails from '../../containers/CareSummariesDetails';

describe('CareSummariesAndNotes details', () => {
  const initialState = {
    user,
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: convertCareSummariesAndNotesRecord(
          physicianProcedureNote,
        ),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<CareSummariesDetails />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes/123',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });
});

describe('CareSummariesDetails Adverse React/Allergy', () => {
  it('displays progress note heading', () => {
    const initialState = {
      user,
      mr: {
        careSummariesAndNotes: {
          careSummariesAndNotesDetails: convertCareSummariesAndNotesRecord(
            physicianProcedureNote,
          ),
        },
      },
    };

    const screen = renderWithStoreAndRouter(<CareSummariesDetails />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes/123',
    });

    expect(
      screen.getByText('Adverse React/Allergy', {
        selector: 'h1',
      }),
    ).to.exist;
  });
});

describe('CareSummariesDetails discharge summary', () => {
  it('displays discharge summary heading', () => {
    const initialState = {
      user,
      mr: {
        careSummariesAndNotes: {
          careSummariesAndNotesDetails: convertCareSummariesAndNotesRecord(
            dischargeSummary,
          ),
        },
      },
    };

    const screen = renderWithStoreAndRouter(<CareSummariesDetails />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes/123',
    });

    expect(screen.getByText('Discharge Summary', { selector: 'h1' })).to.exist;
  });
});

describe('CareSummariesDetails loading', () => {
  it('displays a loading indicator', () => {
    const initialState = {
      user,
      mr: {
        careSummariesAndNotes: {},
      },
    };

    const screen = renderWithStoreAndRouter(<CareSummariesDetails />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes/123',
    });

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('CareSummariesDetails accelerated path', () => {
  it('displays a loading indicator while fetching oracle-health note details', () => {
    const initialState = {
      user,
      mr: {
        careSummariesAndNotes: {
          careSummariesAndNotesList: [{ id: '123', source: 'oracle-health' }],
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_accelerated_delivery_enabled: true,
        // eslint-disable-next-line camelcase
        mhv_accelerated_delivery_care_notes_enabled: true,
      },
    };

    const screen = renderWithStoreAndRouter(<CareSummariesDetails />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes/123',
    });

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('CareSummariesDetails accelerated path - invalid note ID', () => {
  it('redirects to list when note ID is not in the loaded list', async () => {
    const initialState = {
      user,
      mr: {
        careSummariesAndNotes: {
          careSummariesAndNotesList: [{ id: '456', source: 'vista' }],
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_accelerated_delivery_enabled: true,
        // eslint-disable-next-line camelcase
        mhv_accelerated_delivery_care_notes_enabled: true,
      },
    };

    const screen = renderWithStoreAndRouter(
      <Route path="/summaries-and-notes/:summaryId">
        <CareSummariesDetails />
      </Route>,
      {
        initialState,
        reducers: reducer,
        path: '/summaries-and-notes/999',
      },
    );

    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal(
        '/summaries-and-notes/',
      );
    });
  });
});

describe('CareSummariesDetails with errors', () => {
  it('displays an error', async () => {
    const initialState = {
      user,
      mr: {
        careSummariesAndNotes: {},
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

    const screen = renderWithStoreAndRouter(<CareSummariesDetails />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes/123',
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
