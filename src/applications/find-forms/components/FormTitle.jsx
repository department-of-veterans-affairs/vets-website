import React from 'react';
import PropTypes from 'prop-types';

const FormTitle = ({ id, formUrl, title, lang, recordGAEvent, formName }) => (
  <div
    className="vads-u-margin--0 vads-u-font-weight--bold"
    data-e2e-id="result-title"
  >
    {formUrl ? (
      <>
        <p
          id={id}
          className="vads-u-font-weight--normal vads-u-margin-top--0 vads-u-margin-bottom--1p5"
        >
          Form {formName}
        </p>
        <h3
          aria-describedby={id}
          className="vads-u-font-size--base vads-u-margin--0"
        >
          <a
            href={formUrl}
            className="vads-u-font-family--serif vads-u-margin-top--1"
            onClick={() => recordGAEvent(title, formUrl, 'title')}
            lang={lang}
          >
            {title}
          </a>
        </h3>
      </>
    ) : (
      <>
        <p id={id} className="vads-u-font-weight--normal vads-u-margin--0">
          Form {formName}
        </p>
        <h3
          aria-describedby={id}
          className="vads-u-font-family--serif vads-u-font-size--base vads-u-margin--0"
          lang={lang}
        >
          {title}
        </h3>
      </>
    )}
  </div>
);

FormTitle.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  currentPosition: PropTypes.number,
  formName: PropTypes.string,
  formUrl: PropTypes.string,
  lang: PropTypes.string,
  recordGAEvent: PropTypes.func,
  showPDFInfoVersionTwo: PropTypes.bool,
};

export default FormTitle;
