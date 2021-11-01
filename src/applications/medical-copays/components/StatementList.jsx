import React from 'react';
import { connect } from 'react-redux';

import DownloadStatements from './DownloadStatements';

const StatementList = ({ mcpStatements }) => {
  return (
    <section>
      <h2 id="download-statements">Download your statements</h2>
      <p>
        Download your mailed statements for this facility from the past 6
        months.
      </p>

      {mcpStatements.map(statement => (
        <DownloadStatements key={statement.id} mcpStatement={statement} />
      ))}
    </section>
  );
};

StatementList.defaultProps = {
  statements: [],
  errors: [],
};

const mapStateToProps = ({ mcp: { statements, pending, error } }) => ({
  mcpStatements: statements,
  error,
  isLoading: pending,
});

export default connect(mapStateToProps)(StatementList);
