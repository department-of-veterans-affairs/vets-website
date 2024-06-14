import React from 'react';
import { render } from '@testing-library/react';
import EmploymentHistoryCard from '../../components/EmploymentHistoryCard';

describe('EmploymentHistoryCard', () => {
  it('should render', () => {
    const formData = {
      name: 'Acme',
      dates: {
        from: '2021-01-01',
        to: '2022-01-03',
      },
    };
    const tree = render(<EmploymentHistoryCard formData={formData} />);

    tree.getByText(formData.name);
    tree.getByText('January 1, 2021 to January 3, 2022');
  });
});
