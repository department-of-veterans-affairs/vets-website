import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { onThisPageHook } from './hooks';
import { connect } from 'react-redux';
import { langSelectedAction } from './actions';

const I18Select = ({ baseUrls, content, languageCode }) => {
  useEffect(
    () => {
      onThisPageHook(languageCode);
    },
    [languageCode],
  );

  return (
    <div className="vads-u-display--inline-block vads-u-margin-top--4 vads-u-margin-bottom--3 vads-u-border--0 vads-u-border-bottom--1px vads-u-border-style--solid vads-u-border-color--gray">
      <span>
        {Object.entries(content).map(
          ([contentLanguageCode, languageConfig], i) => {
            if (!baseUrls[contentLanguageCode]) {
              return null;
            }
            return (
              <span key={i}>
                <a
                  className={`vads-u-font-size--base vads-u-font-family--sans vads-u-padding-bottom-0p5 ${
                    contentLanguageCode === languageCode
                      ? 'vads-u-font-weight--bold vads-u-color--base vads-u-text-decoration--none'
                      : ''
                  }`}
                  onClick={_ => {
                    recordEvent({
                      event: 'nav-pipe-delimited-list-click',
                      'pipe-delimited-list-header': languageConfig.lang,
                    });
                  }}
                  href={baseUrls[contentLanguageCode]}
                  hrefLang={languageConfig.lang}
                  lang={languageConfig.lang}
                >
                  {languageConfig.label}{' '}
                </a>
                {i !== Object.entries(content).length - 1 && (
                  <span
                    className=" vads-u-margin-left--0p5 vads-u-margin-right--0p5 vads-u-color--gray
                    vads-u-height--20"
                  >
                    |
                  </span>
                )}
              </span>
            );
          },
        )}
      </span>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  dispatchLanguageSelection: lang => {
    return dispatch(langSelectedAction(lang));
  },
});

const mapStateToProps = state => ({
  languageCode: state.i18State.lang,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(I18Select);
