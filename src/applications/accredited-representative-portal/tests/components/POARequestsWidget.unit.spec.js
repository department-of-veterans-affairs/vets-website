import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import POARequestsWidget from '../../components/POARequestsWidget';
import { mockPOARequests } from '../../mocks/mockPOARequests';

describe('POA Requests Widget', () => {
  it('renders headers', () => {
    const { getByTestId } = render(
      <POARequestsWidget poaRequests={mockPOARequests} />,
    );
    expect(getByTestId('poa-requests-widget-table')).to.exist;
    expect(
      getByTestId('poa-requests-widget-table-claimant-header').textContent,
    ).to.eq('Claimant');
    expect(
      getByTestId('poa-requests-widget-table-submitted-header').textContent,
    ).to.eq('Submitted');
    expect(
      getByTestId('poa-requests-widget-table-actions-header').textContent,
    ).to.eq('Actions');
  });

  it('renders requests', () => {
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
