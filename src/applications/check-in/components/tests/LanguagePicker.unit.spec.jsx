/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import i18n from '../../utils/i18n/i18n';

import LanguagePicker from '../LanguagePicker';

describe('check-in', () => {
  describe('LanguagePicker', () => {
    afterEach(() => {
      i18next.changeLanguage('en');
    });
    it('Renders', () => {
      const screen = render(
        <I18nextProvider i18n={i18n}>
          <LanguagePicker />
        </I18nextProvider>,
      );

      expect(screen.getByTestId('language-picker')).to.exist;
    });
    it('current language is not a link', () => {
      const screen = render(
        <I18nextProvider i18n={i18n}>
          <LanguagePicker />
        </I18nextProvider>,
      );
      expect(screen.getByTestId('translate-button-en')).to.not.have.tagName(
        'li',
      );
    });
    it('changes language to es', () => {
      const screen = render(
        <I18nextProvider i18n={i18n}>
          <LanguagePicker />
        </I18nextProvider>,
      );
      fireEvent.click(screen.getByTestId('translate-button-es'));
      expect(i18n.language).to.equal('es');
    });
    it('changes language to tl', () => {
      const screen = render(
        <I18nextProvider i18n={i18n}>
          <LanguagePicker />
        </I18nextProvider>,
      );
      fireEvent.click(screen.getByTestId('translate-button-tl'));
      expect(i18n.language).to.equal('tl');
    });
  });
});
