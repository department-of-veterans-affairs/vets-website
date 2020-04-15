import React from 'react';
import moment from 'moment';

import * as customPropTypes from '../prop-types';

export default function SearchResult({ form }) {
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
    'vads-u-color--link-default',
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
          href={form.attributes.url}
          rel="noopener noreferrer"
          target="_blank"
          download
        >
          Download VA form {form.id} {pdf}
        </a>
      </dd>
    </>
  );
}

SearchResult.propTypes = {
  form: customPropTypes.Form.isRequired,
};
