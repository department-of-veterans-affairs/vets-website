import React from 'react';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {
  MemoryRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom-v5-compat';
import DocumentRedirectPage from '../../containers/DocumentRedirectPage';

describe('DocumentRedirectPage routing', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });
  const getStore = () =>
    createStore(() => ({
      disability: {
        status: {
          claimDetail: {
            detail: {
              attributes: {
                trackedItems: [
                  {
                    id: 582630,
                    status: 'NEEDED_FROM_YOU',
                  },
                  {
                    id: 594563,
                    status: 'NEEDED_FROM_OTHERS',
                  },
                ],
              },
            },
          },
        },
      },
    }));
  it('redirects to the needed-from-you route when status is NEEDED_FROM_YOU', async () => {
    const { getByText, queryByText } = render(
      <Provider store={getStore()}>
        <MemoryRouter initialEntries={['/document-request/582630']}>
          <Routes>
            <Route
              path="/document-request/:trackedItemId"
              element={<DocumentRedirectPage />}
            />
            <Route
              path="/needed-from-you/:trackedItemId"
              element={<div>Needed from you page</div>}
            />
            <Route
              path="/needed-from-others/:trackedItemId"
              element={<div>Needed from others page</div>}
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
    expect(getByText('Needed from you page')).to.exist;
    expect(queryByText('Needed from others page')).not.to.exist;
  });
  it('redirects to the needed-from-others route when status is NEEDED_FROM_OTHERS', async () => {
    const { getByText, queryByText } = render(
      <Provider store={getStore()}>
        <MemoryRouter initialEntries={['/document-request/594563']}>
          <Routes>
            <Route
              path="/document-request/:trackedItemId"
              element={<DocumentRedirectPage />}
            />
            <Route
              path="/needed-from-you/:trackedItemId"
              element={<div>Needed from you page</div>}
            />
            <Route
              path="/needed-from-others/:trackedItemId"
              element={<div>Needed from others page</div>}
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
    expect(getByText('Needed from others page')).to.exist;
    expect(queryByText('Needed from you page')).not.to.exist;
  });
});

describe('Empty directory redirects', () => {
  const renderWithRoutes = initialEntry =>
    render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route
            path="/your-claims/:id/needed-from-you"
            element={<Navigate to="/your-claims/:id/status" replace />}
          />
          <Route
            path="/your-claims/:id/needed-from-you/:trackedItemId"
            element={<div>Document request page</div>}
          />
          <Route
            path="/your-claims/:id/needed-from-others"
            element={<Navigate to="/your-claims/:id/status" replace />}
          />
          <Route
            path="/your-claims/:id/needed-from-others/:trackedItemId"
            element={<div>Document request page</div>}
          />
          <Route
            path="/your-claims/:id/status"
            element={<div>Claim status</div>}
          />
        </Routes>
      </MemoryRouter>,
    );

  it('redirects /needed-from-you (no trackedItemId) to /your-claims/123/status', () => {
    const { getByText } = renderWithRoutes('/your-claims/123/needed-from-you');
    expect(getByText('Claim status')).to.exist;
  });

  it('redirects /needed-from-others (no trackedItemId) to /your-claims/123/status', () => {
    const { getByText } = renderWithRoutes(
      '/your-claims/123/needed-from-others',
    );
    expect(getByText('Claim status')).to.exist;
  });

  it('renders DocumentRequestPage when trackedItemId is provided', () => {
    const { getByText, queryByText } = renderWithRoutes(
      '/your-claims/123/needed-from-you/456',
    );
    expect(getByText('Document request page')).to.exist;
    expect(queryByText('Claim status')).not.to.exist;
  });
});
