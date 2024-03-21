import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import POARequestsWidget from '../../components/POARequestsWidget';
import { mockPOARequests } from '../../mocks/mockPOARequests';

describe('POA Requests Widget', () => {
  it('renders headers', () => {
    const { getByTestId } = render(<POARequestsWidget />);
    expect(getByTestId('poa-requests-widget-table')).to.exist;
    expect(
      getByTestId('poa-requests-widget-table-claimant-header').textContent,
    ).to.equal('Claimant');
    expect(
      getByTestId('poa-requests-widget-table-submitted-header').textContent,
    ).to.equal('Submitted');
    expect(
      getByTestId('poa-requests-widget-table-actions-header').textContent,
    ).to.equal('Actions');
  });

  it('renders requests', () => {
    const { getByTestId } = render(<POARequestsWidget />);
    mockPOARequests.forEach(({ id, name, date }) => {
      expect(
        getByTestId(`poa-requests-widget-table-${id}-claimant`).textContent,
      ).to.equal(name);
      expect(
        getByTestId(`poa-requests-widget-table-${id}-submitted`).textContent,
      ).to.equal(date);
    });
  });
});
