import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { replaceWithStagingDomain } from 'platform/utilities/environment/stagingDomains';
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
      <div className="vads-u-margin-top--1 vads-u-margin-bottom--2">
        <span className="vads-u-font-weight--bold">Related to:</span>{' '}
        {relatedTo}
      </div>
    );
  }

  return null;
};

const SearchResult = ({ form, toggleModalState, setPrevFocusedLink }) => {
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
  const relativeFormToolUrl = formToolUrl
    ? replaceWithStagingDomain(formToolUrl)
    : formToolUrl;
  const linkProps = deriveLinkPropsFromFormURL(url);
  const pdfLabel = url.toLowerCase().includes('.pdf') ? '(PDF)' : '';
  const lastRevision = deriveLatestIssue(firstIssuedOn, lastRevisionOn);

  const relatedTo = deriveRelatedTo({
    vaFormAdministration,
    formType,
    benefitCategories,
  });

  const pdfDownloadHandler = () => {
    setPrevFocusedLink(`pdf-link-${id}`);

    recordEvent({
      event: 'int-modal-click',
      'modal-status': 'opened',
      'modal-title': 'Download this PDF and open it in Acrobat Reader',
    });

    toggleModalState(formName, url, pdfLabel);
  };

  return (
    <li className="vads-u-padding-y--4 vads-u-border-top--1px vads-u-border-color--gray-lighter">
      <FormTitle
        id={id}
        formUrl={regulateURL(formDetailsUrl)}
        lang={language}
        title={title}
        formName={formName}
      />
      <div className="vads-u-margin-y--1 vsa-from-last-updated">
        <span className="vads-u-font-weight--bold">Form last updated:</span>{' '}
        {lastRevision}
      </div>

      {relatedTo}
      {relativeFormToolUrl ? (
        <div className="vads-u-margin-bottom--2p5">
          <va-link
            className="vads-c-action-link--green"
            href={relativeFormToolUrl}
            lang={language}
            text={deriveLanguageTranslation(
              language,
              'goToOnlineTool',
              formName,
            )}
          />
        </div>
      ) : null}
      <div className="vads-u-margin-y--0">
        <button
          className="va-button-link"
          data-testid={`pdf-link-${id}`}
          id={`pdf-link-${id}`}
          tabIndex="0"
          onKeyDown={event => {
            if (event === 13) {
              pdfDownloadHandler();
            }
          }}
          onClick={pdfDownloadHandler}
          {...linkProps}
        >
          <va-icon icon="file_download" size="3" />
          <span
            lang={language}
            className="vads-u-text-decoration--underline vads-u-margin-left--0p5"
          >
            {deriveLanguageTranslation(language, 'downloadVaForm', formName)}
          </span>
        </button>
      </div>
    </li>
  );
};

SearchResult.propTypes = {
  form: customPropTypes.Form.isRequired,
  setPrevFocusedLink: PropTypes.func,
  toggleModalState: PropTypes.func,
};

export default SearchResult;
