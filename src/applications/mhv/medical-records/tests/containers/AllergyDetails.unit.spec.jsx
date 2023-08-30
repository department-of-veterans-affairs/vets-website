import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import AllergyDetails from '../../containers/AllergyDetails';
import reducer from '../../reducers';
import allergy from '../fixtures/allergy.json';
import { convertAllergy } from '../../reducers/allergies';

describe('Allergy details container', () => {
  const initialState = {
    mr: {
      allergies: {
        allergyDetails: convertAllergy(allergy),
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<AllergyDetails />, {
      initialState: state,
      reducers: reducer,
      path: '/allergies/7006',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays date of birth for the print view', () => {
    const screen = setup();
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const screen = setup();
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the allergy label and name', () => {
    const screen = setup();
    const allergyLabel = screen.getByText('Allergy:', {
      exact: false,
      selector: 'h1',
    });
    const allergyName = screen.getByText('FISH', {
      exact: true,
      selector: 'span',
    });
    expect(allergyLabel).to.exist;
    expect(allergyName).to.exist;
  });

  it('displays the date entered', () => {
    const screen = setup();
    expect(screen.getByText('July', { exact: false })).to.exist;
  });

  it('displays the reaction', () => {
    const screen = setup();
    expect(screen.getByText('RASH', { exact: false })).to.exist;
  });

  it('displays the type of allergy', () => {
    const screen = setup();
    expect(screen.getByText('food', { exact: false })).to.exist;
  });

  it('displays the location and drug class', () => {
    const screen = setup();
    expect(
      screen.getAllByText('None noted', {
        exact: true,
        selector: 'p',
      }).length,
    ).to.eq(2);
  });

  it('displays provider notes', () => {
    const screen = setup();
    expect(screen.getByText("maruf's test comment", { exact: false })).to.exist;
  });
});
