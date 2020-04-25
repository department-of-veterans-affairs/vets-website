// Node modules.
import React from 'react';
import moment from 'moment';
import download from 'downloadjs';
// Relative imports.
import * as customPropTypes from '../prop-types';

const onDownloadClick = url => event => {
  // Escape early if we're not on IE.
  if (!navigator.msSaveBlob) {
    return;
  }

  // Prevent browser default behavior.
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

const SearchResult = ({ form }) => {
  if (!form?.attributes) {
    return null;
  }

  const pdf = form.attributes.url.toLowerCase().includes('.pdf') ? '(PDF)' : '';
  const lastRevisionOn = form.attributes.lastRevisionOn
    ? moment(form.attributes.lastRevisionOn).format('MM-DD-YYYY')
    : 'N/A';

  const formTitleClassName = [
    'vads-u-padding-top--3',
    'vads-u-margin--0',
    'vads-u-border-top--1px',
    'vads-u-border-color--gray-lighter',
    'vads-u-font-weight--bold',
  ].join(' ');

  return (
    <>
      <dt data-e2e-id="result-title" className={formTitleClassName}>
        <dfn>
          <span className="vads-u-visibility--screen-reader">Form number</span>{' '}
          {form.id}
        </dfn>{' '}
        {form.attributes.title}
      </dt>

      <dd className="vads-u-margin-y--1 vads-u-margin-y--1">
        <dfn className="vads-u-font-weight--bold">Revision date:</dfn>{' '}
        {lastRevisionOn}
      </dd>

      <dd className="vads-u-padding-bottom--3">
        <a
          download={form.attributes.url}
          href={form.attributes.url}
          onClick={onDownloadClick(form.attributes.url)}
          rel="noreferrer noopener"
        >
          Download VA form {form.id} {pdf}
        </a>
      </dd>
    </>
  );
};

SearchResult.propTypes = {
  form: customPropTypes.Form.isRequired,
};

export default SearchResult;
