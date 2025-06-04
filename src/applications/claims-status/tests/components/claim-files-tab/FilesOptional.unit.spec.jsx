import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { createStore } from 'redux';
import FilesOptional from '../../../components/claim-files-tab/FilesOptional';
import { renderWithRouter } from '../../utils';

const item = {
  displayName: 'Request 1',
  description: 'This is a alert',
  requestedDate: '2025-04-21',
};

const itemWithOverrideDescription = {
  displayName: 'Request 2',
  description: 'This is a alert',
  requestedDate: '2025-04-21',
  shortDescription: 'Short description',
};

const DBQItem = {
  displayName: 'DBQ AUDIO Hearing Loss and Tinnitus',
  description: 'This is a description for a DBQ item',
  requestedDate: '2025-04-25',
  shortDescription: 'Short description',
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
    const { getByText, queryByText } = renderWithRouter(
      <Provider store={getStore(true)}>
        <FilesOptional item={item} />
      </Provider>,
    );

    getByText(item.displayName);
    getByText('Requested from outside VA on April 21, 2025');
    expect(queryByText(item.description)).to.be.null;
    getByText(/you don’t have to do anything/i);
    getByText(
      'We asked someone outside VA for documents related to your claim.',
    );
    getByText('About this notice');
    getByText('Requested from outside VA on April 21, 2025');
  });
  it(`should not render you don't need to do anything when cstFriendlyEvidenceRequests is true and track item has override description content`, () => {
    const { getByText, queryByText } = renderWithRouter(
      <Provider store={getStore(true)}>
        <FilesOptional item={itemWithOverrideDescription} />
      </Provider>,
    );

    getByText(itemWithOverrideDescription.displayName);
    getByText('Requested from outside VA on April 21, 2025');
    getByText(itemWithOverrideDescription.shortDescription);
    expect(queryByText(/you don’t have to do anything/i)).to.be.null;
    expect(
      queryByText(
        'We asked someone outside VA for documents related to your claim.',
      ),
    ).to.be.null;
    getByText('About this notice');

    getByText('Requested from outside VA on April 21, 2025');
  });
  it(`should render Requested from examiner's office when cstFriendlyEvidenceRequests is true and track item is a DBQ`, () => {
    const { getByText } = renderWithRouter(
      <Provider store={getStore(true)}>
        <FilesOptional item={DBQItem} />
      </Provider>,
    );

    getByText(`Requested from examiner's office on April 25, 2025`);
  });
});
