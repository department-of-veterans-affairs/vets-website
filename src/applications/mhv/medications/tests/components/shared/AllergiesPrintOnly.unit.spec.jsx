import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AllergiesPrintOnly from '../../../components/shared/AllergiesPrintOnly';

describe('Medications Print Allergies', () => {
  const allergies = [
    {
      id: 1234,
      type: 'Medication',
      name: 'Penicillin',
      date: 'January 1, 2024',
      reaction: ['Abdominal pain', 'headaches'],
      location: 'SLC10 TEST LAB',
      observedOrReported:
        'Historical (you experienced this allergy or reaction in the past, before you started getting care at this VA location)',
      notes: 'Unit test',
    },
    {
      id: 1234,
      type: 'Medication',
      name: 'Penicillin',
      date: 'January 1, 2024',
      reaction: [],
      location: 'SLC10 TEST LAB',
      observedOrReported:
        'Historical (you experienced this allergy or reaction in the past, before you started getting care at this VA location)',
      notes: 'Unit test',
    },
  ];

  const setup = (emptyAllergies = false, allergiesError = false) => {
    if (emptyAllergies === true) {
      return render(
        <AllergiesPrintOnly allergies={[]} allergiesError={allergiesError} />,
      );
    }
    return render(
      <AllergiesPrintOnly
        allergies={allergies}
        allergiesError={allergiesError}
      />,
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('renders allergies', () => {
    const screen = setup();
    const allergyName = screen.findByText(allergies.name);
    expect(allergyName).to.exist;
  });

  it('renders empty list', () => {
    const screen = setup(true);
    const noAllergiesMessage = screen.getByTestId('no-allergies-message');
    expect(noAllergiesMessage).to.exist;
  });

  it('renders error message', () => {
    const screen = setup(false, true);
    const errorMessage = screen.getByTestId('allergy-error-message');
    expect(errorMessage).to.exist;
  });
});
