import React from 'react';
import PropTypes from 'prop-types';

const FormTitle = ({
  id,
  formUrl,
  title,
  lang,
  recordGAEvent,
  useSearchUIUXEnhancements,
}) => (
  <>
    {useSearchUIUXEnhancements ? (
      <dt
        className="vads-u-padding-top--3 vads-u-margin--0 vads-u-font-weight--bold"
        data-e2e-id="result-title"
      >
        {formUrl ? (
          <>
            <p className="vads-u-font-weight--normal vads-u-margin--0">
              Form {id}
            </p>
            <a
              href={formUrl}
              className="vads-u-text-decoration--none vads-u-margin-top--1"
              onClick={() => recordGAEvent(title, formUrl, 'title')}
              lang={lang}
            >
              {title}{' '}
              <i
                aria-hidden="true"
                className="fas fa-angle-right vads-u-margin-left--0p25"
                pointerEvents="none"
                role="presentation"
                style={{ verticalAlign: 'middle' }}
              />
            </a>
          </>
        ) : (
          <>
            <p className="vads-u-font-weight--normal vads-u-margin--0">
              Form {id}
            </p>
            <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
              {title}
            </p>
          </>
        )}
      </dt>
    ) : (
      <dt
        className="vads-u-padding-top--3 vads-u-margin--0 vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-font-weight--bold"
        data-e2e-id="result-title"
      >
        {formUrl ? (
          <a
            href={formUrl}
            className="vads-u-text-decoration--none"
            onClick={() => recordGAEvent(title, formUrl, 'title')}
            lang={lang}
          >
            {id} {title}{' '}
            <i
              aria-hidden="true"
              className="fas fa-angle-right vads-u-margin-left--0p25"
              pointerEvents="none"
              role="presentation"
              style={{ verticalAlign: 'middle' }}
            />
          </a>
        ) : (
          <>
            {id} {title}
          </>
        )}
      </dt>
    )}
  </>
);

FormTitle.propTypes = {
  id: PropTypes.string.isRequired,
  formUrl: PropTypes.string,
  recordGAEvent: PropTypes.func,
  title: PropTypes.string.isRequired,
  useSearchUIUXEnhancements: PropTypes.bool,
};

export default FormTitle;
