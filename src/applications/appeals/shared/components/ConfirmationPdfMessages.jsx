import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { apiRequest } from 'platform/utilities/api';

const ONE_MINUTE = 1000 * 60; // ms

/**
 * Download PDF on confirmation page
 * @param {String} pdfApi - Lighthouse download PDF API for a form
 * @param {Number} delayTimer - time in ms until a warning is displayed below
 *  the loading indicator
 * @returns {Element} - loading indicator, alert or link
 */
const ConfirmationPdfMessages = ({
  pdfApi,
  successLinkText = 'Download a copy of your Board Appeal',
  delayTimer = ONE_MINUTE,
}) => {
  const [apiState, setApiState] = useState('generating');
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(
    () => {
      let timer;
      if (delayTimer) {
        timer = setTimeout(() => {
          setApiState('delayed');
        }, delayTimer);
      } else {
        // delayTimer set to zero for unit testing
        setApiState('delayed');
      }

      apiRequest(pdfApi)
        .then(response => {
          clearTimeout(timer);
          if (response.ok && response.data) {
            setDownloadUrl(response.data);
            setApiState('successful');
          } else {
            setApiState('error');
          }
        })
        .catch(() => {
          setApiState('error');
        });
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  switch (apiState) {
    case 'generating':
    case 'delayed':
      return (
        <>
          <va-loading-indicator
            label="Loading"
            message="Generating your PDF. This may take a minute"
          />
          {apiState === 'delayed' && (
            <va-alert status="warning" class="vads-u-margin-top--2">
              <div>
                It is taking longer than usual to load. You can continue to wait
                or review and print the information you submitted in your form.
              </div>
            </va-alert>
          )}
        </>
      );
    case 'error':
      return (
        <va-alert status="error" class="vads-u-margin-top--2">
          <div>
            Sorry, we’re unable to generate a PDF at this time. You can still
            review and print the information you submitted in your form.
          </div>
        </va-alert>
      );
    case 'successful':
      return (
        <va-link
          download
          filetype="PDF"
          href={downloadUrl}
          text={successLinkText}
        />
      );
    default:
      return null;
  }
};

ConfirmationPdfMessages.propTypes = {
  delayTimer: PropTypes.number,
  pdfApi: PropTypes.string,
  successLinkText: PropTypes.string,
};

export default ConfirmationPdfMessages;
