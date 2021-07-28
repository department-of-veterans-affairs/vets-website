import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import I18Select from '../I18Select';
import { I18_CONTENT } from '../createI18Select';

const baseUrls = {
  en: '/health-care/covid-19-vaccine/',
  es: '/health-care/covid-19-vaccine-esp/',
  tl: '/health-care/covid-19-vaccine-tag/',
};

describe('<I18Select>', () => {
  describe('Language links and related logic', () => {
    it('should render with ENGLISH link bolded/active', async () => {
      const screen = renderInReduxProvider(
        <I18Select baseUrls={baseUrls} content={I18_CONTENT} />,
        { initialState: { i18State: { lang: 'en' } } },
      );

      const activeLink = await screen.findByText('English');

      expect(activeLink).to.exist;

      expect(activeLink).to.have.class('vads-u-font-weight--bold');
    });

    it('should render with SPANISH link bolded/active', async () => {
      const languageCode = 'es';

      const screen = renderInReduxProvider(
        <I18Select baseUrls={baseUrls} content={I18_CONTENT} />,
        { initialState: { i18State: { lang: languageCode } } },
      );

      const activeLink = await screen.findByText('Español');

      expect(activeLink).to.exist;

      expect(activeLink).to.have.class('vads-u-font-weight--bold');
    });
  });

  it('should render with TAGOLOG link bolded/active', async () => {
    const languageCode = 'tl';

    const screen = renderInReduxProvider(
      <I18Select baseUrls={baseUrls} content={I18_CONTENT} />,
      { initialState: { i18State: { lang: languageCode } } },
    );

    const activeLink = await screen.findByText('Tagalog');

    expect(activeLink).to.exist;

    expect(activeLink).to.have.class('vads-u-font-weight--bold');
  });
});
