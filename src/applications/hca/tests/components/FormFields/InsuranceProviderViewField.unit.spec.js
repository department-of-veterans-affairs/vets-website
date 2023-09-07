import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import InsuranceProviderViewField from '../../../components/FormFields/InsuranceProviderViewField';

describe('hca <InsuranceProviderViewField>', () => {
  describe('when the component renders', () => {
    it('should render first name, last name and relationship', () => {
      const props = { formData: { insuranceName: 'Aetna' } };
      const { getByText } = render(<InsuranceProviderViewField {...props} />);
      expect(getByText(/aetna/i)).to.exist;
    });
  });
});
