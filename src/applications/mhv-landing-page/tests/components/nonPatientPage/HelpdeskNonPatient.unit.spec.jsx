import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import HelpdeskNonPatient from '../../../components/nonPatientPage/HelpdeskNonPatient';

describe('HelpdeskNonPatient component', () => {
  it('renders the correct heading', () => {
    const { getByRole } = render(<HelpdeskNonPatient />);
    expect(
      getByRole('heading', {
        level: 2,
        name: /We don’t have VA health records for you/,
      }),
    ).to.exist;
  });
});
