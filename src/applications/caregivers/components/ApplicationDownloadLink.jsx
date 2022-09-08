/* eslint-disable no-console */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';

import { apiRequest } from 'platform/utilities/api';
import { focusElement } from 'platform/utilities/ui';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { downloadErrorsByCode } from '../definitions/content';
import { submitTransform } from '../helpers';
import formConfig from '../config/form';

const apiURL = `${
  environment.API_URL
}/v0/caregivers_assistance_claims/download_pdf`;

const ApplicationDownloadLink = ({ form }) => {
  const [loading, isLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  // get our custom error messages by status code
  const getErrorMessage = () => {
    const code = errors[0].status.split('')[0];
    const { generic } = downloadErrorsByCode;
    return downloadErrorsByCode[code] || generic;
  };

  // define our click event that will handle the download
  const handleClick = useCallback(
    () => {
      isLoading(true);

      // define our handler for downloading the blob data
      const triggerDownload = ({ blob, filename }) => {
        // create a blank anchor tag to trigger
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        // append element to the dom, or it may not trigger in some browsers
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      };

      // transform our form data for use
      const formData = submitTransform(formConfig, form);

      // create the application PDF file
      apiRequest(apiURL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/json',
          'Source-App-Name': window.appName,
        },
      })
        .then(response => {
          console.log('Fetch:', response);
          // parse blob data & desired filename to return from the response
          const disposition = response.headers.get('content-disposition');
          const filename = disposition.match(/filename=(.+)/)[1];
          const blob = response.blob();
          return { blob, filename };
        })
        .then(response => {
          console.log('Success:', response);
          triggerDownload(response);
          isLoading(false);
          setErrors([]);
          recordEvent({ event: 'caregivers-10-10cg-pdf-download--success' });
        })
        .catch(response => {
          console.log('ERROR:', response);
          isLoading(false);
          setErrors(response.errors);
          recordEvent({ event: 'caregivers-10-10cg-pdf--failure' });
          Sentry.withScope(scope => scope.setExtra('error', response));
        });
    },
    [form],
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

  // render loading indicator while file is downloading
  if (loading) {
    return (
      <va-loading-indicator
        label="Downloading"
        message="Preparing your application for download..."
        set-focus
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
          {getErrorMessage()}
        </va-alert>
      </div>
    );
  }

  return (
    <>
      <button type="button" className="va-button-link" onClick={handleClick}>
        <i
          className="fas fa-download vads-u-padding-right--1"
          aria-hidden="true"
          role="img"
        />
        Download your completed application
        <dfn>
          (<abbr title="Portable Document Format">PDF</abbr>)
        </dfn>
      </button>
    </>
  );
};

ApplicationDownloadLink.propTypes = {
  form: PropTypes.object,
};

export default ApplicationDownloadLink;
