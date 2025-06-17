import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { SaveInProgressIntro } from '../../containers/SaveInProgressIntro';

before(() => {
  if (!window.customElements) {
    window.customElements = { define: () => {}, get: () => {} };
  }
  ['va-alert', 'va-button', 'va-loading-indicator', 'va-modal'].forEach(tag => {
    if (!window.customElements.get(tag)) {
      window.customElements.define(tag, class extends HTMLElement {});
    }
  });
});

const defaultProps = {
  fetchInProgressForm: () => {},
  removeInProgressForm: () => {},
  toggleLoginModal: () => {},
  formId: 'test-form',
  pageList: [{ path: 'introduction' }, { path: 'start' }],
  formConfig: {
    customText: { appType: 'application', appAction: 'applying' },
  },
  prefillEnabled: true,
  headingLevel: 2,
  startText: 'Start application',
  unauthStartText: 'Sign in to start your application',
  messages: {},
  migrations: [],
  resumeOnly: false,
  buttonOnly: false,
  retentionPeriod: '60 days',
  retentionPeriodStart: 'when you start',
  user: {
    profile: {
      loading: false,
      prefillsAvailable: ['test-form'],
      savedForms: [],
    },
    login: {
      currentlyLoggedIn: false,
    },
  },
};

describe('SaveInProgressIntro', () => {
  it('renders without crashing', () => {
    render(<SaveInProgressIntro {...defaultProps} />);
  });

  it('renders "Start your application without signing in" link if user is not logged in', () => {
    const { getByText } = render(<SaveInProgressIntro {...defaultProps} />);
    expect(getByText(/start your application without signing in/i)).to.exist;
  });
});
