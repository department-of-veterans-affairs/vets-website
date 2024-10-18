import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import MedicationsListFilter from '../../../components/MedicationsList/MedicationsListFilter';

describe('Medicaitons List Filter component', () => {
  const setup = () => {
    return render(<MedicationsListFilter />);
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('renders accordion', () => {
    const screen = setup();
    const accordion = screen.getByTestId('filter-accordion');
    expect(accordion).to.exist;
  });
});
