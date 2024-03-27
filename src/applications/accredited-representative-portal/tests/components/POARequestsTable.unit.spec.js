import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import POARequestsTable from '../../components/POARequestsTable/POARequestsTable';
import { mockPOARequests } from '../../mocks/mockPOARequests';

describe('POARequestsTable', () => {
  it('renders table', () => {
    const { getByTestId } = render(
      <POARequestsTable poaRequests={mockPOARequests} />,
    );
    expect(getByTestId('poa-requests-table')).to.exist;
  });

  it('renders headers', () => {
    const { getByTestId } = render(
      <POARequestsTable poaRequests={mockPOARequests} />,
    );
    expect(
      getByTestId('poa-requests-table-headers-claimant').textContent,
    ).to.eq('Claimant');
    expect(
      getByTestId('poa-requests-table-headers-submitted').textContent,
    ).to.eq('Submitted');
    expect(
      getByTestId('poa-requests-table-headers-description').textContent,
    ).to.eq('Description');
    expect(getByTestId('poa-requests-table-headers-status').textContent).to.eq(
      'Status',
    );
    expect(getByTestId('poa-requests-table-headers-actions').textContent).to.eq(
      'Actions',
    );
  });

  it('renders POA requests', () => {
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
