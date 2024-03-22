import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import POARequestsTable from '../../components/POARequestsTable';
import { mockPOARequests } from '../../mocks/mockPOARequests';

describe('POA Requests Table', () => {
  it('renders headers', () => {
    const { getByTestId } = render(
      <POARequestsTable poaRequests={mockPOARequests} />,
    );
    expect(getByTestId('poa-requests-table')).to.exist;
    expect(getByTestId('poa-requests-table-claimant-header').textContent).to.eq(
      'Claimant',
    );
    expect(
      getByTestId('poa-requests-table-submitted-header').textContent,
    ).to.eq('Submitted');
    expect(
      getByTestId('poa-requests-table-description-header').textContent,
    ).to.eq('Description');
    expect(getByTestId('poa-requests-table-status-header').textContent).to.eq(
      'Status',
    );
    expect(getByTestId('poa-requests-table-actions-header').textContent).to.eq(
      'Actions',
    );
  });

  it('renders requests', () => {
    const { getByTestId } = render(
      <POARequestsTable poaRequests={mockPOARequests} />,
    );
    mockPOARequests.forEach(({ id, name, date, description, status }) => {
      expect(
        getByTestId(`poa-requests-table-${id}-claimant`).textContent,
      ).to.eq(name);
      expect(
        getByTestId(`poa-requests-table-${id}-submitted`).textContent,
      ).to.eq(date);
      expect(
        getByTestId(`poa-requests-table-${id}-description`).textContent,
      ).to.eq(description);
      expect(getByTestId(`poa-requests-table-${id}-status`).textContent).to.eq(
        status,
      );
      if (status === 'Pending') {
        expect(
          getByTestId(`poa-requests-table-${id}-accept-button`),
        ).to.have.attribute('text', 'Accept');
        expect(
          getByTestId(`poa-requests-table-${id}-decline-button`),
        ).to.have.attribute('text', 'Decline');
      }
    });
  });
});
