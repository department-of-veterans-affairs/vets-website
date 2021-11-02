import React from 'react';
import { useSelector } from 'react-redux';

import DownloadStatements from './DownloadStatement';

const PDFStatementList = () => {
  const statements = useSelector(({ mcp }) => mcp.statements);
  const userFullName = useSelector(({ user }) => user.profile.userFullName);

  const fullName = userFullName.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;

  return (
    <section>
      <h2 id="download-statements">Download your statements</h2>
      <p>
        Download your mailed statements for this facility from the past 6
        months.
      </p>

      {statements.map(statement => (
        <DownloadStatements
          key={statement.id}
          statementId={statement.id}
          statementDate={statement.pSStatementDate}
          fullName={fullName}
        />
      ))}
    </section>
  );
};

export default PDFStatementList;
