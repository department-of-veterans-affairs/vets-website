import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentViewField from '../../../components/FormFields/DependentViewField';

describe('hca <DependentViewField>', () => {
  describe('when the component renders', () => {
    it('should render first name, last name and relationship', () => {
      const props = {
        formData: {
          fullName: { first: 'John', last: 'Smith' },
          dependentRelation: 'son',
        },
      };
      const { getByText } = render(<DependentViewField {...props} />);
      expect(getByText(/john smith/i)).to.exist;
      expect(getByText(/son/i)).to.exist;
    });
  });
});
