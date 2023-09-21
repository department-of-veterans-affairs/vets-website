import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
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

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<AllergyDetails />, {
      initialState,
      reducers: reducer,
      path: '/allergies/7006',
    });
  });

  it('renders without errors', () => {
    expect(screen);
  });

  it('displays date of birth for the print view', () => {
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the allergy label and name', () => {
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
    expect(screen.getByText('July', { exact: false })).to.exist;
  });

  it('displays the reaction', () => {
    expect(screen.getByText('RASH', { exact: false })).to.exist;
  });

  it('displays the type of allergy', () => {
    expect(screen.getByText('food', { exact: false })).to.exist;
  });

  it('displays the location', () => {
    expect(
      screen.getByText('SLC4.FO-BAYPINES.MED.VA.GOV', {
        exact: true,
        selector: 'p',
      }),
    ).to.exist;
  });

  it('displays provider notes', () => {
    expect(screen.getByText("maruf's test comment", { exact: false })).to.exist;
  });
});
