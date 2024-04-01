import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import POARequests from '../../containers/POARequests';

describe('POARequests', () => {
  const getPOARequests = () => render(<POARequests />);

  it('renders heading', () => {
    const { getByTestId } = getPOARequests();
    expect(getByTestId('poa-requests-heading').textContent).to.eq(
      'Power of attorney requests',
    );
  });

  it('renders POA Requests Table', () => {
    it('renders table', () => {
      const { getByTestId } = getPOARequests();
      expect(getByTestId('poa-requests-table')).to.exist;
    });
  });
});
