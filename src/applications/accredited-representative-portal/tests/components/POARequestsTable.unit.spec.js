import { render } from '@testing-library/react';
import { expect } from 'chai';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import POARequestsTable, {
  createRelationshipCell,
  formatDate,
} from '../../components/POARequestsTable/POARequestsTable';
import mockPOARequestsResponse from '../../mocks/mockPOARequestsResponse.json';

const MOCK_POA_REQUESTS = mockPOARequestsResponse.data;

describe('POARequestsTable', () => {
  const getPOARequestsTable = () =>
    render(
      <MemoryRouter>
        <POARequestsTable poaRequests={MOCK_POA_REQUESTS} />
      </MemoryRouter>,
    );

  it('renders table', () => {
    const { getByTestId } = getPOARequestsTable();
    expect(getByTestId('poa-requests-table')).to.exist;
  });

  it('renders headers', () => {
    const { getByTestId } = getPOARequestsTable();
    expect(getByTestId('poa-requests-table-headers-status').textContent).to.eq(
      'Status',
    );
    expect(getByTestId('poa-requests-table-headers-name').textContent).to.eq(
      'Veteran/Claimant',
    );
    expect(
      getByTestId('poa-requests-table-headers-limitations').textContent,
    ).to.eq('Limitations of consent');
    expect(getByTestId('poa-requests-table-headers-city').textContent).to.eq(
      'City',
    );
    expect(getByTestId('poa-requests-table-headers-state').textContent).to.eq(
      'State',
    );
    expect(getByTestId('poa-requests-table-headers-zip').textContent).to.eq(
      'Zip',
    );
    expect(
      getByTestId('poa-requests-table-headers-received').textContent,
    ).to.eq('Date received');
  });

  it('renders POA requests', () => {
    const { getByTestId } = getPOARequestsTable();
    MOCK_POA_REQUESTS.forEach(({ id, attributes }) => {
      expect(getByTestId(`poa-requests-table-${id}-status`).textContent).to.eq(
        upperFirst(attributes.status),
      );
      expect(getByTestId(`poa-requests-table-${id}-name`).textContent).to.eq(
        `${attributes.claimant.lastName}, ${attributes.claimant.firstName}`,
      );
      expect(
        getByTestId(`poa-requests-table-${id}-relationship`).textContent,
      ).to.eq(createRelationshipCell(attributes));
      expect(getByTestId(`poa-requests-table-${id}-city`).textContent).to.eq(
        attributes.claimantAddress.city,
      );
      expect(getByTestId(`poa-requests-table-${id}-state`).textContent).to.eq(
        attributes.claimantAddress.state,
      );
      expect(getByTestId(`poa-requests-table-${id}-zip`).textContent).to.eq(
        attributes.claimantAddress.zip,
      );
      expect(
        getByTestId(`poa-requests-table-${id}-received`).textContent,
      ).to.eq(formatDate(attributes.submittedAt));
    });
  });
});
