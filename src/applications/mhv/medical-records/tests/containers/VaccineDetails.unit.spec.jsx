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
          name: 'COVID-19 vaccine',
          id: '123',
          date: '2022-06-14T17:42:46.000Z',
          type: 'COVID-19 booster',
          dosage: '1st booster',
          series: 'Phizer',
          facility: 'school parking lot',
          reactions: ['sore arm', 'fever'],
          comments: [
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

  it('displays the type and dosage', () => {
    const screen = setup();
    const formattedDate = screen.getByText('COVID-19 booster, 1st booster', {
      exact: true,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });

  it('displays the series', () => {
    const screen = setup();
    const formattedDate = screen.getByText(
      initialState.mr.vaccines.vaccineDetails.series,
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(formattedDate).to.exist;
  });

  it('displays the location', () => {
    const screen = setup();
    const formattedDate = screen.getByText(
      initialState.mr.vaccines.vaccineDetails.series,
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(formattedDate).to.exist;
  });
});
