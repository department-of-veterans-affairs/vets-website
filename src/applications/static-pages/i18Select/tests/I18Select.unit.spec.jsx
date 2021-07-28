import React from 'react';
import { expect } from 'chai';
import { onThisPageDict } from '../hooks';
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

    it('should render with SPANISH link bolded/active and set appropriate "on-this-page" innerText', async () => {
      const languageCode = 'es';

      const screen = renderInReduxProvider(
        <div>
          <p data-testid="onThisPage" id="on-this-page" />
          <I18Select baseUrls={baseUrls} content={I18_CONTENT} />
        </div>,
        { initialState: { i18State: { lang: languageCode } } },
      );

      const onThisPageEl = screen.getByTestId('onThisPage');

      expect(onThisPageEl).to.exist;

      expect(onThisPageEl.innerText).to.equal(
        onThisPageDict[languageCode].onThisPage,
      );

      const activeLink = await screen.findByText('Español');

      expect(activeLink).to.exist;

      expect(activeLink).to.have.class('vads-u-font-weight--bold');
    });
  });

  it('should render with TAGOLOG link bolded/active and set appropriate "on-this-page" innerText', async () => {
    const languageCode = 'tl';

    const screen = renderInReduxProvider(
      <div>
        <p data-testid="onThisPage" id="on-this-page" />
        <I18Select baseUrls={baseUrls} content={I18_CONTENT} />
      </div>,
      { initialState: { i18State: { lang: languageCode } } },
    );

    const onThisPageEl = screen.getByTestId('onThisPage');

    expect(onThisPageEl).to.exist;

    expect(onThisPageEl.innerText).to.equal(
      onThisPageDict[languageCode].onThisPage,
    );

    const activeLink = await screen.findByText('Tagalog');

    expect(activeLink).to.exist;

    expect(activeLink).to.have.class('vads-u-font-weight--bold');
  });
});
