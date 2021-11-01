import React from 'react';
import { connect } from 'react-redux';

import DownloadStatements from './DownloadStatement';

const PDFStatementList = ({ mcpStatements }) => {
  return (
    <section>
      <h2 id="download-statements">Download your statements</h2>
      <p>
        Download your mailed statements for this facility from the past 6
        months.
      </p>

      {mcpStatements.map(statement => (
        <DownloadStatements
          key={statement.id}
          statementId={statement.id}
          statementDate={statement.pSStatementDate}
        />
      ))}
    </section>
  );
};

PDFStatementList.defaultProps = {
  statements: [],
  errors: [],
};

const mapStateToProps = ({ mcp: { statements } }) => ({
  mcpStatements: statements,
});

export default connect(mapStateToProps)(PDFStatementList);
