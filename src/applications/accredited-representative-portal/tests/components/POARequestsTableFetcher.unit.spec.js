import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import POARequestsTableFetcher from '../../components/POARequestsTableFetcher/POARequestsTableFetcher';
import mockPOARequestsResponse from '../../mocks/mockPOARequestsResponse.json';

const MOCK_POA_REQUESTS = mockPOARequestsResponse.data;

describe('POARequestsTableFetcher', () => {
  it('renders loading indicator when its loading', () => {
    const usePOARequestsMock = () => ({
      isLoading: true,
      error: null,
      poaRequests: null,
    });
    const { getByTestId } = render(
      <POARequestsTableFetcher usePOARequests={usePOARequestsMock} />,
    );
    expect(getByTestId('poa-requests-table-fetcher-loading')).to.exist;
  });

  it('renders error when its not loading and there is an error,', () => {
    const usePOARequestsMock = () => ({
      isLoading: false,
      error: 'error',
      poaRequests: null,
    });
    const { getByTestId } = render(
      <POARequestsTableFetcher usePOARequests={usePOARequestsMock} />,
    );
    expect(getByTestId('error-message')).to.exist;
  });

  it('renders empty message when its not loading, there is no error, and there are no POA Requests', () => {
    const usePOARequestsMock = () => ({
      isLoading: false,
      error: null,
      poaRequests: null,
    });
    const { getByTestId } = render(
      <POARequestsTableFetcher usePOARequests={usePOARequestsMock} />,
    );
    expect(
      getByTestId('poa-requests-table-fetcher-no-poa-requests').textContent,
    ).to.eq('No POA requests found');
  });

  it('renders with the POA Requests Table when its not loading, there is no error, and there are POA Requests', () => {
    const usePOARequestsMock = () => ({
      isLoading: false,
      error: null,
      poaRequests: MOCK_POA_REQUESTS,
    });
    const { getByTestId } = render(
      <MemoryRouter>
        <POARequestsTableFetcher usePOARequests={usePOARequestsMock} />
      </MemoryRouter>,
    );
    expect(getByTestId('poa-requests-table')).to.exist;
  });
});
