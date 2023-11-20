import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import InsuranceProviderViewField from '../../../../components/FormFields/InsuranceProviderViewField';

describe('hca <InsuranceProviderViewField>', () => {
  const getData = () => ({
    props: {
      formData: { insuranceName: 'Aetna' },
    },
  });

  context('when the component renders', () => {
    const { props } = getData();

    it('should render first name, last name and relationship', () => {
      const { getByText } = render(<InsuranceProviderViewField {...props} />);
      expect(getByText(/aetna/i)).to.exist;
    });
  });
});
