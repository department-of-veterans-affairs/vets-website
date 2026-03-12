import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup, render } from '@testing-library/react';

const mockStore = state => createStore(() => state);
const loadSelectorWithStubs = ({ enabled = false, isLoading = false } = {}) => {
  const legacyPath = require.resolve('../../../../containers/ConfirmationPage');
  const newPath = require.resolve('../../../../containers/ConfirmationPage2');
  const toggleHookPath = require.resolve(
    '~/platform/utilities/feature-toggles/useFeatureToggle',
  );
  const selectorPath = require.resolve(
    '../../../../containers/selectors/ConfirmationPageSelector',
  );

  delete require.cache[legacyPath];
  delete require.cache[newPath];
  delete require.cache[toggleHookPath];
  delete require.cache[selectorPath];

  require.cache[legacyPath] = {
    id: legacyPath,
    filename: legacyPath,
    loaded: true,
    exports: {
      __esModule: true,
      default: () => <div data-testid="legacy-confirmation" />,
    },
  };

  require.cache[newPath] = {
    id: newPath,
    filename: newPath,
    loaded: true,
    exports: {
      __esModule: true,
      default: () => <div data-testid="new-confirmation" />,
    },
  };

  require.cache[toggleHookPath] = {
    id: toggleHookPath,
    filename: toggleHookPath,
    loaded: true,
    exports: {
      __esModule: true,
      useFeatureToggle: () => ({
        TOGGLE_NAMES: {
          coeFormRebuildCveTeam: 'coeFormRebuildCveTeam',
        },
        useToggleValue: () => enabled,
        useToggleLoadingValue: () => isLoading,
      }),
    },
  };

  return require('../../../../containers/selectors/ConfirmationPageSelector')
    .default;
};

describe('COE ConfirmationPageSelector', () => {
  afterEach(() => {
    cleanup();
  });

  describe('renders with stubbed branch components', () => {
    it('renders legacy confirmation when toggle is off', () => {
      const ConfirmationPageSelector = loadSelectorWithStubs({
        enabled: false,
      });
      const store = mockStore({
        form: {
          data: {},
        },
      });
      const { queryByTestId } = render(
        <Provider store={store}>
          <ConfirmationPageSelector
            route={{
              formConfig: {},
            }}
          />
        </Provider>,
      );

      expect(queryByTestId('legacy-confirmation')).to.exist;
      expect(queryByTestId('new-confirmation')).to.not.exist;
    });

    it('renders new confirmation when toggle is on', () => {
      const ConfirmationPageSelector = loadSelectorWithStubs({
        enabled: true,
      });
      const store = mockStore({
        form: {
          data: {},
        },
      });
      const { queryByTestId } = render(
        <Provider store={store}>
          <ConfirmationPageSelector
            route={{
              formConfig: {},
            }}
          />
        </Provider>,
      );

      expect(queryByTestId('new-confirmation')).to.exist;
      expect(queryByTestId('legacy-confirmation')).to.not.exist;
    });

    it('renders loading indicator while toggle value is loading', () => {
      const ConfirmationPageSelector = loadSelectorWithStubs({
        isLoading: true,
      });
      const store = mockStore({
        form: {
          data: {},
        },
      });
      const { container, queryByTestId } = render(
        <Provider store={store}>
          <ConfirmationPageSelector
            route={{
              formConfig: {},
            }}
          />
        </Provider>,
      );

      expect(container.querySelector('va-loading-indicator')).to.exist;
      expect(queryByTestId('legacy-confirmation')).to.not.exist;
      expect(queryByTestId('new-confirmation')).to.not.exist;
    });
  });
});
