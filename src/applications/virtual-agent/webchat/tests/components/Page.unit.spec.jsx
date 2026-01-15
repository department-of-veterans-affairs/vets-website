import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import * as FeatureToggleModule from 'platform/utilities/feature-toggles/useFeatureToggle';

import Page from '../../../shared/components/Page';
import * as FloatingBotModule from '../../components/FloatingBot';
import * as StickyBotModule from '../../components/StickyBot';

const getMockStore = ({
  loading = false,
  virtualAgentShowChatbot = true,
  virtualAgentShowFloatingChatbot = true,
  virtualAgentUseV2Chatbot = false,
} = {}) => ({
  getState: () => ({
    featureToggles: {
      loading,
      [FeatureToggleModule.TOGGLE_NAMES
        .virtualAgentShowChatbot]: virtualAgentShowChatbot,
      [FeatureToggleModule.TOGGLE_NAMES
        .virtualAgentShowFloatingChatbot]: virtualAgentShowFloatingChatbot,
      [FeatureToggleModule.TOGGLE_NAMES
        .virtualAgentUseV2Chatbot]: virtualAgentUseV2Chatbot,
    },
  }),
  subscribe: () => {},
  dispatch: () => ({}),
});

describe('Page', () => {
  let sandbox;

  beforeEach(() => {
    // stubbing these out since the bot framework will cause errors during testing, and we are just testing the toggles for this component
    sandbox = sinon.sandbox.create();
    sandbox
      .stub(FloatingBotModule, 'default')
      .returns(<div data-testid="floating-bot" />);
    sandbox
      .stub(StickyBotModule, 'default')
      .returns(<div data-testid="sticky-bot" />);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders loading indicator when toggles are loading', () => {
    const mockStore = getMockStore({ loading: true });

    const { container } = render(
      <Provider store={mockStore}>
        <Page />
      </Provider>,
    );

    expect(container.querySelector('va-loading-indicator')).to.exist;
  });

  it('renders ChatbotUnavailable when showChatbot is false', () => {
    const mockStore = getMockStore({ virtualAgentShowChatbot: false });

    const { getByText } = render(
      <Provider store={mockStore}>
        <Page />
      </Provider>,
    );

    expect(
      getByText(/We closed our beta testing period for the VA.gov chatbot/i, {
        exact: false,
      }),
    ).to.exist;
  });

  it('renders the v2 chatbot when the v2 toggle is enabled', () => {
    const mockStore = getMockStore({ virtualAgentUseV2Chatbot: true });

    const { getByText } = render(
      <Provider store={mockStore}>
        <Page />
      </Provider>,
    );

    expect(getByText('V2 Chatbot Placeholder')).to.exist;
  });

  it('renders FloatingBot when the floating bot toggle is enabled', () => {
    const mockStore = getMockStore({
      virtualAgentShowChatbot: true,
      virtualAgentShowFloatingChatbot: true,
      virtualAgentUseV2Chatbot: false,
    });

    const { getByTestId } = render(
      <Provider store={mockStore}>
        <Page />
      </Provider>,
    );

    expect(getByTestId('floating-bot')).to.exist;
  });

  it('renders StickyBot when the floating bot toggle is disabled', () => {
    const mockStore = getMockStore({
      virtualAgentShowChatbot: true,
      virtualAgentShowFloatingChatbot: false,
      virtualAgentUseV2Chatbot: false,
    });

    const { getByTestId } = render(
      <Provider store={mockStore}>
        <Page />
      </Provider>,
    );

    expect(getByTestId('sticky-bot')).to.exist;
  });
});
