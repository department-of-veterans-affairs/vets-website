import { expect } from 'chai';
import upperFirst from 'lodash/upperFirst';
import React from 'react';

import POARequestsCard, {
  createRelationshipCell,
  formatDate,
} from '../../../components/POARequestsCard/POARequestsCard';
import mockPOARequestsResponse from '../../../mocks/mockPOARequestsResponse.json';
import { renderTestApp } from '../helpers';

const MOCK_POA_REQUESTS = mockPOARequestsResponse.data;

describe('POARequestsTable', () => {
  it('renders card', () => {
    const { getByTestId } = renderTestApp(
      <POARequestsCard poaRequests={MOCK_POA_REQUESTS} />,
    );
    expect(getByTestId('poa-requests-card')).to.exist;
  });

  it('renders POA requests', () => {
    const { getByTestId } = renderTestApp(
      <POARequestsCard poaRequests={MOCK_POA_REQUESTS} />,
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
