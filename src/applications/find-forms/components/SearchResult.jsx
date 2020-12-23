// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// Relative imports.
import * as customPropTypes from '../prop-types';
import { FORM_MOMENT_DATE_FORMAT } from '../constants';
import FormTitle from './FormTitle';

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
    linkProps.download = true;
    if (isPDF) linkProps.type = 'application/pdf';
  }

  return linkProps;
};

export const deriveLatestIssue = (d1, d2) => {
  if (!d1 && !d2) return 'N/A';
  if (!d1) return moment(d2).format(FORM_MOMENT_DATE_FORMAT); // null scenarios
  if (!d2) return moment(d1).format(FORM_MOMENT_DATE_FORMAT);

  if (moment(d1).isAfter(d2)) return moment(d1).format(FORM_MOMENT_DATE_FORMAT);

  return moment(d2).format(FORM_MOMENT_DATE_FORMAT);
};

const SearchResult = ({ form, showFindFormsResultsLinkToFormDetailPages }) => {
  // Escape early if we don't have the necessary form attributes.
  if (!form?.attributes) {
    return null;
  }

  const {
    attributes: {
      firstIssuedOn,
      formToolUrl,
      formDetailsUrl,
      lastRevisionOn,
      benefitCategories,
      title,
      url,
    },
    id,
  } = form;

  // Derive the download link props.
  const linkProps = deriveLinkPropsFromFormURL(url);

  // Derive labels.
  const pdfLabel = url.toLowerCase().includes('.pdf') ? '(PDF)' : '';
  const lastRevision = deriveLatestIssue(firstIssuedOn, lastRevisionOn);

  return (
    <>
      <FormTitle
        id={id}
        formUrl={formDetailsUrl}
        title={title}
        showFindFormsResultsLinkToFormDetailPages={
          showFindFormsResultsLinkToFormDetailPages
        }
      />

      <dd className="vads-u-margin-y--1 vads-u-margin-y--1">
        <dfn className="vads-u-font-weight--bold">Form last updated:</dfn>{' '}
        {lastRevision}
      </dd>

      {benefitCategories && benefitCategories.length > 0 ? (
        <dd className="vads-u-margin-y--1 vads-u-margin-y--1">
          <dfn className="vads-u-font-weight--bold">Related to:</dfn>{' '}
          {benefitCategories.map(f => f.name).join(', ')}
        </dd>
      ) : null}

      <dd className="vads-u-margin-bottom--1">
        <a href={url} rel="noreferrer noopener" {...linkProps}>
          Download VA form {id} {pdfLabel}
        </a>
      </dd>

      {formToolUrl ? (
        <dd>
          <a
            className="usa-button usa-button-secondary vads-u-margin-bottom--3"
            href={formToolUrl}
          >
            Go to online tool{' '}
            <span className="vads-u-visibility--screen-reader">
              for {id} {title}
            </span>
          </a>
        </dd>
      ) : null}
    </>
  );
};

SearchResult.propTypes = {
  form: customPropTypes.Form.isRequired,
  showFindFormsResultsLinkToFormDetailPages: PropTypes.bool.isRequired,
};

export default SearchResult;
