import React from 'react';
import { render } from '@testing-library/react';
import PeriodOfConfinement from '../../components/PeriodOfConfinement';

describe('PeriodOfConfinement', () => {
  it('should render when unknown date', () => {
    const tree = render(<PeriodOfConfinement />);

    tree.getByText('Unknown');
  });

  it('should render when date provided', () => {
    const formData = {
      from: '2021-01-01',
      to: '2022-01-03',
    };

    const tree = render(<PeriodOfConfinement formData={formData} />);

    tree.getByText('January 1, 2021 to January 3, 2022');
  });
});
