import React from 'react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { Provider } from 'react-redux';

import { createStore } from 'redux';
import { Standard5103NoticePage } from '../../containers/Standard5103NoticePage';
import { renderWithRouter } from '../utils';

const props = {
  claim: {},
  loading: false,
};

const claim = {
  id: 1,
  attributes: {
    description: 'Test',
    displayName: 'Test description',
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    closeDate: null,
    claimPhaseDates: {
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
    },
    trackedItem: [],
  },
};

const getStore = () =>
  createStore(() => ({
    disability: {
      status: {
        claimAsk: {
          decisionRequested: false,
          decisionRequestError: false,
          loadingDecisionRequest: false,
        },
      },
    },
  }));

describe('<Standard5103NoticePage>', () => {
  it('when component mounts should set document title', () => {
    const { container } = renderWithRouter(
      <Standard5103NoticePage {...props} />,
    );
    expect($('#default-5103-notice-page', container)).to.not.exist;
    expect(document.title).to.equal('5103 Evidence Notice | Veterans Affairs');
  });

  it('should render loading div', () => {
    const { container } = renderWithRouter(
      <Standard5103NoticePage {...props} loading />,
    );
    expect($('#default-5103-notice-page', container)).to.not.exist;
    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should render standard 5103 notice page', () => {
    const { container } = renderWithRouter(
      <Provider store={getStore()}>
        <Standard5103NoticePage {...props} claim={claim} />
      </Provider>,
    );
    expect($('#default-5103-notice-page', container)).to.exist;
    expect($('va-loading-indicator', container)).to.not.exist;
  });
});
