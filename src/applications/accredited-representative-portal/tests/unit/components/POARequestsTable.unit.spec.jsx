import { expect } from 'chai';
import upperFirst from 'lodash/upperFirst';
import React from 'react';

import POARequestsTable, {
  createRelationshipCell,
  formatDate,
} from '../../../components/POARequestsTable/POARequestsTable';
import mockPOARequestsResponse from '../../../mocks/mockPOARequestsResponse.json';
import { renderTestApp } from '../helpers';

const MOCK_POA_REQUESTS = mockPOARequestsResponse.data;

describe('POARequestsTable', () => {
  it('renders table', () => {
    const { getByTestId } = renderTestApp(
      <POARequestsTable poaRequests={MOCK_POA_REQUESTS} />,
    );

    expect(getByTestId('poa-requests-table')).to.exist;
  });

  it('renders headers', () => {
    const { getByTestId } = renderTestApp(
      <POARequestsTable poaRequests={MOCK_POA_REQUESTS} />,
    );

    expect(getByTestId('poa-request-card-field-status').textContent).to.eq(
      'POA Status',
    );
    expect(getByTestId('poa-requests-card-field-consent').textContent).to.eq(
      'Consent Limitations',
    );
    expect(getByTestId('poa-request-card-field-city').textContent).to.eq(
      'City',
    );
    expect(getByTestId('poa-request-card-field-state').textContent).to.eq(
      'State',
    );
    expect(getByTestId('poa-request-card-field-zip').textContent).to.eq('Zip');
    expect(getByTestId('poa-request-card-field-received').textContent).to.eq(
      'POA Received Date',
    );
  });

  it('renders POA requests', () => {
    const { getByTestId } = renderTestApp(
      <POARequestsTable poaRequests={MOCK_POA_REQUESTS} />,
    );

    MOCK_POA_REQUESTS.forEach(({ id, attributes }) => {
      expect(getByTestId(`poa-request-card-${id}-status`).textContent).to.eq(
        upperFirst(attributes.status),
      );
      expect(getByTestId(`poa-request-card-${id}-name`).textContent).to.eq(
        `${attributes.claimant.lastName}, ${attributes.claimant.firstName}`,
      );
      expect(
        getByTestId(`poa-request-card-${id}-relationship`).textContent,
      ).to.eq(createRelationshipCell(attributes));
      expect(getByTestId(`poa-request-card-${id}-city`).textContent).to.eq(
        attributes.claimantAddress.city,
      );
      expect(getByTestId(`poa-request-card-${id}-state`).textContent).to.eq(
        attributes.claimantAddress.state,
      );
      expect(getByTestId(`poa-request-card-${id}-zip`).textContent).to.eq(
        attributes.claimantAddress.zip,
      );
      expect(getByTestId(`poa-request-card-${id}-received`).textContent).to.eq(
        formatDate(attributes.submittedAt),
      );
    });
  });
});
