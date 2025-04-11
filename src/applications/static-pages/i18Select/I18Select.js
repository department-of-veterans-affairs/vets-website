import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { connect } from 'react-redux';
import { setOnThisPageText } from './utilities/helpers';
import { ALL_LANGUAGES } from './utilities/constants';

const I18Select = ({ baseUrls, languageCode }) => {
  useEffect(() => {
    setOnThisPageText(languageCode);
  }, [languageCode]);

  return (
    <div className="vads-u-display--inline-block vads-u-margin-top--4 vads-u-margin-bottom--3 vads-u-border--0 vads-u-border-bottom--1px vads-u-border-style--solid vads-u-border-color--gray">
      <span>
        {ALL_LANGUAGES.map((languageConfig, i) => {
          if (!baseUrls[languageConfig.code]) {
            return null;
          }
          return (
            <span key={i}>
              <a
                className={`vads-u-font-size--base vads-u-font-family--sans vads-u-padding-bottom-0p5 ${
                  languageConfig.code === languageCode
                    ? 'vads-u-font-weight--bold vads-u-color--base vads-u-text-decoration--none'
                    : ''
                }`}
                onClick={_ => {
                  recordEvent({
                    event: 'nav-pipe-delimited-list-click',
                    'pipe-delimited-list-header': languageConfig.code,
                  });
                }}
                href={baseUrls[languageConfig.code]}
                hrefLang={languageConfig.code}
                lang={languageConfig.code}
              >
                {languageConfig.label}{' '}
              </a>
              {i !== Object.keys(baseUrls).length - 1 && (
                <span
                  className=" vads-u-margin-left--0p5 vads-u-margin-right--0p5 vads-u-color--gray
                    vads-u-height--20"
                >
                  |
                </span>
              )}
            </span>
          );
        })}
      </span>
    </div>
  );
};

const mapStateToProps = state => ({
  languageCode: state.i18State.lang,
});

export default connect(mapStateToProps)(I18Select);
