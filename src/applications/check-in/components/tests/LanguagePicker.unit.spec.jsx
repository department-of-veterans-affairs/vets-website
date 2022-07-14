/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import i18n from '../../utils/i18n/i18n';

import LanguagePicker from '../LanguagePicker';

describe('check-in', () => {
  describe('LanguagePicker', () => {
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
      },
    };
    beforeEach(() => {
      store = mockStore(initState);
    });
    afterEach(() => {
      i18next.changeLanguage('en');
    });
    it('Renders', () => {
      const screen = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <LanguagePicker />
          </I18nextProvider>
        </Provider>,
      );

      expect(screen.getByTestId('language-picker')).to.exist;
    });
    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <LanguagePicker />
          </I18nextProvider>
        </Provider>,
      );
    });
    it('current language is not a link', () => {
      const screen = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <LanguagePicker />
          </I18nextProvider>
        </Provider>,
      );
      expect(screen.getByTestId('translate-button-en')).to.not.have.tagName(
        'li',
      );
    });
    it('changes language', () => {
      const screen = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <LanguagePicker />
          </I18nextProvider>
        </Provider>,
      );
      fireEvent.click(screen.getByTestId('translate-button-es'));
      expect(i18n.language).to.equal('es');
    });
  });
});
