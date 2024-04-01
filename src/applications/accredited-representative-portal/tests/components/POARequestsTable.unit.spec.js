import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import POARequestsTable from '../../components/POARequestsTable/POARequestsTable';
import { mockPOARequests } from '../../mocks/mockPOARequests';

describe('POARequestsTable content', () => {
  const getPOARequestsTable = () =>
    render(<POARequestsTable poaRequests={mockPOARequests} />);

  it('renders table', () => {
    const { getByTestId } = getPOARequestsTable();
    expect(getByTestId('poa-requests-table')).to.exist;
  });

  it('renders headers', () => {
    const { getByTestId } = getPOARequestsTable();
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
    const { getByTestId } = getPOARequestsTable();
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

describe('POARequestsTable accept and decline functionality', () => {
  const getPOARequestsTable = (acceptPOARequest, declinePOARequest) =>
    render(
      <POARequestsTable
        poaRequests={mockPOARequests}
        acceptPOARequest={acceptPOARequest}
        declinePOARequest={declinePOARequest}
      />,
    );

  it('calls acceptPOARequest with correct id when accept button is clicked', () => {
    const acceptPOARequest = sinon.spy();
    const declinePOARequest = sinon.spy();
    const { getByTestId } = getPOARequestsTable(
      acceptPOARequest,
      declinePOARequest,
    );

    const pendingRequest = mockPOARequests.find(
      request => request.status === 'Pending',
    );

    if (pendingRequest) {
      fireEvent.click(
        getByTestId(`poa-requests-table-${pendingRequest.id}-accept-button`),
      );
      expect(acceptPOARequest.callCount).to.eq(1);
      expect(acceptPOARequest.lastCall.args[0]).to.eq(pendingRequest.id);
    }
  });

  it('calls declinePOARequest with correct id when decline button is clicked', () => {
    const acceptPOARequest = sinon.spy();
    const declinePOARequest = sinon.spy();
    const { getByTestId } = getPOARequestsTable(
      acceptPOARequest,
      declinePOARequest,
    );

    const pendingRequest = mockPOARequests.find(
      request => request.status === 'Pending',
    );

    if (pendingRequest) {
      fireEvent.click(
        getByTestId(`poa-requests-table-${pendingRequest.id}-decline-button`),
      );
      expect(declinePOARequest.callCount).to.eq(1);
      expect(declinePOARequest.lastCall.args[0]).to.eq(pendingRequest.id);
    }
  });
});
