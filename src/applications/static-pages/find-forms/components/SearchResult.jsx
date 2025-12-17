import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format, parseISO, isAfter } from 'date-fns';
import { replaceWithStagingDomain } from 'platform/utilities/environment/stagingDomains';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { FormTypes, FormMetaInfoTypes } from '../types';
import { FORM_MOMENT_PRESENTATION_DATE_FORMAT } from '../constants';
import FormTitle from './FormTitle';
import { checkFormValidity } from '../api';
import { createLogMessage } from '../helpers/datadogLogger';
import InvalidFormAlert from './InvalidFormAlert';

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
  if (!d1) return format(parseISO(d2), FORM_MOMENT_PRESENTATION_DATE_FORMAT);
  if (!d2) return format(parseISO(d1), FORM_MOMENT_PRESENTATION_DATE_FORMAT);

  const date1Formatted = parseISO(d1);
  const date2Formatted = parseISO(d2);

  if (isAfter(date1Formatted, date2Formatted))
    return format(date1Formatted, FORM_MOMENT_PRESENTATION_DATE_FORMAT);

  return format(date2Formatted, FORM_MOMENT_PRESENTATION_DATE_FORMAT);
};

const deriveLanguageTranslation = (lang = 'en', whichNode, formName) => {
  const languages = {
    es: {
      goToOnlineTool: `Llene el formulario VA ${formName} en línea.`,
      downloadVaForm: `Descargar el formulario VA ${formName}`,
    },
    en: {
      goToOnlineTool: `Fill out VA Form ${formName} online`,
      downloadVaForm: `Download VA Form ${formName} (PDF)`,
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
        <va-link
          href="https://www.gsa.gov/reference/forms"
          text="GSA forms library"
        />
      </>
    );
  }

  if (benefitCategories?.length > 0) {
    relatedTo = benefitCategories.map(f => f.name).join(', ');
  }

  if (relatedTo) {
    return (
      <div
        className="vads-u-margin-top--1 vads-u-margin-bottom--2"
        data-e2e-id="related-to"
      >
        <span className="vads-u-font-weight--bold">Related to:</span>{' '}
        {relatedTo}
      </div>
    );
  }

  return null;
};

const SearchResult = ({ form, formMetaInfo, setModalState }) => {
  const [pdfError, setPdfError] = useState(false);

  if (!form?.attributes) {
    return null;
  }

  const {
    attributes: {
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
  const relativeFormToolUrl = formToolUrl
    ? replaceWithStagingDomain(formToolUrl)
    : formToolUrl;

  const relatedTo = deriveRelatedTo({
    vaFormAdministration,
    formType,
    benefitCategories,
  });

  const recordGAEvent = (eventTitle, eventUrl, eventType) =>
    recordGAEventHelper({ ...formMetaInfo, eventTitle, eventUrl, eventType });

  const pdfDownloadHandler = async () => {
    const {
      formPdfIsValid,
      formPdfUrlIsValid,
      networkRequestError,
    } = await checkFormValidity(form, 'Form Search Results');

    if (formPdfIsValid && formPdfUrlIsValid && !networkRequestError) {
      setPdfError(false);
      setModalState({
        formId: `pdf-link-${id}`,
        formName,
        formUrl: url,
        isOpen: true,
      });
    } else {
      createLogMessage(
        url,
        form,
        formPdfIsValid,
        formPdfUrlIsValid,
        networkRequestError,
      );

      setPdfError(true);
    }
  };

  return (
    <li className="vads-u-padding-y--4 vads-u-border-top--1px vads-u-border-color--gray-lighter">
      <FormTitle
        id={id}
        formUrl={regulateURL(formDetailsUrl)}
        title={title}
        recordGAEvent={recordGAEvent}
        formName={formName}
      />
      <div className="vads-u-margin-y--1" data-e2e-id="form-revision-date">
        <span className="vads-u-font-weight--bold">Form revision date:</span>{' '}
        {lastRevisionOn
          ? format(
              parseISO(lastRevisionOn),
              FORM_MOMENT_PRESENTATION_DATE_FORMAT,
            )
          : 'N/A'}
      </div>

      {relatedTo}
      {relativeFormToolUrl ? (
        <div className="vads-u-margin-bottom--2p5">
          <va-link-action
            href={relativeFormToolUrl}
            text={deriveLanguageTranslation(
              language,
              'goToOnlineTool',
              formName,
            )}
            type="secondary"
          />
        </div>
      ) : null}
      <div className="vads-u-margin-y--0">
        {pdfError && (
          <InvalidFormAlert downloadUrl={url} isRelatedForm={false} />
        )}
        {!pdfError && (
          <button
            className="va-button-link"
            data-testid={`pdf-link-${id}`}
            id={`pdf-link-${id}`}
            onKeyDown={event => {
              if (event === 13) {
                pdfDownloadHandler();
              }
            }}
            onClick={pdfDownloadHandler}
          >
            <va-icon icon="file_download" size="3" />
            <span
              lang={language}
              className="vads-u-text-decoration--underline vads-u-margin-left--0p5"
            >
              {deriveLanguageTranslation(language, 'downloadVaForm', formName)}
            </span>
          </button>
        )}
      </div>
    </li>
  );
};

SearchResult.propTypes = {
  form: FormTypes,
  formMetaInfo: FormMetaInfoTypes,
  setModalState: PropTypes.func,
};

export default SearchResult;
