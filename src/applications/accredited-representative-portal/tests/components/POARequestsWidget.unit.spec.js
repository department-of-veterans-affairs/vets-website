import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import POARequestsWidget from '../../components/POARequestsWidget/POARequestsWidget';
import { mockPOARequests } from '../../mocks/mockPOARequests';

describe('POARequestsWidget', () => {
  it('renders View all link', () => {
    const { getByTestId } = render(
      <POARequestsWidget poaRequests={mockPOARequests} />,
    );
    expect(getByTestId(`poa-requests-widget-view-all-link`).textContent).to.eq(
      'View all',
    );
  });

  it('renders table', () => {
    const { getByTestId } = render(
      <POARequestsWidget poaRequests={mockPOARequests} />,
    );
    expect(getByTestId('poa-requests-widget-table')).to.exist;
  });

  it('renders table headers', () => {
    const { getByTestId } = render(
      <POARequestsWidget poaRequests={mockPOARequests} />,
    );
    expect(
      getByTestId('poa-requests-widget-table-headers-claimant').textContent,
    ).to.eq('Claimant');
    expect(
      getByTestId('poa-requests-widget-table-headers-submitted').textContent,
    ).to.eq('Submitted');
    expect(
      getByTestId('poa-requests-widget-table-headers-actions').textContent,
    ).to.eq('Actions');
  });

  it('renders POA requests in table', () => {
    const { getByTestId } = render(
      <POARequestsWidget poaRequests={mockPOARequests} />,
    );
    mockPOARequests.forEach(({ id, name, date }) => {
      expect(
        getByTestId(`poa-requests-widget-table-${id}-claimant`).textContent,
      ).to.eq(name);
      expect(
        getByTestId(`poa-requests-widget-table-${id}-submitted`).textContent,
      ).to.eq(date);
    });
  });
});
