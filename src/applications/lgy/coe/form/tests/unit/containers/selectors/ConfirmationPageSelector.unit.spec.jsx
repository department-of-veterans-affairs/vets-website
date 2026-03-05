import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup, render } from '@testing-library/react';
import { shouldUseNewConfirmation } from '../../../../containers/selectors/ConfirmationPageSelector';
import { TOGGLE_KEY } from '../../../../constants';

const mockStore = state => createStore(() => state);

describe('COE ConfirmationPageSelector', () => {
  afterEach(() => {
    cleanup();
  });

  describe('shouldUseNewConfirmation', () => {
    it('returns false when formData is empty', () => {
      expect(shouldUseNewConfirmation({})).to.equal(false);
    });

    it('returns false when the toggle is falsy', () => {
      expect(
        shouldUseNewConfirmation({
          [`view:${TOGGLE_KEY}`]: false,
        }),
      ).to.equal(false);
    });

    it('returns true when the toggle is truthy', () => {
      expect(
        shouldUseNewConfirmation({
          [`view:${TOGGLE_KEY}`]: true,
        }),
      ).to.equal(true);
    });

    it('handles null/undefined safely', () => {
      expect(shouldUseNewConfirmation(null)).to.equal(false);
      expect(shouldUseNewConfirmation(undefined)).to.equal(false);
    });
  });

  describe('renders with stubbed branch components', () => {
    const loadSelectorWithStubs = () => {
      const legacyPath = require.resolve(
        '../../../../containers/ConfirmationPage',
      );
      const newPath = require.resolve(
        '../../../../containers/ConfirmationPage2',
      );
      const selectorPath = require.resolve(
        '../../../../containers/selectors/ConfirmationPageSelector',
      );

      delete require.cache[legacyPath];
      delete require.cache[newPath];
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
      return require('../../../../containers/selectors/ConfirmationPageSelector')
        .default;
    };

    it('renders legacy confirmation when toggle is off', () => {
      const ConfirmationPageSelector = loadSelectorWithStubs();
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
      const ConfirmationPageSelector = loadSelectorWithStubs();
      const store = mockStore({
        form: {
          data: {
            [`view:${TOGGLE_KEY}`]: true,
          },
        },
      });
      const { queryByTestId } = render(
        <Provider store={store}>
          <ConfirmationPageSelector
            route={{
              formConfig: {},
            }}
          />{' '}
        </Provider>,
      );

      expect(queryByTestId('new-confirmation')).to.exist;
      expect(queryByTestId('legacy-confirmation')).to.not.exist;
    });
  });
});
