// Node modules.
import React from 'react';
import moment from 'moment';
// Relative imports.
import * as customPropTypes from '../prop-types';

// Helper to derive the download link props.
const deriveLinkPropsFromFormURL = url => {
  const linkProps = {};
  if (!url) return linkProps;

  const isSameOrigin = url.startsWith(window.location.origin);
  const isPDF = url.toLowerCase().includes('.pdf');

  if (!isSameOrigin || !isPDF) {
    // Just open in a new tab if we'd otherwise hit a CORS issue or if the form URL isn't a PDF.
    linkProps.target = '_blank';
  } else {
    // Use HTML5 `download` attribute.
    linkProps.download = decodeURI(url.split('/').pop());
    if (isPDF) linkProps.type = 'application/pdf';
  }

  return linkProps;
};

// builds results title
const buildFormTitle = (id, detailsUrl, title) => (
  <dt
    className="vads-u-padding-top--3 vads-u-margin--0 vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-font-weight--bold"
    data-e2e-id="result-title"
  >
    {detailsUrl ? (
      <a href={detailsUrl} className="vads-u-text-decoration--none">
        <dfn>
          <span className="vads-u-visibility--screen-reader">
            Visit the landing page for Form number
          </span>
          {id}{' '}
        </dfn>
        {title}
        <i
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

const SearchResult = ({ form }) => {
  // Escape early if we don't have the necessary form attributes.
  if (!form?.attributes) {
    return null;
  }

  const {
    attributes: {
      formToolUrl,
      formDetailsUrl,
      lastRevisionOn,
      relatedForms,
      title,
      url,
    },
    id,
  } = form;

  // Derive the download link props.
  const linkProps = deriveLinkPropsFromFormURL(url);

  // Derive labels.
  const pdfLabel = url.toLowerCase().includes('.pdf') ? '(PDF)' : '';
  const lastRevision = lastRevisionOn
    ? moment(lastRevisionOn).format('MM-DD-YYYY')
    : 'N/A';

  return (
    <>
      {buildFormTitle(id, formDetailsUrl, title)}

      <dd className="vads-u-margin-y--1 vads-u-margin-y--1">
        <dfn className="vads-u-font-weight--bold">Form last updated:</dfn>{' '}
        {lastRevision}
      </dd>

      {relatedForms.length > 0 ? (
        <dd className="vads-u-margin-y--1 vads-u-margin-y--1">
          <dfn className="vads-u-font-weight--bold">Related to:</dfn>{' '}
          {relatedForms.join(', ')}
        </dd>
      ) : null}

      <dd className="vads-u-margin-bottom--1">
        <a href={url} rel="noreferrer noopener" {...linkProps}>
          Download VA form {id} {pdfLabel}
        </a>
      </dd>

      {formToolUrl ? (
        <a
          className="usa-button usa-button-secondary vads-u-margin-bottom--3"
          href={formToolUrl}
        >
          Go to online tool{' '}
          <span className="vads-u-visibility--screen-reader">for {title}</span>
        </a>
      ) : null}
    </>
  );
};

SearchResult.propTypes = {
  form: customPropTypes.Form.isRequired,
};

export default SearchResult;
