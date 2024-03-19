/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';

import MixedLanguageDisclaimer from '../MixedLanguageDisclaimer';

describe('Mixed Language Disclaimer', () => {
  let i18n;
  beforeEach(() => {
    i18n = setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  const initState = {
    features: {
      check_in_experience_translation_disclaimer_spanish_enabled: true,
      check_in_experience_translation_disclaimer_tagalog_enabled: true,
    },
  };
  afterEach(() => {
    i18n.changeLanguage('en');
  });
  it('does not render when the language is set to english', () => {
    i18n.changeLanguage('en');
    const screen = render(
      <CheckInProvider store={initState}>
        <MixedLanguageDisclaimer />
      </CheckInProvider>,
    );
    expect(screen.queryByTestId('mixed-language-disclaimer')).to.be.null;
  });
  it('renders when the language is set to spanish', () => {
    i18n.changeLanguage('es');
    const screen = render(
      <CheckInProvider store={initState}>
        <MixedLanguageDisclaimer />
      </CheckInProvider>,
    );
    expect(screen.queryByTestId('mixed-language-disclaimer')).to.exist;
  });
  it('renders when the language is set to tagalog', () => {
    i18n.changeLanguage('tl');
    const screen = render(
      <CheckInProvider store={initState}>
        <MixedLanguageDisclaimer />
      </CheckInProvider>,
    );
    expect(screen.queryByTestId('mixed-language-disclaimer')).to.exist;
  });
});
