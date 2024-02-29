import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';

import { apiRequest } from 'platform/utilities/api';
import { focusElement } from 'platform/utilities/ui';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import localStorage from 'platform/utilities/storage/localStorage';
import { downloadErrorsByCode } from '../definitions/content';
import { submitTransform } from '../utils/helpers';
import formConfig from '../config/form';

const apiURL = `${
  environment.API_URL
}/v0/caregivers_assistance_claims/download_pdf`;

const ApplicationDownloadLink = ({ form }) => {
  const [PDFLink, setPDFLink] = useState(null);
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

  const csrfTokenStored = localStorage.getItem('csrfToken');
  // define our method of retrieving the link to download
  const fetchDownloadUrl = body => {
    isLoading(true);

    // create the application link
    apiRequest(apiURL, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        'Source-App-Name': window.appName,
        'X-CSRF-Token': csrfTokenStored,
      },
    })
      .then(response => response.blob())
      .then(blob => {
        const linkUrl = URL.createObjectURL(blob);
        setPDFLink(linkUrl);
        isLoading(false);
        setErrors([]);
        recordEvent({ event: 'caregivers-10-10cg-pdf-download--success' });
      })
      .catch(response => {
        isLoading(false);
        setErrors(response.errors);
        recordEvent({ event: 'caregivers-10-10cg-pdf--failure' });
        Sentry.withScope(scope => scope.setExtra('error', response));
      });
  };

  // get application download link when form data is transformed
  useEffect(
    () => {
      fetchDownloadUrl(formData);
    },
    [formData],
  );

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
        <va-alert status="error">
          <h3 slot="headline" className="vads-u-font-size--h4">
            Something went wrong
          </h3>
          {errorMessage()}
        </va-alert>
      </div>
    );
  }

  return (
    <va-link
      href={PDFLink}
      text="Download your completed application"
      filename={`10-10CG_${name.first}_${name.last}`}
      filetype="PDF"
      download
    />
  );
};

ApplicationDownloadLink.propTypes = {
  form: PropTypes.object,
};

export default ApplicationDownloadLink;
