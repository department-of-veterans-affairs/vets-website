/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';

import LanguagePicker from '../LanguagePicker';

describe('check-in', () => {
  let i18n;
  beforeEach(() => {
    i18n = setupI18n();
  });

  afterEach(() => {
    teardownI18n();
  });
  describe('LanguagePicker', () => {
    it('Renders', () => {
      const screen = render(
        <CheckInProvider>
          <LanguagePicker />
        </CheckInProvider>,
      );

      expect(screen.getByTestId('language-picker')).to.exist;
    });
    it('current language is not a link', () => {
      const screen = render(
        <CheckInProvider>
          <LanguagePicker />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('translate-button-en')).to.not.have.tagName(
        'li',
      );
    });
    it('changes language to es', () => {
      const screen = render(
        <CheckInProvider>
          <LanguagePicker />
        </CheckInProvider>,
      );
      fireEvent.click(screen.getByTestId('translate-button-es'));
      expect(i18n.language).to.equal('es');
    });
    it('changes language to tl', () => {
      const screen = render(
        <CheckInProvider>
          <LanguagePicker />
        </CheckInProvider>,
      );
      fireEvent.click(screen.getByTestId('translate-button-tl'));
      expect(i18n.language).to.equal('tl');
    });
  });
});
