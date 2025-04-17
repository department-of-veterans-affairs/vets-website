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

  const pdfStatementUri = encodeURI(
    `${environment.API_URL}/v0/medical_copays/get_pdf_statement_by_id/${statementId}?file_name=${downloadFileName}`,
  );

  return (
    <article className="vads-u-padding--0">
      <div className="vads-u-margin-top--2">
        <a
          className="vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--flex-start"
          onClick={() => {
            recordEvent({ event: 'cta-link-click-copay-statement-download' });
            handleDownloadClick(statementDate);
          }}
          download={downloadFileName}
          href={pdfStatementUri}
          type="application/pdf"
          rel="noreferrer"
        >
          <va-icon
            icon="file_download"
            size={3}
            className="vads-u-margin-top--0p5 vads-u-padding-right--1"
          />

          <span aria-hidden="true">
            Download your {formattedStatementDate} statement{' '}
          </span>
          <span className="sr-only">
            Download {formattedStatementDate} dated medical copay statement{' '}
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
  fullName: PropTypes.string.isRequired,
  statementDate: PropTypes.string.isRequired,
  statementId: PropTypes.string.isRequired,
};

export default DownloadStatement;
