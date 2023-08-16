import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import VaccineDetails from '../../containers/VaccineDetails';
import reducer from '../../reducers';
import vaccine from '../fixtures/vaccine.json';
import { convertVaccine } from '../../reducers/vaccines';

describe('Vaccines details container', () => {
  const initialState = {
    mr: {
      vaccines: {
        vaccineDetails: convertVaccine(vaccine),
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<VaccineDetails />, {
      initialState: state,
      reducers: reducer,
      path: '/vaccine-details/957',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays Date of birth for the print view', () => {
    const screen = setup();
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const screen = setup();
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the vaccine name as an h1', () => {
    const screen = setup();

    const vaccineName = screen.getByText(
      'INFLUENZA, INJECTABLE, QUADRIVALENT',
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(vaccineName).to.exist;
  });

  it('displays the formatted received date', () => {
    const screen = setup();
    const formattedDate = screen.getByText('August', {
      exact: false,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });

  it('displays the location', () => {
    const screen = setup();
    const location = screen.getByText('None noted', {
      exact: true,
      selector: 'p',
    });
    expect(location).to.exist;
  });
});
