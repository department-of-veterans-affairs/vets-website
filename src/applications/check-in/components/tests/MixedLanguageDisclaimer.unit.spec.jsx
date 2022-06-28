/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import i18n from '../../utils/i18n/i18n';

import MixedLanguageDisclaimer from '../MixedLanguageDisclaimer';

describe('Mixed Language Disclaimer', () => {
  let store;
  const middleware = [];
  const mockStore = configureStore(middleware);
  const initState = {
    checkInData: {
      context: {
        token: '',
      },
    },
    featureToggles: {
      check_in_experience_translation_pre_check_in_enabled: true,
      check_in_experience_translation_day_of_enabled: true,
      check_in_experience_translation_disclaimer_spanish_enabled: true,
    },
  };
  beforeEach(() => {
    store = mockStore(initState);
  });
  afterEach(() => {
    i18next.changeLanguage('en');
  });
  it('does not render when the language is set to english', () => {
    i18next.changeLanguage('en');
    const screen = render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MixedLanguageDisclaimer />
        </I18nextProvider>
      </Provider>,
    );
    expect(screen.queryByTestId('mixed-language-disclaimer')).to.be.null;
  });
  it('renders when the language is not set to english', () => {
    i18next.changeLanguage('es');
    const screen = render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MixedLanguageDisclaimer />
        </I18nextProvider>
      </Provider>,
    );
    expect(screen.queryByTestId('mixed-language-disclaimer')).to.exist;
  });
  it('passes axeCheck', () => {
    axeCheck(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MixedLanguageDisclaimer />
        </I18nextProvider>
      </Provider>,
    );
  });
});
