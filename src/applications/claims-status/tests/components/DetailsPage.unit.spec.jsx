import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { renderWithRouter } from '../utils';

import { DetailsPage } from '../../containers/DetailsPage';

const store = createStore(() => ({}));
const claim = {
  attributes: {
    contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
    claimDate: '2024-01-08',
  },
};

describe('<DetailsPage>', () => {
  it('should render contention list', () => {
    const { container } = renderWithRouter(
      <Provider store={store}>
        <DetailsPage claim={claim} />
      </Provider>,
    );

    const list = $$('.claim-detail-list-item', container);

    expect($('.claim-detail-list', container)).to.exist;
    expect(list.length).to.eq(2);
    expect(list[0].textContent).to.contain('Condition 1');
    expect(list[1].textContent).to.contain('Condition 2');
    expect(document.title).to.equal(
      'Details Of January 8, 2024 Disability Compensation Claim | Veterans Affairs',
    );
  });

  it('should render null when claim empty', () => {
    const { container, getByText } = renderWithRouter(
      <Provider store={store}>
        <DetailsPage claim={{}} />
      </Provider>,
    );
    expect($('.claim-detail-list', container)).to.not.exist;
    expect(document.title).to.equal('Details Of Your Claim | Veterans Affairs');
    getByText('Claim status is unavailable');
  });

  it('should render null when claim is null', () => {
    const { container, getByText } = renderWithRouter(
      <Provider store={store}>
        <DetailsPage claim={null} />
      </Provider>,
    );
    expect($('.claim-detail-list', container)).to.not.exist;
    expect(document.title).to.equal('Details Of Your Claim | Veterans Affairs');
    getByText('Claim status is unavailable');
  });

  it('should render not available when claim has no contentions', () => {
    const claimNoContentions = {
      attributes: {
        contentions: [],
        claimDate: '2024-01-08',
      },
    };
    const { container } = renderWithRouter(
      <Provider store={store}>
        <DetailsPage claim={claimNoContentions} />
      </Provider>,
    );
    expect($('.claim-detail-list', container)).to.not.exist;
    expect($('.claim-details', container).textContent).to.contain(
      'Not Available',
    );
    expect(document.title).to.equal(
      'Details Of January 8, 2024 Disability Compensation Claim | Veterans Affairs',
    );
  });

  it('should render loding state', () => {
    const { container } = renderWithRouter(
      <Provider store={store}>
        <DetailsPage claim={claim} loading />
      </Provider>,
    );
    expect($('.claim-detail-list', container)).to.not.exist;
    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should setfocus when lastPage exists', () => {
    const { container } = renderWithRouter(
      <Provider store={store}>
        <DetailsPage claim={claim} lastPage="../details" />
      </Provider>,
    );

    expect(document.activeElement).to.equal($('#tabPanelDetails', container));
  });

  it('masks the contention details from datadog (no PII)', () => {
    const { container } = renderWithRouter(
      <Provider store={store}>
        <DetailsPage claim={claim} lastPage="../details" />
      </Provider>,
    );
    const ddPrivacy = $('.claim-detail-list li', container).getAttribute(
      'data-dd-privacy',
    );
    expect(ddPrivacy).to.eq('mask');
  });
});
