import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import { beforeEach } from 'mocha';
import reducer from '../../reducers';
import { user } from '../fixtures/user-reducer.json';
import VitalDetails from '../../containers/VitalDetails';
import vital from '../fixtures/vital.json';
import { convertVital } from '../../reducers/vitals';

describe('Vital details container', () => {
  const initialState = {
    mr: {
      vitals: {
        vitalDetails: [convertVital(vital)],
      },
    },
    user,
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medical_records_allow_txt_downloads: true,
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

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('displays the vital name inside an h1 as a span', () => {
    const vitalName = screen.getByText('Blood pressure', {
      exact: true,
      selector: 'h1',
    });
    expect(vitalName).to.exist;
  });

  it('displays Date of birth for the print view', () => {
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the formatted received date', () => {
    waitFor(() => {
      const formattedDate = screen.getAllByText('September', {
        exact: false,
        selector: 'h2',
      });
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
      const location = screen.getAllByText('None noted', {
        exact: true,
        selector: 'p',
      });
      expect(location.length).to.eq(4);
    });
  });

  it('should download a pdf', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen).to.exist;
  });

  it('should download a text file', () => {
    fireEvent.click(screen.getByTestId('printButton-2'));
    expect(screen).to.exist;
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
