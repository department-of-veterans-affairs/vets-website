import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import environment from '~/platform/utilities/environment';
import recordEvent from '~/platform/monitoring/record-event';
import * as customPropTypes from '../prop-types';
import {
  FORM_MOMENT_PRESENTATION_DATE_FORMAT,
  FORM_MOMENT_CONSTRUCTOR_DATE_FORMAT,
} from '../constants';
import FormTitle from './FormTitle';

const deriveLinkPropsFromFormURL = url => {
  const linkProps = {};
  if (!url) return linkProps;

  const isSameOrigin = url.startsWith(window.location.origin);
  const isPDF = url.toLowerCase().includes('.pdf');

  if (!isSameOrigin || !isPDF) {
    linkProps.target = '_blank';
  } else {
    linkProps.download = true;

    if (isPDF) linkProps.type = 'application/pdf';
  }

  return linkProps;
};

// helper for replacing the form title to keep same domain for testing in non production
const regulateURL = url => {
  if (!url) return '';

  if (environment.isProduction()) {
    return url;
  }

  const currentHostname = url.substring(0, url.indexOf('/find-forms'));

  // On non-prod envs, we need to swap the hostname of the URL.
  return url.replace(currentHostname, environment.BASE_URL);
};

export const deriveLatestIssue = (d1, d2) => {
  if (!d1 && !d2) return 'N/A';
  if (!d1) return moment(d2).format(FORM_MOMENT_PRESENTATION_DATE_FORMAT); // null scenarios
  if (!d2) return moment(d1).format(FORM_MOMENT_PRESENTATION_DATE_FORMAT);

  const date1Formatted = moment(d1).format(FORM_MOMENT_CONSTRUCTOR_DATE_FORMAT);
  const date2Formatted = moment(d2).format(FORM_MOMENT_CONSTRUCTOR_DATE_FORMAT);

  if (moment(date1Formatted).isAfter(date2Formatted))
    return moment(date1Formatted).format(FORM_MOMENT_PRESENTATION_DATE_FORMAT);

  return moment(date2Formatted).format(FORM_MOMENT_PRESENTATION_DATE_FORMAT);
};

const deriveLanguageTranslation = (lang = 'en', whichNode, formName) => {
  const languages = {
    es: {
      goToOnlineTool: `Llene el formulario VA ${formName} en línea.`,
      downloadVaForm: `Descargar el formulario VA ${formName}`,
    },
    en: {
      goToOnlineTool: `Fill out VA Form ${formName} online`,
      downloadVaForm: `Download VA Form ${formName}`,
    },
  };

  return languages[lang][whichNode];
};

const recordGAEventHelper = ({
  query,
  eventUrl,
  eventTitle,
  eventType,
  currentPage,
  currentPositionOnPage,
  totalResultsCount,
  totalResultsPages,
}) =>
  recordEvent({
    event: 'onsite-search-results-click', // remains consistent, push this event and metadata with each search result click
    'search-page-path': '/find-forms', // consistent for all search result clicks from this page
    'search-query': query, // dynamically populate with the search query
    'search-result-chosen-page-url': eventUrl, // populate with the full href of the form detail page or tool page
    'search-result-chosen-title': eventTitle, // or 'Download VA form 10-10EZ (PDF)' or 'Go to online tool' (NOW => "Fill out VA Form {id} online")
    'search-result-type': eventType, // populate with 'pdf' if pdf, or 'cta' if "Go to online tool" (NOW => "Fill out VA Form {id} online")
    'search-results-pagination-current-page': currentPage, // populate with the current pagination number at time of result click
    'search-results-position': currentPositionOnPage, // populate with position on page of result click, beginning with 1 as the first result, number in relation to total results on the page (10 being last with 10 results are shown)
    'search-results-total-count': totalResultsCount, // populate with the total number of search results at time of click
    'search-results-total-pages': totalResultsPages, // populate with total number of result pages at time of click
    'search-selection': 'Find forms', // populate consistently with 'Find forms'
    'search-results-top-recommendation': undefined, // consistently populate with undefined since there's no top recommendations surfaced here
    'search-typeahead-enabled': false, // consistently populate with false since there's no type ahead enabled for this search feature
  });

const deriveRelatedTo = ({
  vaFormAdministration,
  formType,
  benefitCategories,
}) => {
  let relatedTo = vaFormAdministration;

  if (formType === 'employment') {
    relatedTo = 'Employment or jobs at VA';
  }
  if (formType === 'non-va') {
    relatedTo = (
      <>
        A non-VA form. For other government agency forms, go to the{' '}
        <a href="https://www.gsa.gov/reference/forms">GSA forms library</a>
      </>
    );
  }

  if (benefitCategories?.length > 0) {
    relatedTo = benefitCategories.map(f => f.name).join(', ');
  }

  if (relatedTo) {
    return (
      <div className="vads-u-margin-top--1 vads-u-margin-bottom--2">
        <span className="vads-u-font-weight--bold">Related to:</span>{' '}
        {relatedTo}
      </div>
    );
  }

  return null;
};

const SearchResult = ({
  form,
  formMetaInfo,
  showPDFInfoVersionOne,
  toggleModalState,
  setPrevFocusedLink,
}) => {
  if (!form?.attributes) {
    return null;
  }

  const {
    attributes: {
      firstIssuedOn,
      formName,
      formType,
      formToolUrl,
      formDetailsUrl,
      language,
      lastRevisionOn,
      benefitCategories,
      vaFormAdministration,
      title,
      url,
    },
    id,
  } = form;

  const linkProps = deriveLinkPropsFromFormURL(url);
  const pdfLabel = url.toLowerCase().includes('.pdf') ? '(PDF)' : '';
  const lastRevision = deriveLatestIssue(firstIssuedOn, lastRevisionOn);

  const relatedTo = deriveRelatedTo({
    vaFormAdministration,
    formType,
    benefitCategories,
  });

  const recordGAEvent = (eventTitle, eventUrl, eventType) =>
    recordGAEventHelper({ ...formMetaInfo, eventTitle, eventUrl, eventType });

  const pdfDownloadHandler = () => {
    setPrevFocusedLink(`pdf-link-${id}`);

    if (showPDFInfoVersionOne) {
      recordEvent({
        event: 'int-modal-click',
        'modal-status': 'opened',
        'modal-title': 'Download this PDF and open it in Acrobat Reader',
      });

      toggleModalState(formName, url, pdfLabel);
    } else {
      recordGAEvent(`Download VA form ${formName} ${pdfLabel}`, url, 'pdf');
    }
  };

  return (
    <li className="vads-u-padding-y--4 vads-u-border-top--1px vads-u-border-color--gray-lighter">
      <FormTitle
        id={id}
        formUrl={regulateURL(formDetailsUrl)}
        lang={language}
        title={title}
        recordGAEvent={recordGAEvent}
        formName={formName}
      />
      <div className="vads-u-margin-y--1 vsa-from-last-updated">
        <span className="vads-u-font-weight--bold">Form last updated:</span>{' '}
        {lastRevision}
      </div>

      {relatedTo}
      {formToolUrl ? (
        <div className="vads-u-margin-bottom--2p5">
          <a
            className="find-forms-max-content vads-u-display--flex vads-u-align-items--center vads-u-text-decoration--none"
            href={formToolUrl}
            onClick={() =>
              recordGAEvent(`Go to online tool`, formToolUrl, 'cta')
            }
          >
            <i
              aria-hidden="true"
              className="fas fa-chevron-circle-right fa-2x vads-u-margin-right--1"
              role="presentation"
            />
            <span
              lang={language}
              className="vads-u-text-decoration--underline vads-u-font-weight--bold"
            >
              {deriveLanguageTranslation(language, 'goToOnlineTool', formName)}
            </span>
          </a>
        </div>
      ) : null}
      <div className="vads-u-margin-y--0">
        <a
          className="find-forms-max-content vads-u-text-decoration--none"
          data-testid={`pdf-link-${id}`}
          id={`pdf-link-${id}`}
          rel="noreferrer noopener"
          href={showPDFInfoVersionOne ? null : url}
          tabIndex="0"
          onKeyDown={event => {
            if (event.keyCode === 13) {
              pdfDownloadHandler();
            }
          }}
          onClick={() => pdfDownloadHandler()}
          {...linkProps}
        >
          <i
            aria-hidden="true"
            className="fas fa-download fa-lg vads-u-margin-right--1"
            role="presentation"
          />

          <span lang={language} className="vads-u-text-decoration--underline">
            {deriveLanguageTranslation(language, 'downloadVaForm', formName)}
          </span>
        </a>
      </div>
    </li>
  );
};

SearchResult.propTypes = {
  form: customPropTypes.Form.isRequired,
  formMetaInfo: customPropTypes.FormMetaInfo,
  setPrevFocusedLink: PropTypes.func,
  showPDFInfoVersionOne: PropTypes.bool,
  toggleModalState: PropTypes.func,
};

export default SearchResult;
