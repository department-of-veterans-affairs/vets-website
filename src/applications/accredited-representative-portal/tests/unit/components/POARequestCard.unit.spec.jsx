import { expect } from 'chai';
import React from 'react';
import POARequestCard from '../../../components/POARequestCard/POARequestCard';
import mockPOARequestsResponse from '../../../mocks/mockPOARequestsResponse.json';
import { renderTestComponent } from '../helpers';

describe('POARequestCard', () => {
  it('renders a card', () => {
    const { attributes: poaRequest, id } = mockPOARequestsResponse.data[0];
    const component = <POARequestCard poaRequest={poaRequest} id={id} />;

    const { getByTestId } = renderTestComponent(component);

    expect(getByTestId('poa-request-card-12345-status')).to.exist;
  });
});
