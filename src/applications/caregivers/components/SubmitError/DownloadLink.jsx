import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import moment from 'moment';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

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
  const getFormData = submitTransform(formConfig, form);
  const [setFormData, formData] = useState(null);
  const veteranFullName = form.data.veteranFullName;
  const pageList = createFormPageList(formConfig);
  const isFormValid = isValidForm(form, pageList);

  const downloadPDF = data => {
    setLoading(true);
    apiRequest(
      `${environment.API_URL}/v0/caregivers_assistance_claims/download_pdf`,
      {
        method: 'POST',
        body: data,
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
        recordEvent({ event: 'caregivers-10-10cg-pdf-download--success' });
      })
      .catch(error => {
        setLoading(false);
        Sentry.withScope(scope => scope.setExtra('error', error));
        recordEvent({ event: 'caregivers-10-10cg-pdf--failure' });
      });
  };

  useEffect(
    () => {
      setFormData(getFormData);
      const notSameData = formData !== getFormData;
      if (isFormValid.isValid && notSameData) downloadPDF(formData);
    },
    [getFormData, isFormValid.isValid, setFormData],
  );

  const renderPDFLink = () => {
    return (
      <div className="pdf-download-link--loaded vads-u-margin-top--2">
        <a
          aria-label="Download 1010CG filled out PDF form"
          href={PDFLink}
          download={`10-10CG_${veteranFullName.first}_${veteranFullName.last}`}
          target="_blank"
          rel="noreferrer noopener"
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

  const renderLoadingIndicator = () => {
    return (
      <div className="pdf-download-link--loading">
        <LoadingIndicator message="Downloading PDF..." />
      </div>
    );
  };

  return isLoading ? renderLoadingIndicator() : renderPDFLink();
};

export default DownLoadLink;
