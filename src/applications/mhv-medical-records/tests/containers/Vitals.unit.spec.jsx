import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/react';
import Vitals from '../../containers/Vitals';
import reducer from '../../reducers';
import vitals from '../fixtures/vitals.json';
import vitalsWithNoBloodPressure from '../fixtures/vitalsWithNoBloodPressure.json';
import { convertVital } from '../../reducers/vitals';
import user from '../fixtures/user.json';

describe('Vitals list container', () => {
  const initialState = {
    mr: {
      vitals: {
        vitalsList: vitals.entry.map(item => convertVital(item.resource)),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<Vitals />, {
      initialState,
      reducers: reducer,
      path: '/vitals',
    });
  });

  it('renders without errors', () => {
    expect(screen.getByText('Vitals', { exact: true })).to.exist;
  });

  it('displays a subheading', () => {
    expect(
      screen.getByText(
        'Vitals are basic health numbers your providers check at your appointments.',
        {
          exact: true,
        },
      ),
    ).to.exist;
  });

  it('displays seven types of records', async () => {
    await waitFor(() => {
      expect(screen.getAllByTestId('record-list-item').length).to.eq(14);
    });
  });

  it('displays Blood pressure vitals', async () => {
    await waitFor(() => {
      expect(
        screen.getAllByText('Blood pressure', { selector: 'h2', exact: true }),
      ).to.exist;
    });
  });

  it('displays Heart rate vitals', async () => {
    await waitFor(() => {
      expect(screen.getAllByText('Heart rate', { selector: 'h2', exact: true }))
        .to.exist;
    });
  });

  it('displays Breathing rate vitals', async () => {
    await waitFor(() => {
      expect(
        screen.getAllByText('Breathing rate', { selector: 'h2', exact: true }),
      ).to.exist;
    });
  });

  it('displays Blood oxygen level vitals', async () => {
    await waitFor(() => {
      expect(
        screen.getAllByText('Blood oxygen level (pulse oximetry)', {
          selector: 'h2',
          exact: true,
        }),
      ).to.exist;
    });
  });

  it('displays Temperature vitals', async () => {
    await waitFor(() => {
      expect(
        screen.getAllByText('Temperature', { selector: 'h2', exact: true }),
      ).to.exist;
    });
  });

  it('displays Weight vitals', async () => {
    await waitFor(() => {
      expect(screen.getAllByText('Weight', { selector: 'h2', exact: true })).to
        .exist;
    });
  });

  it('displays Height vitals', async () => {
    await waitFor(() => {
      expect(screen.getAllByText('Height', { selector: 'h2', exact: true })).to
        .exist;
    });
  });

  it('displays the proper units for Blood pressure', async () => {
    await waitFor(() => {
      expect(screen.getAllByText('130/70', { selector: 'span', exact: true }))
        .to.exist;
    });
  });

  it('displays the proper units for Heart rate', async () => {
    await waitFor(() => {
      expect(
        screen.getAllByText('70 beats per minute', {
          selector: 'span',
          exact: true,
        }),
      ).to.exist;
    });
  });

  it('displays the proper units for Breathing rate', async () => {
    await waitFor(() => {
      expect(
        screen.getAllByText('15 breaths per minute', {
          selector: 'span',
          exact: true,
        }),
      ).to.exist;
    });
  });

  it('displays the proper units for Blood oxygen level (pulse oximetry)', async () => {
    await waitFor(() => {
      expect(screen.getAllByText('98%', { selector: 'span', exact: true })).to
        .exist;
    });
  });

  it('displays the proper units for Temperature', async () => {
    await waitFor(() => {
      expect(screen.getAllByText('99 °F', { selector: 'span', exact: true })).to
        .exist;
    });
  });

  it('displays the proper units for Weight', async () => {
    await waitFor(() => {
      expect(
        screen.getAllByText('185 pounds', { selector: 'span', exact: true }),
      ).to.exist;
    });
  });

  it('displays the proper units for Height', async () => {
    await waitFor(() => {
      expect(
        screen.getAllByText('5 feet, 10 inches', {
          selector: 'span',
          exact: true,
        }),
      ).to.exist;
    });
  });

  it('displays the types in the proper order', async () => {
    let bloodPressure;
    let heartRate;
    let breathingRate;
    let bloodOxygen;
    let temperature;
    let weight;
    let height;

    await waitFor(() => {
      [bloodPressure] = screen.getAllByText('Blood pressure', {
        selector: 'h2',
        exact: true,
      });
      [heartRate] = screen.getAllByText('Heart rate', {
        selector: 'h2',
        exact: true,
      });
      [breathingRate] = screen.getAllByText('Breathing rate', {
        selector: 'h2',
        exact: true,
      });
      [bloodOxygen] = screen.getAllByText(
        'Blood oxygen level (pulse oximetry)',
        {
          selector: 'h2',
          exact: true,
        },
      );
      [temperature] = screen.getAllByText('Temperature', {
        selector: 'h2',
        exact: true,
      });
      [weight] = screen.getAllByText('Weight', { selector: 'h2', exact: true });
      [height] = screen.getAllByText('Height', { selector: 'h2', exact: true });

      expect(bloodPressure.compareDocumentPosition(heartRate)).to.eq(4);
      expect(heartRate.compareDocumentPosition(breathingRate)).to.eq(4);
      expect(breathingRate.compareDocumentPosition(bloodOxygen)).to.eq(4);
      expect(bloodOxygen.compareDocumentPosition(temperature)).to.eq(4);
      expect(temperature.compareDocumentPosition(weight)).to.eq(4);
      expect(weight.compareDocumentPosition(height)).to.eq(4);
      expect(height.compareDocumentPosition(weight)).to.eq(2);
    });
  });
});

describe('Vitals list container with errors', () => {
  const initialState = {
    user,
    mr: {
      vitals: {},
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
    screen = renderWithStoreAndRouter(<Vitals />, {
      initialState,
      reducers: reducer,
      path: '/vitals',
    });
  });

  it('displays an error', async () => {
    await waitFor(() => {
      expect(
        screen.getByText('We can’t access your vitals records right now', {
          exact: false,
        }),
      ).to.exist;
    });
  });
});

describe('Vitals list container with no vitals', () => {
  const initialState = {
    user,
    mr: {
      vitals: {
        vitalsList: [],
      },
      alerts: {
        alertList: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<Vitals />, {
      initialState,
      reducers: reducer,
      path: '/vitals',
    });
  });

  it('displays a no vitals message', () => {
    expect(
      screen.getByText('There are no vitals in your VA medical records.', {
        exact: true,
      }),
    ).to.exist;
  });
});

describe('Vitals list container with no vitals of a type', () => {
  const initialState = {
    user,
    mr: {
      vitals: {
        vitalsList: vitalsWithNoBloodPressure.entry.map(item =>
          convertVital(item.resource),
        ),
      },
      alerts: {
        alertList: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<Vitals />, {
      initialState,
      reducers: reducer,
      path: '/vitals',
    });
  });

  it('displays a no vitals message for blood pressure', () => {
    waitFor(() => {
      expect(
        screen.getAllByText(
          'There are no blood pressure results in your VA medical records.',
          {
            exact: true,
          },
        ).length,
      ).to.eq(2);
    });
  });
});

describe('Vitals does not flash NoRecordsMessage before data loads', () => {
  it('does not show NoRecordsMessage when vitalsList is undefined', () => {
    const initialState = {
      user,
      mr: {
        vitals: {
          vitalsList: undefined, // Data not yet fetched
        },
        alerts: { alertList: [] },
      },
    };

    const screen = renderWithStoreAndRouter(<Vitals />, {
      initialState,
      reducers: reducer,
      path: '/vitals',
    });

    // Should NOT show the no records message when data is undefined
    expect(
      screen.queryByText('There are no vitals in your VA medical records.', {
        exact: true,
      }),
    ).to.not.exist;
  });
});

describe('Vitals list container first time loading', () => {
  const initialState = {
    user,
    mr: {
      vitals: { listCurrentAsOf: undefined },
      alerts: { alertList: [] },
      refresh: { initialFhirLoad: new Date() },
    },
  };

  it('displays the first-time loading indicator when data is stale', () => {
    const screen = renderWithStoreAndRouter(<Vitals runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vitals',
    });

    expect(screen.getByTestId('initial-fhir-loading-indicator')).to.exist;
  });

  it('does not display the first-time loading indicator when data is current', () => {
    const screen = renderWithStoreAndRouter(<Vitals runningUnitTest />, {
      initialState: {
        ...initialState,
        mr: { ...initialState.mr, vitals: { listCurrentAsOf: new Date() } },
      },
      reducers: reducer,
      path: '/vitals',
    });

    expect(screen.queryByTestId('initial-fhir-loading-indicator')).to.not.exist;
  });
});
