import React from 'react';
import PropTypes from 'prop-types';

const FormTitle = ({
  id,
  formUrl,
  showFindFormsResultsLinkToFormDetailPages,
  title,
}) => (
  <dt
    className="vads-u-padding-top--3 vads-u-margin--0 vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-font-weight--bold"
    data-e2e-id="result-title"
  >
    {formUrl && showFindFormsResultsLinkToFormDetailPages ? (
      <a href={formUrl} className="vads-u-text-decoration--none">
        <dfn>
          <span className="vads-u-visibility--screen-reader">
            Visit the landing page for Form number
          </span>
          {id}{' '}
        </dfn>
        {title}
        <i
          aria-hidden="true"
          role="presentation"
          className="fas fa-angle-right vads-u-margin-left--0p25"
          style={{ verticalAlign: 'middle' }}
        />
      </a>
    ) : (
      <>
        <dfn>
          <span className="vads-u-visibility--screen-reader">Form number</span>{' '}
          {id}{' '}
        </dfn>
        {title}
      </>
    )}
  </dt>
);

FormTitle.propTypes = {
  id: PropTypes.string.isRequired,
  formUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  showFindFormsResultsLinkToFormDetailPages: PropTypes.bool.isRequired,
};

export default FormTitle;
