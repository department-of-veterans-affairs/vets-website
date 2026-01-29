import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import { beforeEach } from 'mocha';
import Vaccines from '../../containers/Vaccines';
import reducer from '../../reducers';
import user from '../fixtures/user.json';
import vaccines from '../fixtures/vaccines.json';
import { convertVaccine } from '../../reducers/vaccines';

describe('Vaccines list container', () => {
  const initialState = {
    user,
    mr: {
      vaccines: {
        vaccinesList: vaccines.entry.map(vaccine =>
          convertVaccine(vaccine.resource),
        ),
      },
    },
  };
  let screen;

  beforeEach(() => {
    screen = renderWithStoreAndRouter(<Vaccines runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vaccines',
    });
  });

  it('renders without errors', () => {
    expect(screen.getByText('Vaccines', { exact: true })).to.exist;
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-download-menu');
    expect(printButton).to.exist;
  });

  it('should display a download started message when the download pdf button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });

  it('should display a download started message when the download txt file button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-2'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });
});

describe('Vaccines list container still loading', () => {
  const initialState = {
    user,
    mr: {
      vaccines: {},
      alerts: {
        alertList: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<Vaccines runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vaccines',
    });
  });

  it('displays a loading indicator', () => {
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('Vaccines list container first time loading', () => {
  const initialState = {
    user,
    mr: {
      vaccines: { listCurrentAsOf: undefined },
      alerts: { alertList: [] },
      refresh: { initialFhirLoad: new Date() },
    },
  };

  it('displays the first-time loading indicator when data is stale', () => {
    const screen = renderWithStoreAndRouter(<Vaccines runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vaccines',
    });

    expect(screen.getByTestId('initial-fhir-loading-indicator')).to.exist;
  });

  it('does not display the first-time loading indicator when data is current', () => {
    const screen = renderWithStoreAndRouter(<Vaccines runningUnitTest />, {
      initialState: {
        ...initialState,
        mr: { ...initialState.mr, vaccines: { listCurrentAsOf: new Date() } },
      },
      reducers: reducer,
      path: '/vaccines',
    });

    expect(screen.queryByTestId('initial-fhir-loading-indicator')).to.not.exist;
  });
});

describe('Vaccines list container with no vaccines', () => {
  it('displays a no vaccines message', () => {
    const initialState = {
      user,
      mr: {
        vaccines: {
          vaccinesList: [],
        },
        alerts: {
          alertList: [],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<Vaccines runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vaccines',
    });

    waitFor(() => {
      expect(
        screen.getByText('There are no vaccines in your VA medical records.', {
          exact: true,
        }),
      ).to.exist;
    });
  });
});

describe('Vaccines does not flash NoRecordsMessage before data loads', () => {
  it('does not show NoRecordsMessage when vaccinesList is undefined', () => {
    const initialState = {
      user,
      mr: {
        vaccines: {
          vaccinesList: undefined, // Data not yet fetched
        },
        alerts: { alertList: [] },
      },
    };

    const screen = renderWithStoreAndRouter(<Vaccines runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vaccines',
    });

    // Should NOT show the no records message when data is undefined
    expect(
      screen.queryByText('There are no vaccines in your VA medical records.', {
        exact: true,
      }),
    ).to.not.exist;
  });
});

describe('Vaccines list container with errors', async () => {
  const initialState = {
    user,
    mr: {
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

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<Vaccines runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vaccines',
    });
  });

  it('displays an error message', async () => {
    await waitFor(() => {
      expect(
        screen.getByText('We can’t access your vaccine records right now', {
          exact: false,
        }),
      ).to.exist;
    });
  });

  it('does not display a print button', () => {
    const printButton = screen.queryByTestId('print-download-menu');
    expect(printButton).to.be.null;
  });
});
