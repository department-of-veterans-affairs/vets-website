import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import withTranslationEnabled from '../containers/withTranslationEnabled';

function LanguagePicker(props) {
  const { withTopMargin } = props;
  const { i18n } = useTranslation();
  const { language } = i18n;
  function changeLanguage(e) {
    e.preventDefault();
    i18n.changeLanguage(e.target.getAttribute('lang'));
  }

  let classNames =
    'vads-u-display--inline-block vads-u-margin-bottom--3 vads-u-border--0 vads-u-border-bottom--1px vads-u-border-style--solid vads-u-border-color--gray';
  if (withTopMargin) classNames += ' vads-u-margin-top--2';

  return (
    <div className={classNames} data-testid="language-picker">
      {[
        {
          label: 'English',
          lang: 'en',
        },
        {
          label: 'Español',
          lang: 'es',
        },
        // {
        //   label: 'Tagalog',
        //   lang: 'tl',
        // },
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
              href={`#${link.lang}`}
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

LanguagePicker.propTypes = {
  withTopMargin: PropTypes.bool,
};

export default withTranslationEnabled(LanguagePicker);
