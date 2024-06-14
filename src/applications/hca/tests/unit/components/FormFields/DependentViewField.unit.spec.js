import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentViewField from '../../../../components/FormFields/DependentViewField';

describe('hca <DependentViewField>', () => {
  const getData = () => ({
    props: {
      formData: {
        fullName: { first: 'John', last: 'Smith' },
        dependentRelation: 'son',
      },
    },
  });

  context('when the component renders', () => {
    const { props } = getData();

    it('should render first name, last name and relationship', () => {
      const { getByText } = render(<DependentViewField {...props} />);
      expect(getByText(/john smith/i)).to.exist;
      expect(getByText(/son/i)).to.exist;
    });
  });
});
