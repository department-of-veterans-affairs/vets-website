import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { sortStatementsByDate } from '../utils/helpers';
import DownloadStatements from './DownloadStatement';

const PDFStatementList = () => {
  const { pathname } = useLocation();
  const selectedId = pathname.replace('/balance-details/', '');
  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const statements = useSelector(({ mcp }) => mcp.statements) ?? [];

  // get selected statement
  const [selectedCopay] = statements?.filter(({ id }) => id === selectedId);
  // get facility  number on selected statement
  const facilityNumber = selectedCopay?.pSFacilityNum;
  // filter out all statements that are not related to this facility
  const facilityCopays = statements?.filter(
    ({ pSFacilityNum }) => pSFacilityNum === facilityNumber,
  );

  const sortedFacilityCopays = sortStatementsByDate(facilityCopays);

  const fullName = userFullName.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;

  return (
    <section data-testid="download-statements">
      <h2 id="statement-list">Your statements</h2>
      <p>
        Download your mailed statements from the past 6 months for this
        facility.
      </p>

      {sortedFacilityCopays.map(statement => (
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
