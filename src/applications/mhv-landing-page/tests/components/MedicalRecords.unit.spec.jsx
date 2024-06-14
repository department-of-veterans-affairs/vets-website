import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import MedicalRecords, { recordTypes } from '../../components/MedicalRecords';

describe('MHV Landing Page -- temporary Medical Records page', () => {
  const pageHeading = 'the heading';

  it('renders', () => {
    const props = {
      blueButtonUrl: 'va.gov/bluebutton',
      pageHeading,
    };
    const { getByRole, getByTestId, getByText } = render(
      <MedicalRecords {...props} />,
    );
    getByTestId('mhvMedicalRecords');
    getByRole('heading', { level: 1, name: pageHeading });
    const name = 'Go back to the previous version of My HealtheVet';
    const link = getByRole('link', { name });
    expect(link.getAttribute('href')).to.eq(props.blueButtonUrl);
    recordTypes.forEach(type => getByText(type));
  });
});
