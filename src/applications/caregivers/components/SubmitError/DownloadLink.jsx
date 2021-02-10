import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import moment from 'moment';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import formConfig from 'applications/caregivers/config/form';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { submitTransform } from 'applications/caregivers/helpers';
import { apiRequest } from 'platform/utilities/api';
import { isValidForm } from 'platform/forms-system/src/js/validation';
import { createFormPageList } from 'platform/forms-system/src/js/helpers';

const DownLoadLink = ({ form }) => {
  const [PDFLink, setPDFLink] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const getFormData = submitTransform(formConfig, form);
  const veteranFullName = form.data.veteranFullName;
  const pageList = createFormPageList(formConfig);
  const isFormValid = isValidForm(form, pageList);

  const downloadPDF = transformedData => {
    setLoading(true);
    apiRequest(
      `${environment.API_URL}/v0/caregivers_assistance_claims/download_pdf`,
      {
        method: 'POST',
        body: transformedData,
        headers: {
          'Content-Type': 'application/json',
          'Source-App-Name': 'caregivers-10-10cg-',
        },
      },
    )
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setPDFLink(url);
        setLoading(false);
        setErrors([]);
        recordEvent({ event: 'caregivers-10-10cg-pdf-download--success' });
      })
      .catch(error => {
        setLoading(false);
        setErrors(error.errors);
        Sentry.withScope(scope => scope.setExtra('error', error));
        recordEvent({ event: 'caregivers-10-10cg-pdf--failure' });
      });
  };

  useEffect(
    () => {
      if (isFormValid.isValid) downloadPDF(getFormData);
    },
    [getFormData, isFormValid.isValid],
  );

  const renderSuccessfulPDFLink = () => {
    return (
      <div className="pdf-download-link--loaded vads-u-margin-top--2">
        <a
          aria-label="Download 1010-CG filled out PDF form"
          href={PDFLink}
          download={`10-10CG_${veteranFullName.first}_${veteranFullName.last}`}
        >
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-download vads-u-padding-right--1"
          />
          Download your completed application
          <span className="sr-only vads-u-margin-right--0p5">
            `dated ${moment(Date.now()).format('MMM D, YYYY')}`
          </span>
          <dfn>
            <abbr title="Portable Document Format">(PDF)</abbr>
          </dfn>
        </a>
      </div>
    );
  };

  const renderErrorPDFLink = () => {
    const getErrorMessage = () => {
      const errorCodeType = errors[0].status.split('')[0];

      switch (errorCodeType) {
        case '4':
          return `We're sorry. We couldn't download your form. Please check the data and try again.`;
        case '5':
          return `We're sorry. VA.gov is down right now. If you need help right now, please call us.`;
        default:
          return null;
      }
    };

    return (
      <div className="vads-u-margin-top--2 vads-u-color--secondary-dark pdf-download-link--error">
        <a
          aria-label="Error downloading 1010-CG PDF"
          className="vads-u-color--gray-medium"
        >
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-download vads-u-padding-right--1"
          />
          Download your completed application
          <span className="sr-only vads-u-margin-right--0p5">
            `dated ${moment(Date.now()).format('MMM D, YYYY')}`
          </span>
        </a>

        <div className="error-note vads-u-margin-top--3">
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-exclamation-circle vads-u-padding-right--1"
          />

          <p className="vads-u-color--gray-dark">{getErrorMessage()}</p>
        </div>
      </div>
    );
  };

  const renderLoadingIndicator = () => {
    return (
      <div className="pdf-download-link--loading">
        <LoadingIndicator message="Downloading PDF..." />
      </div>
    );
  };

  if (errors?.length > 0) return renderErrorPDFLink();

  if (isLoading) return renderLoadingIndicator();

  return renderSuccessfulPDFLink();
};

export default DownLoadLink;
