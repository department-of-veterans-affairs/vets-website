import React from 'react';
import { render } from '@testing-library/react';
import MedicalRecords from '../../components/MedicalRecords';

describe('MHV Landing Page -- temporary Medical Records page', () => {
  it('renders', () => {
    const { getByRole, getByTestId } = render(<MedicalRecords />);
    getByTestId('mhv-medicalRecordsLandingPage');
    getByRole('heading', { name: 'Medical records' });
  });
});
