import React from 'react';
import { expect } from 'chai';
import { renderTestApp } from '../helpers';
import mockPOARequestsResponse from '../../../mocks/mockPOARequestsResponse.json';
import POARequestDetails from '../../../containers/POARequestDetails';

const MOCK_POA_REQUESTS = mockPOARequestsResponse.data;
describe('render POA request details page', () => {
  it('renders heading', () => {
    const { getByTestId } = renderTestApp(
      <POARequestDetails poaRequests={MOCK_POA_REQUESTS} />,
    );
    expect(getByTestId('poa-request-details-header').textContent).to.eq(
      'POA request:',
    );
  });
});
