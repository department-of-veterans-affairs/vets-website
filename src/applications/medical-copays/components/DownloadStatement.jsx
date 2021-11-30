import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

const handleDownloadClick = date => {
  return recordEvent({
    event: 'debt-mcp-pdf-download',
    'letter-received-date': date,
  });
};

const DownloadStatement = ({ statementId, statementDate, fullName }) => {
  const formattedStatementDate = moment(statementDate, 'MM-DD-YYYY').format(
    'MMMM D, YYYY',
  );

  const downloadFileName = `${fullName} Veterans Medical copay statement dated ${formattedStatementDate}.pdf`;

  const pdfStatementUri = encodeURI(
    `${
      environment.API_URL
    }/v0/medical_copays/get_pdf_statement_by_id/${statementId}?file_name=${downloadFileName}`,
  );

  return (
    <article className="vads-u-padding--0">
      <div className="vads-u-margin-top--2">
        <a
          onClick={() => handleDownloadClick(statementDate)}
          target="_blank"
          href={pdfStatementUri}
          type="application/pdf"
          className="vads-u-text-decoration--none"
          rel="noreferrer"
        >
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-download vads-u-padding-right--1"
          />
          <span aria-hidden="true">{formattedStatementDate} statement </span>
          <span className="sr-only">
            Download {formattedStatementDate} dated medical copay statement
          </span>

          <dfn>
            <abbr title="Portable Document Format">(PDF)</abbr>
          </dfn>
        </a>
      </div>
    </article>
  );
};

DownloadStatement.propTypes = {
  statementId: PropTypes.string.isRequired,
  statementDate: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
};

export default DownloadStatement;
