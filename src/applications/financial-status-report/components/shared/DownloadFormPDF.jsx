import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import * as Sentry from '@sentry/browser';

const DownloadFormPDF = ({ pdfContent }) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const buttonText = 'Download completed form';

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          const pdfData = await fetch(
            `data:application/pdf;base64,${pdfContent}`,
          );
          setPdfBlob(await pdfData.blob());

          return recordEvent({
            event: 'debt-fsr-pdf-content-fetch',
          });
        } catch (error) {
          Sentry.withScope(scope => {
            scope.setExtra(`Error: ${error}`);
            Sentry.captureMessage(`debt-fsr-pdf-content-fetch-fail`);
          });

          return recordEvent({
            event: 'debt-fsr-pdf-content-fetch-fail',
          });
        }
      };
      fetchData();
    },
    [pdfContent],
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
      {pdfBlob && <va-button text={buttonText} onClick={handlePdfDownload} />}
    </>
  );
};

DownloadFormPDF.propTypes = {
  pdfContent: PropTypes.string,
  useContent: PropTypes.bool,
};

export default DownloadFormPDF;
