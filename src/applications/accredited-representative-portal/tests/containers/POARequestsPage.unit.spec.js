import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import POARequests from '../../containers/POARequestsPage';

describe('POARequests Page', () => {
  it('renders POA Requests Page', () => {
    render(<POARequests />);
  });

  it('renders heading', () => {
    const { getByTestId } = render(<POARequests />);
    expect(getByTestId('poa-requests-heading').textContent).to.equal(
      'Power of attorney requests',
    );
  });
});
