import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { MedicalTreatmentViewField } from '../../../components/MedicalTreatmentViewField';

describe('MedicalTreatmentViewField', () => {
  it('renders the facilityName', () => {
    const formData = { facilityName: 'Test Facility' };
    const { getByText } = render(
      <MedicalTreatmentViewField formData={formData} />,
    );
    expect(getByText('Test Facility')).to.exist;
  });
});
