import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import * as Sentry from '@sentry/browser';

const DownloadFormPDF = () => {
  const handlePDFDownload = async () => {
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
    };
    try {
      const pdf = await fetch(
        encodeURI(
          `${environment.API_URL}/v0/financial_status_reports/download_pdf`,
        ),
        options,
      );

      if (!pdf.ok) {
        Sentry.withScope(scope => {
          scope.setExtra(`FSR Download failed fetch status: ${pdf.status}`);
          Sentry.captureMessage(`debt-fsr-pdf-download-fail`);
        });
        return recordEvent({
          event: 'debt-fsr-pdf-download',
        });
      }

      const pdfBlob = await pdf.blob();
      const pdfURL = URL.createObjectURL(pdfBlob);

      const anchor = document.createElement('a');
      anchor.href = pdfURL;
      anchor.download = 'VA Form 5655 - Submitted';

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      URL.revokeObjectURL(pdfURL);
    } catch (error) {
      Sentry.withScope(scope => {
        scope.setExtra(`Error: ${error}`);
        Sentry.captureMessage(`debt-fsr-pdf-download-fail`);
      });
    }

    return recordEvent({
      event: 'debt-fsr-pdf-download',
    });
  };

  return (
    <>
      <button
        onClick={handlePDFDownload}
        type="button"
        className="usa-button button"
      >
        Download completed form
      </button>
    </>
  );
};

export default DownloadFormPDF;
