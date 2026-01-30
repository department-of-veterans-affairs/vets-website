import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import * as FeatureToggleModule from 'platform/utilities/feature-toggles';
import AiDisclaimer from '../../../chatbot/features/shell/components/RightColumnContent/AiDisclaimer';

const getMockStore = ({
  virtualAgentShowAiDisclaimer = null,
  loading = false,
} = {}) => {
  return {
    getState: () => ({
      featureToggles: {
        loading,
        [FeatureToggleModule.TOGGLE_NAMES
          .virtualAgentShowAiDisclaimer]: virtualAgentShowAiDisclaimer,
      },
    }),
    subscribe: () => {},
    dispatch: () => ({}),
  };
};

describe('AiDisclaimer', () => {
  it('should show AI disclaimer when toggle is enabled and not loading', () => {
    const mockStore = getMockStore({
      virtualAgentShowAiDisclaimer: true,
      loading: false,
    });

    const { getByTestId } = render(
      <Provider store={mockStore}>
        <AiDisclaimer />
      </Provider>,
    );

    expect(getByTestId('ai-disclaimer')).to.exist;
  });

  it('should not show AI disclaimer when toggle is disabled', () => {
    const mockStore = getMockStore({
      virtualAgentShowAiDisclaimer: false,
      loading: false,
    });

    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <AiDisclaimer />
      </Provider>,
    );

    expect(queryByTestId('ai-disclaimer')).to.not.exist;
  });

  it('should not show AI disclaimer when toggle is loading', () => {
    const mockStore = getMockStore({
      virtualAgentShowAiDisclaimer: true,
      loading: true,
    });

    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <AiDisclaimer />
      </Provider>,
    );

    expect(queryByTestId('ai-disclaimer')).to.not.exist;
  });

  it('should not show AI disclaimer when toggle is null', () => {
    const mockStore = getMockStore({
      virtualAgentShowAiDisclaimer: null,
      loading: false,
    });

    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <AiDisclaimer />
      </Provider>,
    );

    expect(queryByTestId('ai-disclaimer')).to.not.exist;
  });
});
