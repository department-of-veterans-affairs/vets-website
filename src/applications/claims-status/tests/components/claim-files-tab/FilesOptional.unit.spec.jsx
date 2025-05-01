import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import FilesOptional from '../../../components/claim-files-tab/FilesOptional';
import { renderWithRouter } from '../../utils';

const item = {
  displayName: 'Request 1',
  description: 'This is a alert',
  requestedDate: '2025-04-21',
};

const getStore = cstFriendlyEvidenceRequests =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_friendly_evidence_requests: cstFriendlyEvidenceRequests,
    },
  }));

describe('<FilesOptional>', () => {
  it('should render alert with item data', () => {
    const { getByText } = renderWithRouter(
      <Provider store={getStore(false)}>
        <FilesOptional item={item} />
      </Provider>,
    );

    getByText(item.displayName);
    getByText(item.description);
    getByText(
      'You don’t have to do anything, but if you have this information you can',
    );
    getByText('add it here.');
  });
  it('should render updated UI when cstFriendlyEvidenceRequests is true', () => {
    const { getByText } = renderWithRouter(
      <Provider store={getStore(true)}>
        <FilesOptional item={item} />
      </Provider>,
    );

    getByText(item.displayName);
    getByText(item.description);
    getByText('About this notice');
    getByText('Requested to others on April 21, 2025');
  });
});
