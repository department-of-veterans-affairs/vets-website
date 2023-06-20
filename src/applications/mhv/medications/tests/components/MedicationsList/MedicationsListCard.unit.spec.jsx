import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import prescriptions from '../../fixtures/presciptions.json';
import MedicationsListCard from '../../../components/MedicationsList/MedicationsListCard';

describe('Medication card component', () => {
  const rx = prescriptions[0];
  const setup = () => {
    return render(<MedicationsListCard rx={rx} />);
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });
});
