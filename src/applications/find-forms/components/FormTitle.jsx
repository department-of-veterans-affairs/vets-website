import React from 'react';
import PropTypes from 'prop-types';

const FormTitle = ({
  currentPosition,
  id,
  formUrl,
  title,
  lang,
  recordGAEvent,
  showPDFInfoVersionTwo,
}) => (
  <dt
    className="vads-u-padding-top--5 vads-u-margin--0 vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-font-weight--bold"
    data-e2e-id="result-title"
  >
    {currentPosition === 1 && showPDFInfoVersionTwo ? (
      <div className="vads-u-margin-bottom--1p5">
        <va-alert status="info">
          <div className="usa-alert-text vads-u-font-size--base">
            <h3 slot="heading" className="vads-u-margin-top--0">
              We recommend that you download PDF forms and open them in Adobe
              Acrobat Reader
            </h3>
            <a href="https://www.va.gov/resources/how-to-download-and-open-a-vagov-pdf-form/">
              Get instructions for opening the form in Acrobat Reader
            </a>
          </div>
        </va-alert>
      </div>
    ) : null}
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
  currentPosition: PropTypes.number,
  id: PropTypes.string.isRequired,
  formUrl: PropTypes.string,
  recordGAEvent: PropTypes.func,
  title: PropTypes.string.isRequired,
  showPDFInfoVersionTwo: PropTypes.bool,
};

export default FormTitle;
