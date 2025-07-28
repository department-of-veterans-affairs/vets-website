import React from 'react';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DocumentRedirectPage from '../../containers/DocumentRedirectPage';
import * as DocumentRequestPage from '../../containers/DocumentRequestPage';

describe('DocumentRedirectPage routing', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });
  const getStore = (
    cst5103UpdateEnabled = true,
    cstFriendlyEvidenceRequests = true,
  ) =>
    createStore(() => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        cst_5103_update_enabled: cst5103UpdateEnabled,
        // eslint-disable-next-line camelcase
        cst_friendly_evidence_requests: cstFriendlyEvidenceRequests,
      },
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
  it('when cstFriendlyEvidenceRequests is true, redirects to the needed-from-you route when status is NEEDED_FROM_YOU', async () => {
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
  it('when cstFriendlyEvidenceRequests is true, redirects to the needed-from-others route when status is NEEDED_FROM_OTHERS', async () => {
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
  it('when cstFriendlyEvidenceRequests is false, redirects to the needed-from-you route when status is NEEDED_FROM_YOU', async () => {
    sandbox
      .stub(DocumentRequestPage, 'default')
      .callsFake(() => <div>No redirect</div>);

    const { getByText, queryByText } = render(
      <Provider store={getStore(true, false)}>
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

    expect(getByText('No redirect')).to.exist;
    expect(queryByText('Needed from you page')).not.to.exist;
    expect(queryByText('Needed from others page')).not.to.exist;
  });
});
