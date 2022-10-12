import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentViewField from '../../components/FormFields/DependentViewField';

describe('hca <DependentViewField>', () => {
  it("should render dependent's first and last name and relationship", () => {
    const formData = {
      fullName: { first: 'John', last: 'Smith' },
      dependentRelation: 'son',
    };

    const { getByText } = render(<DependentViewField formData={formData} />);

    expect(getByText(/john smith/i)).to.exist;
    expect(getByText(/son/i)).to.exist;
  });
});
