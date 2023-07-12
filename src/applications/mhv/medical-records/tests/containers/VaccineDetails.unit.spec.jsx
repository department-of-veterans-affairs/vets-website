import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import VaccineDetails from '../../containers/VaccineDetails';
import reducer from '../../reducers';

describe('Vaccines details container', () => {
  const initialState = {
    mr: {
      vaccines: {
        vaccineDetails: {
          id: '123',
          name: 'COVID-19 vaccine',
          date: '2022-06-14T17:42:46.000Z',
          location: 'school parking lot',
          manufacturer: 'Pfizer',
          reactions: ['sore arm', 'fever'],
          notes: [
            'Protects from delta variant',
            'May need another booster for other variants',
          ],
        },
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<VaccineDetails />, {
      initialState: state,
      reducers: reducer,
      path: '/vaccine-details/123',
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
      initialState.mr.vaccines.vaccineDetails.name,
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(vaccineName).to.exist;
  });

  it('displays the formatted received date', () => {
    const screen = setup();
    const formattedDate = screen.getByText('June 14, 2022', {
      exact: true,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });

  it('displays the manufacturer', () => {
    const screen = setup();
    const manufacturer = screen.getByText(
      initialState.mr.vaccines.vaccineDetails.manufacturer,
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(manufacturer).to.exist;
  });

  it('displays the location', () => {
    const screen = setup();
    const location = screen.getByText(
      initialState.mr.vaccines.vaccineDetails.location,
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(location).to.exist;
  });
});
