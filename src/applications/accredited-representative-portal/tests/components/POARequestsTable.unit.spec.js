import { render } from '@testing-library/react';
import { expect } from 'chai';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import POARequestsTable, {
  createRelationshipCell,
  formatDate,
} from '../../components/POARequestsTable/POARequestsTable';
import { mockPOARequests } from '../../mocks/mockPOARequests';

describe('POARequestsTable', () => {
  const getPOARequestsTable = () =>
    render(
      <MemoryRouter>
        <POARequestsTable poaRequests={mockPOARequests} />
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
    ).to.eq('POA received date');
  });

  it('renders POA requests', () => {
    const { getByTestId } = getPOARequestsTable();
    mockPOARequests.forEach(({ procId, attributes }) => {
      expect(
        getByTestId(`poa-requests-table-${procId}-status`).textContent,
      ).to.eq(upperFirst(attributes.secondaryStatus));
      expect(
        getByTestId(`poa-requests-table-${procId}-name`).textContent,
      ).to.eq(
        `${attributes.claimant.lastName}, ${attributes.claimant.firstName}`,
      );
      expect(
        getByTestId(`poa-requests-table-${procId}-relationship`).textContent,
      ).to.eq(createRelationshipCell(attributes));
      expect(
        getByTestId(`poa-requests-table-${procId}-city`).textContent,
      ).to.eq(attributes.claimant.city);
      expect(
        getByTestId(`poa-requests-table-${procId}-state`).textContent,
      ).to.eq(attributes.claimant.state);
      expect(getByTestId(`poa-requests-table-${procId}-zip`).textContent).to.eq(
        attributes.claimant.zip,
      );
      expect(
        getByTestId(`poa-requests-table-${procId}-received`).textContent,
      ).to.eq(formatDate(attributes.dateRequestReceived));
    });
  });
});
