import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import { beforeEach } from 'mocha';
import reducer from '../../reducers';
import { user } from '../fixtures/user-reducer.json';
import VitalDetails from '../../containers/VitalDetails';
import vital from '../fixtures/vital.json';
import vitalWithVitalString from '../fixtures/vitalWithVitalString.json';
import { convertVital } from '../../reducers/vitals';

describe('Vital details container', () => {
  const initialState = {
    mr: {
      vitals: {
        vitalDetails: [convertVital(vital)],
      },
    },
    user,
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<VitalDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vitals/blood-pressure-history',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('displays the vital name inside an h1 as a span', () => {
    const vitalNames = screen.getAllByText('Blood pressure', {
      exact: true,
      selector: 'h1',
    });

    expect(vitalNames).to.have.lengthOf(2);
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-download-menu');
    expect(printButton).to.exist;
  });

  it('displays the formatted received date', () => {
    waitFor(() => {
      const formattedDate = screen.getAllByText(
        'September 1, 2004, 12:00 a.m.',
        {
          exact: true,
          selector: 'h2',
        },
      );
      expect(formattedDate.length).to.eq(2);
    });
  });

  it('displays the result', () => {
    waitFor(() => {
      const location = screen.getAllByText('126/70', {
        exact: true,
        selector: 'p',
      });
      expect(location.length).to.eq(2);
    });
  });

  it('displays the location and provider notes', () => {
    waitFor(() => {
      const location = screen.getAllByText('None recorded', {
        exact: true,
        selector: 'p',
      });
      expect(location.length).to.eq(4);
    });
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

describe('Vitals details container with errors', () => {
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
    screen = renderWithStoreAndRouter(<VitalDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vitals/blood-pressure-history',
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

describe('Vitals details container with valueString', () => {
  const initialState = {
    mr: {
      vitals: {
        vitalDetails: [convertVital(vitalWithVitalString)],
      },
    },
    user,
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<VitalDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vitals/breathing-rate-history',
    });
  });

  it('displays the result string when the vital has valueString instead of valueQuantity', async () => {
    await waitFor(() => {
      const result = screen.getByTestId('vital-result');
      expect(result.innerHTML).to.equal('Unavailable');
    });
  });
});
