import React, { useEffect, useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import * as Sentry from '@sentry/browser';

const DownloadFormPDF = () => {
  const [pdfBlob, setPdfBlob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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
            Sentry.captureMessage(`debt-fsr-pdf-download-fail`);
          });
        }

        return recordEvent({
          event: 'debt-fsr-pdf-download',
        });
      } catch (error) {
        Sentry.withScope(scope => {
          scope.setExtra(`Error: ${error}`);
          Sentry.captureMessage(`debt-fsr-pdf-download-fail`);
        });

        return recordEvent({
          event: 'debt-fsr-pdf-download-fail',
        });
      }
    };
    fetchData();
  }, []);

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

export default DownloadFormPDF;
