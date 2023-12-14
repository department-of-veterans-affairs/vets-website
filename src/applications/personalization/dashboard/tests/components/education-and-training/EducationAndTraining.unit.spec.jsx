import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import EducationAndTraining from '../../../components/education-and-training/EducationAndTraining';

describe('<EducationAndTraining />', () => {
  it('should render', () => {
    const tree = render(<EducationAndTraining />);

    expect(tree.getByTestId('dashboard-section-education-and-training')).to
      .exist;
    expect(tree.getByText(/Learn how to apply for VA education/i)).to.exist;
    expect(tree.getByText(/Popular actions for education/i)).to.exist;
    expect(tree.getByText(/Compare GI Bill benefits/i)).to.exist;
    expect(tree.getByText(/Check your Post-9\/11 GI/i)).to.exist;
  });
});
