import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
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
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<VitalDetails />, {
      initialState,
      reducers: reducer,
      path: '/vitals/blood-pressure',
    });
  });

  it('renders without errors', () => {
    expect(screen);
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
});
