import { expect } from 'chai';
import React from 'react';
import POARequestCard from '../../../components/POARequestCard';
import mockPOARequestsResponse from '../../../utilities/mocks/poaRequests.json';
import { renderTestComponent } from '../helpers';

describe('POARequestCard', () => {
  it('renders a card', () => {
    const { attributes: poaRequest, id } = mockPOARequestsResponse[0];
    const component = <POARequestCard poaRequest={poaRequest} id={id} />;

    const { getByTestId } = renderTestComponent(component);

    expect(getByTestId('poa-request-card-12345-status')).to.exist;
  });
});
