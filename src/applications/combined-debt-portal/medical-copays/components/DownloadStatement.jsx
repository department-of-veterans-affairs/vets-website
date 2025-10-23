import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import { parse } from 'date-fns';
import { formatDate } from '../../combined/utils/helpers';

const handleDownloadClick = date => {
  return recordEvent({
    event: 'debt-mcp-pdf-download',
    'letter-received-date': date,
  });
};

const DownloadStatement = ({ statementId, statementDate, fullName }) => {
  const parsedStatementDate = parse(statementDate, 'MMddyyyy', new Date());
  const formattedStatementDate = formatDate(parsedStatementDate);

  const downloadFileName = `${fullName} Veterans Medical copay statement dated ${formattedStatementDate}.pdf`;
  const downloadText = `Download your ${formattedStatementDate} statement`;
  const pdfStatementUri = encodeURI(
    `${
      environment.API_URL
    }/v0/medical_copays/get_pdf_statement_by_id/${statementId}?file_name=${downloadFileName}`,
  );

  const handler = {
    onClick: () => {
      recordEvent({ event: 'cta-link-click-copay-statement-download' });
      handleDownloadClick(statementDate);
    },
  };
  return (
    <p
      className="vads-u-margin-top--0 vads-u-padding--0"
      data-testid="download-statement-section"
    >
      <va-link
        download
        filetype="PDF"
        filename={downloadFileName}
        href={pdfStatementUri}
        text={downloadText}
        onClick={handler.onClick}
      />
    </p>
  );
};

DownloadStatement.propTypes = {
  fullName: PropTypes.string.isRequired,
  statementDate: PropTypes.string.isRequired,
  statementId: PropTypes.string.isRequired,
};

export default DownloadStatement;
