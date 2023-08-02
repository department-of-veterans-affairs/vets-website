import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import * as Sentry from '@sentry/browser';

const DownloadFormPDF = ({ pdfContent, useContent }) => {
  const [pdfBlob, setPdfBlob] = useState(null);

  useEffect(
    () => {
      const fetchData = async () => {
        if (useContent) {
          const pdfData = await fetch(
            `data:application/pdf;base64,${pdfContent}`,
          );
          setPdfBlob(await pdfData.blob());

          return recordEvent({
            event: 'debt-fsr-pdf-content-fetch',
          });
        }
        try {
          const response = await fetch(
            `${environment.API_URL}/v0/financial_status_reports/download_pdf`,
            {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'X-Key-Inflection': 'camel',
                'Source-App-Name': window.appName,
              },
            },
          );

          // only set the blob if the response is successful
          // otherwise just log to sentry & leave blob null
          if (response.ok) {
            setPdfBlob(await response.blob());
          } else {
            Sentry.withScope(scope => {
              scope.setExtra(
                `FSR Download failed fetch status: ${response.status}`,
              );
              Sentry.captureMessage(`debt-fsr-pdf-fetch-response-not-ok`);
            });
          }

          return recordEvent({
            event: 'debt-fsr-pdf-fetch',
          });
        } catch (error) {
          Sentry.withScope(scope => {
            scope.setExtra(`Error: ${error}`);
            Sentry.captureMessage(`debt-fsr-pdf-fetch-fail`);
          });

          return recordEvent({
            event: 'debt-fsr-pdf-fetch-fail',
          });
        }
      };
      fetchData();
    },
    [pdfContent, useContent],
  );

  const handlePdfDownload = () => {
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VA Form 5655 - Submitted.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    recordEvent({
      event: 'download-financial-status-report',
      'financial-status-report-download-type': 'pdf',
    });
  };

  return (
    <>
      {pdfBlob && (
        <button
          onClick={handlePdfDownload}
          type="button"
          className="usa-button button"
        >
          Download completed form
        </button>
      )}
    </>
  );
};

DownloadFormPDF.propTypes = {
  pdfContent: PropTypes.string,
  useContent: PropTypes.bool,
};

export default DownloadFormPDF;
