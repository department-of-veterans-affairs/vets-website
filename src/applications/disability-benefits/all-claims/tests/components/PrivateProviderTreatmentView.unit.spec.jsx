import React from 'react';
import { render } from '@testing-library/react';
import PrivateProviderTreatmentView from '../../components/PrivateProviderTreatmentView';

describe('PrivateProviderTreatmentView', () => {
  it('should render ', () => {
    const formData = {
      providerFacilityName: 'Test facility',
      treatmentDateRange: { from: '2020-01-31', to: '2020-02-14' },
    };

    const tree = render(<PrivateProviderTreatmentView formData={formData} />);
    tree.getByText(formData.providerFacilityName);
    tree.getByText('January 31, 2020 to February 14, 2020');
  });
});
