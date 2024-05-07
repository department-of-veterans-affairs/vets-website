import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import MedicalRecords, { recordTypes } from '../../components/MedicalRecords';

describe('MHV Landing Page -- temporary Medical Records page', () => {
  it('renders', () => {
    const props = { blueButtonUrl: 'va.gov/bluebutton' };
    const { getByRole, getByTestId, getByText } = render(
      <MedicalRecords {...props} />,
    );
    getByTestId('mhvMedicalRecords');
    const backLink = getByRole('link', { name: /Back to My HealtheVet home$/ });
    expect(backLink.getAttribute('href')).to.eq('/my-health');
    getByRole('heading', { level: 1, name: 'Medical records' });
    const link = getByRole('link', { name: /^Download health records/ });
    expect(link.getAttribute('href')).to.eq(props.blueButtonUrl);
    recordTypes.forEach(type => getByText(type));
  });
});
