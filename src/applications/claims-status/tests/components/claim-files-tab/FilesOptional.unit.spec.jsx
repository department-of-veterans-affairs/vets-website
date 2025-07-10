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
  friendlyName: 'Friendly Request',
  description: 'This is a alert',
  requestedDate: '2025-04-21',
  shortDescription: 'Short description',
};

const DBQItemWithOverride = {
  displayName: 'DBQ AUDIO Hearing Loss and Tinnitus',
  friendlyName: 'Friendly DBQ',
  description: 'This is a description for a DBQ item',
  requestedDate: '2025-04-25',
  shortDescription: 'Short description',
};
const DBQItemNoOverride = {
  displayName: 'DBQ no override',
  description: 'This is a description for a DBQ no override item',
  requestedDate: '2025-05-25',
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
  it('should render non DBQ items updated UI when cstFriendlyEvidenceRequests is true', () => {
    const { getByText, queryByText } = renderWithRouter(
      <Provider store={getStore(true)}>
        <FilesOptional item={item} />
      </Provider>,
    );

    getByText('Request for evidence outside VA');
    getByText('We made a request outside VA on April 21, 2025');
    expect(queryByText(item.description)).to.be.null;
    getByText(/you don’t have to do anything/i);
    getByText(
      'We asked someone outside VA for documents related to your claim.',
    );
    getByText('About this notice');
  });

  it(`should render you don't need to do anything and short description when cstFriendlyEvidenceRequests is true and non DBQ track item has override description content`, () => {
    const { getByText, queryByText } = renderWithRouter(
      <Provider store={getStore(true)}>
        <FilesOptional item={itemWithOverrideDescription} />
      </Provider>,
    );

    getByText(itemWithOverrideDescription.friendlyName);
    getByText('We made a request outside VA on April 21, 2025');
    expect(queryByText(/you don’t have to do anything/i)).to.exist;
    getByText(itemWithOverrideDescription.shortDescription);
    expect(
      queryByText(
        'We asked someone outside VA for documents related to your claim.',
      ),
    ).to.be.null;
    getByText('About this notice');
  });
  it(`should render We made a request for an exam when cstFriendlyEvidenceRequests is true and track item is a DBQ wtih override`, () => {
    const { getByText } = renderWithRouter(
      <Provider store={getStore(true)}>
        <FilesOptional item={DBQItemWithOverride} />
      </Provider>,
    );

    getByText(`We made a request for an exam on April 25, 2025`);
    getByText('Short description');
  });
  it(`should render We made a request for an exam when cstFriendlyEvidenceRequests is true and track item is a DBQ with no override content`, () => {
    const { getByText } = renderWithRouter(
      <Provider store={getStore(true)}>
        <FilesOptional item={DBQItemNoOverride} />
      </Provider>,
    );

    getByText(`We made a request for an exam on May 25, 2025`);
    getByText(
      `We’ve requested an exam related to your claim. The examiner’s office will contact you to schedule this appointment.`,
    );
  });
});
