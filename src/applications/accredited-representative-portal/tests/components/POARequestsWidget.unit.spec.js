import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import {
  createRelationshipCell,
  formatDate,
} from '../../components/POARequestsTable/POARequestsTable';
import POARequestsWidget from '../../components/POARequestsWidget/POARequestsWidget';
import { mockPOARequests } from '../../mocks/mockPOARequests';

describe('POARequestsWidget', () => {
  const getPOARequestsWidget = () =>
    render(
      <MemoryRouter>
        <POARequestsWidget poaRequests={mockPOARequests} />
      </MemoryRouter>,
    );

  it('renders View all link', () => {
    const { getByTestId } = getPOARequestsWidget();
    expect(getByTestId(`poa-requests-widget-view-all-link`).textContent).to.eq(
      'View all',
    );
  });

  it('renders table', () => {
    const { getByTestId } = getPOARequestsWidget();
    expect(getByTestId('poa-requests-widget-table')).to.exist;
  });

  it('renders table headers', () => {
    const { getByTestId } = getPOARequestsWidget();
    expect(
      getByTestId('poa-requests-widget-table-headers-name').textContent,
    ).to.eq('Veteran/Claimant');
    expect(
      getByTestId('poa-requests-widget-table-headers-received').textContent,
    ).to.eq('POA received date');
  });

  it('renders POA requests in table', () => {
    const { getByTestId } = getPOARequestsWidget();
    mockPOARequests.forEach(({ procId, attributes }) => {
      expect(
        getByTestId(`poa-requests-widget-table-${procId}-name`).textContent,
      ).to.eq(
        `${attributes.claimant.lastName}, ${attributes.claimant.firstName}`,
      );
      expect(
        getByTestId(`poa-requests-widget-table-${procId}-relationship`)
          .textContent,
      ).to.eq(createRelationshipCell(attributes));
      expect(
        getByTestId(`poa-requests-widget-table-${procId}-received`).textContent,
      ).to.eq(formatDate(attributes.dateRequestReceived));
    });
  });
});
