import React from 'react';
import moment from 'moment';

import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

const handleDownloadClick = (type, date) => {
  return recordEvent({
    event: 'debt-mcp-pdf-download',
    'letter-type': type,
    'letter-received-date': date,
  });
};

const DownloadStatements = ({ mcpStatement }) => {
  const downloadLink = encodeURI(
    `${environment.API_URL}/v0/medical_copays/get_pdf_statements_by_id/${
      mcpStatement.id
    }`,
  );

  const statementDate = moment(
    mcpStatement.pSStatementDate,
    'MM-DD-YYYY',
  ).format('MMMM D, YYYY');

  const downloadDate = `${mcpStatement.typeDescription} dated ${moment(
    mcpStatement.receivedAt,
    'YYYY-MM-DD',
  ).format('MMM D, YYYY')}`;

  return (
    <article className="vads-u-padding--0">
      <div className="vads-u-margin-top--2">
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            handleDownloadClick(mcpStatement.typeDescription, statementDate)
          }
          download={downloadDate}
          href={downloadLink}
        >
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-download vads-u-padding-right--1"
          />
          <span aria-hidden="true">{statementDate} statement </span>
          <span className="sr-only">
            Download {mcpStatement.typeDescription} dated
            <span className="vads-u-margin-left--0p5">{statementDate}</span>
          </span>

          <dfn>
            <abbr title="Portable Document Format">(PDF)</abbr>
          </dfn>
        </a>
      </div>
    </article>
  );
};

export default DownloadStatements;
