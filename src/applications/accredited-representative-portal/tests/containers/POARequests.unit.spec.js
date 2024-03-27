import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import POARequests from '../../containers/POARequests';

describe('POARequests', () => {
  it('renders heading', () => {
    const { getByTestId } = render(<POARequests />);
    expect(getByTestId('poa-requests-heading').textContent).to.eq(
      'Power of attorney requests',
    );
  });

  it('renders POA Requests Table', () => {
    it('renders table', () => {
      const { getByTestId } = render(<POARequests />);
      expect(getByTestId('poa-requests-table')).to.exist;
    });
  });
});
