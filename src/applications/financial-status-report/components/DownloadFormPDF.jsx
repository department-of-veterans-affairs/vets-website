import React, { useCallback } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

const DownloadFormPDF = () => {
  const handleDownloadClick = useCallback(() => {
    return recordEvent({
      event: 'debt-fsr-pdf-download',
    });
  }, []);

  const pdfStatementUri = encodeURI(
    `${environment.API_URL}/v0/financial_status_reports/download_pdf`,
  );

  return (
    <a
      onClick={handleDownloadClick()}
      href={pdfStatementUri}
      type="application/pdf"
      aria-label="Download completed FSR form"
      className="usa-button button"
      rel="noreferrer"
    >
      <span>Download completed form</span>
    </a>
  );
};

export default DownloadFormPDF;
