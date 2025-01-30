import React from 'react';
import { render } from '@testing-library/react';
import RecordField from '../../../components/RecordField';

describe('RecordField', () => {
  it('should render', () => {
    const formData = {
      providerFacilityName: 'Test Facility',
    };
    const { getByText } = render(<RecordField formData={formData} />);
    getByText('Test Facility');
  });
});
