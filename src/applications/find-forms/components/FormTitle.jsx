import React from 'react';
import PropTypes from 'prop-types';

const FormTitle = ({ id, formUrl, title, lang, recordGAEvent }) => (
  <dt
    className="vads-u-padding-top--5 vads-u-margin--0 vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-font-weight--bold"
    data-e2e-id="result-title"
  >
    {formUrl ? (
      <>
        <p className="vads-u-font-weight--normal vads-u-margin--0">Form {id}</p>
        <a
          href={formUrl}
          className="vads-u-font-family--serif vads-u-margin-top--1"
          onClick={() => recordGAEvent(title, formUrl, 'title')}
          lang={lang}
        >
          {title}
        </a>
      </>
    ) : (
      <>
        <p className="vads-u-font-weight--normal vads-u-margin--0">Form {id}</p>
        <p className="vads-u-font-family--serif vads-u-margin-top--1 vads-u-margin-bottom--0">
          {title}
        </p>
      </>
    )}
  </dt>
);

FormTitle.propTypes = {
  id: PropTypes.string.isRequired,
  formUrl: PropTypes.string,
  recordGAEvent: PropTypes.func,
  title: PropTypes.string.isRequired,
};

export default FormTitle;
