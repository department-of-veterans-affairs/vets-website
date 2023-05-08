import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import AllergyDetails from '../../containers/AllergyDetails';
import reducer from '../../reducers';
import { dateFormat } from '../../util/helpers';

describe('Allergy details container', () => {
  const initialState = {
    mr: {
      allergies: {
        allergyDetails: {
          id: 123,
          name: 'Penicillin',
          dateEntered: '2022-04-01T17:42:46.000Z',
          reaction: 'Urticaria',
          allergyType: 'Drug allergy',
          drugClass: 'Penicillin-G related penicillins',
          location: 'Washington DC VA medical center',
          observed: true,
          notes: [],
        },
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<AllergyDetails />, {
      initialState: state,
      reducers: reducer,
      path: '/allergies/123',
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

  it('displays the allergy name as an h1', () => {
    const screen = setup();

    const allergyName = screen.getByText(
      `Allergy: ${initialState.mr.allergies.allergyDetails.name}`,
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(allergyName).to.exist;
  });

  it('displays the formatted received date', () => {
    const screen = setup();
    const formattedDate = screen.getByText(
      dateFormat(
        initialState.mr.allergies.allergyDetails.dateEntered,
        'MMMM D, YYYY',
      ),
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(formattedDate).to.exist;
  });

  it('displays the location', () => {
    const screen = setup();
    const location = screen.getByText(
      initialState.mr.allergies.allergyDetails.location,
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(location).to.exist;
  });
});
