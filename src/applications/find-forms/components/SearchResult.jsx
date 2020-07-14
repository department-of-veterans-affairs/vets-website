// Node modules.
import React from 'react';
import download from 'downloadjs';
import moment from 'moment';
// Relative imports.
import * as customPropTypes from '../prop-types';

// Helper to handle downloads on IE.
const onDownloadClick = url => event => {
  event.preventDefault();

  try {
    // Attempt to download the file.
    const request = download(url);

    // If we aren't able to, resort to opening the download link in a new tab.
    request.onerror = window.open(url, '_blank');
  } catch (error) {
    window.open(url, '_blank');
  }
};

// Helper to derive the download link props.
const deriveLinkProps = form => {
  const linkProps = {};

  const isSameOrigin = form?.attributes?.url.startsWith(window.location.origin);
  const isPDF = form?.attributes?.url.toLowerCase().includes('.pdf');
  const isInternetExplorer = !!navigator.msSaveBlob;

  if (!isSameOrigin || !isPDF) {
    // Just open in a new tab if we'd otherwise hit a CORS issue or if the form URL isn't a PDF.
    linkProps.target = '_blank';
  } else if (isInternetExplorer) {
    // IE doesn't support the HTML download attribute.
    linkProps.onClick = onDownloadClick(form.attributes.url);
  } else {
    // Use HTML5 `download` attribute.
    linkProps.download = true;
  }

  return linkProps;
};

const SearchResult = ({ form }) => {
  // Escape early if we don't have the necessary form attributes.
  if (!form?.attributes) {
    return null;
  }

  // Derive the download link props.
  const linkProps = deriveLinkProps(form);

  // Derive labels.
  const pdfLabel = form.attributes.url.toLowerCase().includes('.pdf')
    ? '(PDF)'
    : '';
  const lastRevisionOn = form.attributes.lastRevisionOn
    ? moment(form.attributes.lastRevisionOn).format('MM-DD-YYYY')
    : 'N/A';

  return (
    <>
      <dt
        className="vads-u-padding-top--3 vads-u-margin--0 vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-font-weight--bold"
        data-e2e-id="result-title"
      >
        <dfn>
          <span className="vads-u-visibility--screen-reader">Form number</span>{' '}
          {form.id}
        </dfn>{' '}
        {form.attributes.title}
      </dt>

      <dd className="vads-u-margin-y--1 vads-u-margin-y--1">
        <dfn className="vads-u-font-weight--bold">Form last updated:</dfn>{' '}
        {lastRevisionOn}
      </dd>

      <dd className="vads-u-padding-bottom--3">
        <a href={form.attributes.url} rel="noreferrer noopener" {...linkProps}>
          Download VA form {form.id} {pdfLabel}
        </a>
      </dd>
    </>
  );
};

SearchResult.propTypes = {
  form: customPropTypes.Form.isRequired,
};

export default SearchResult;
