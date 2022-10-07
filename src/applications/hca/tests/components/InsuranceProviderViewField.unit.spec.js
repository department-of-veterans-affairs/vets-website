import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import InsuranceProviderViewField from '../../components/FormFields/InsuranceProviderViewField';

describe('hca <InsuranceProviderViewField>', () => {
  it('should render insurance provider name', () => {
    const formData = {
      insuranceName: 'Aetna',
    };

    const { getByText } = render(
      <InsuranceProviderViewField formData={formData} />,
    );

    expect(getByText(/aetna/i)).to.exist;
  });
});
