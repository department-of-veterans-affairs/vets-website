import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { App } from '.';

const store = ({ burialFormV2 = false } = {}) => ({
  getState: () => ({
    user: {
      profile: {
        loading: false,
        savedForms: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    },
    featureToggles: {
      loading: false,
      // eslint-disable-next-line camelcase
      burial_form_v2: burialFormV2,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('Burials v2', () => {
  it('renders documents with feature flag disabled', () => {
    const mockStore = store({ burialFormV2: false });
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect(container.textContent).to.contain(
      `What documents do I need to send with my application?`,
    );
  });

  it('renders documents with feature flag enabled', () => {
    const mockStore = store({ burialFormV2: true });
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect(container.textContent).to.contain(
      `What documents do I need to submit with my application?`,
    );
  });

  it('renders time limit content with feature flag disabled', () => {
    const mockStore = store({ burialFormV2: false });
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect(container.textContent).to.contain(
      `You must file a claim for a non-service-connected burial allowance within 2 years after the Veteran’s burial. If a Veteran’s discharge was changed after death from dishonorable to another status, you must file for an allowance claim within 2 years after the discharge update.`,
    );
  });

  it('renders time limit content with feature flag enabled', () => {
    const mockStore = store({ burialFormV2: true });
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect(container.textContent).to.contain(
      `If you’re claiming a burial allowance for a non-service-connected death or unclaimed remains you must file a claim within 2 years after the Veteran’s burial.`,
    );
  });

  it('renders mail directions content with feature flag disabled', () => {
    const mockStore = store({ burialFormV2: false });
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect(container.textContent).to.contain(
      `Mail the application and copies of supporting documents to your nearest VA regional office.`,
    );
  });

  it('renders mail directions content with feature flag enabled', () => {
    const mockStore = store({ burialFormV2: true });
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect(container.textContent).to.contain(
      `Mail the application and copies of supporting documents to this address:`,
    );
  });
});
