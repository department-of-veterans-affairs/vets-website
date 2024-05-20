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
    getByRole('heading', { level: 1, name: 'Medical records' });
    const name = 'Go back to the previous version of Medical Records';
    const link = getByRole('link', { name });
    expect(link.getAttribute('href')).to.eq(props.blueButtonUrl);
    recordTypes.forEach(type => getByText(type));
  });
});
