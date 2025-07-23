import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { render } from '../unit-spec-helpers';
import HeaderLayout from '../../components/HeaderLayout';

describe('MHV Landing Page -- Header Layout', () => {
  it('renders', async () => {
    const { getByTestId } = render(<HeaderLayout />);
    await waitFor(() => {
      getByTestId('mhv-header-layout--milestone-2');
    });
  });
  it('renders OH/My VA Health link when told to', async () => {
    const { getByTestId, getByRole } = render(<HeaderLayout isCerner />);
    await waitFor(() => {
      getByTestId('mhv-header-layout--milestone-2');
      const ohLink = getByRole('link', {
        name: /Go to the My VA Health portal/,
      });
      expect(ohLink.href).to.match(/patientportal\.myhealth\.va\.gov/);
    });
  });
});
