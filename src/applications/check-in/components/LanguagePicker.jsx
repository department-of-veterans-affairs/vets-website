import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { createAnalyticsSlug } from '../utils/analytics';

function LanguagePicker() {
  const { i18n } = useTranslation();
  const { language } = i18n;

  function getUrl(lang) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    return `${url.pathname}${url.search}`;
  }

  function changeLanguage(e) {
    e.preventDefault();
    window.history.replaceState(null, null, getUrl(e.target.lang));
    recordEvent({
      event: createAnalyticsSlug(`language-switch-${e.target.lang}`, 'nav'),
    });
    i18n.changeLanguage(e.target.getAttribute('lang'));
  }

  return (
    <div
      className="vads-u-display--inline-block vads-u-margin-bottom--3 vads-u-border--0 vads-u-border-bottom--1px vads-u-border-style--solid vads-u-border-color--gray"
      data-testid="language-picker"
    >
      {[
        {
          label: 'English',
          lang: 'en',
        },
        {
          label: 'Español',
          lang: 'es',
        },
        {
          label: 'Tagalog',
          lang: 'tl',
        },
      ].map((link, i, links) => (
        <Fragment key={i}>
          {/* Using starts with to capture all of the sub-lang strings for each language */}
          {language.startsWith(link.lang) ? (
            <span
              className="vads-u-font-weight--bold"
              data-testid={`translate-button-${link.lang}`}
            >
              {link.label}
            </span>
          ) : (
            <a
              onClick={changeLanguage}
              data-testid={`translate-button-${link.lang}`}
              href={getUrl(link.lang)}
              lang={link.lang}
            >
              {link.label}
            </a>
          )}

          {i + 1 !== links.length && (
            <span className="vads-u-margin-left--0p5 vads-u-margin-right--0p5 vads-u-color--gray vads-u-height--20">
              |
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default LanguagePicker;
