import React from 'react';
import { render } from '@testing-library/react';
import EducationTrainingField from '../../components/EducationTrainingField';

describe('EducationTrainingField', () => {
  it('should render', () => {
    const formData = {
      name: 'Test name',
      dates: { from: '2020-01-31', to: '2020-02-14' },
    };

    const tree = render(<EducationTrainingField formData={formData} />);

    tree.getByText(formData.name);
    tree.getByText('January 31, 2020 to February 14, 2020');
  });

  it('should render when no name', () => {
    const formData = {
      dates: { from: '2020-01-31', to: '2020-02-14' },
    };

    const tree = render(<EducationTrainingField formData={formData} />);

    tree.getByText('January 31, 2020 to February 14, 2020');
  });
});
