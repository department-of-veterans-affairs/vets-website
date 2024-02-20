import React from 'react';
import { render } from '@testing-library/react';
import HospitalizationPeriodView from '../../components/HospitalizationPeriodView';

describe('HospitalizationPeriodView', () => {
  it('should render with name', () => {
    const formData = {
      name: 'Test name',
    };

    const tree = render(<HospitalizationPeriodView formData={formData} />);

    tree.getByText(formData.name);
  });
});
