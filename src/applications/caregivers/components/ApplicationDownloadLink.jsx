import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';

import { apiRequest } from 'platform/utilities/api';
import { focusElement } from 'platform/utilities/ui';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { downloadErrorsByCode } from '../definitions/content';
import { submitTransform } from '../utils/helpers';
import formConfig from '../config/form';

const apiURL = `${
  environment.API_URL
}/v0/caregivers_assistance_claims/download_pdf`;

const ApplicationDownloadLink = ({ form }) => {
  const [loading, isLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  // define local use variables
  const formData = submitTransform(formConfig, form);
  const { veteranFullName: name } = form.data;

  // fetch a custom error message based on status code
  const errorMessage = () => {
    const code = errors[0].status.split('')[0];
    const { generic } = downloadErrorsByCode;
    return downloadErrorsByCode[code] || generic;
  };

  const handlePdfDownload = blob => {
    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');

    downloadLink.className = 'cg-application-download-link';
    downloadLink.href = downloadUrl;
    downloadLink.download = `10-10CG_${name.first}_${name.last}.pdf`;
    document.body.appendChild(downloadLink);

    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadUrl);
  };

  // define our method of retrieving the link to download
  const fetchPdf = () => {
    isLoading(true);

    // create the application link
    apiRequest(apiURL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.blob())
      .then(blob => {
        handlePdfDownload(blob);
        recordEvent({ event: 'caregivers-10-10cg-pdf-download--success' });
      })
      .catch(response => {
        setErrors(response.errors);
        recordEvent({ event: 'caregivers-10-10cg-pdf--failure' });
        Sentry.withScope(scope => scope.setExtra('error', response));
      })
      .finally(() => {
        isLoading(false);
      });
  };

  // apply focus to the error alert if we have errors set
  useEffect(
    () => {
      if (errors?.length > 0) {
        focusElement('.caregiver-download-error');
      }
    },
    [errors],
  );

  // render loading indicator while application download is processing
  if (loading) {
    return (
      <va-loading-indicator
        label="Loading application"
        message="Preparing your application for download..."
      />
    );
  }

  // render error alert if file cannot download
  if (errors?.length > 0) {
    return (
      <div className="caregiver-download-error">
        <va-alert status="error" uswds>
          <h3 slot="headline" className="vads-u-font-size--h4">
            Something went wrong
          </h3>
          {errorMessage()}
        </va-alert>
      </div>
    );
  }

  return (
    <button className="va-button-link" type="button" onClick={() => fetchPdf()}>
      Download your completed application
    </button>
  );
};

ApplicationDownloadLink.propTypes = {
  form: PropTypes.object,
};

export default ApplicationDownloadLink;
