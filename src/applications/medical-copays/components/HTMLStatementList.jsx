import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import moment from 'moment';
import { sortStatementsByDate } from '../utils/helpers';

const HTMLStatementList = () => {
  const { pathname } = useLocation();
  const selectedId = pathname.replace('/balance-details/', '');
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
  const formattedStatementDate = date => {
    return moment(date, 'MM-DD-YYYY').format('MMMM D, YYYY');
  };

  return (
    <section data-testid="download-statements">
      <h2 id="download-statements">Your statements</h2>
      <p>
        Review your charges and download your mailed statements from the past 6
        months for this facility.
      </p>

      {sortedFacilityCopays.map(statement => (
        <>
          <Link
            className="vads-u-font-size--sm"
            to={`/balance-details/${statement.id}/statement-view`}
            data-testid="statement"
            key={statement.id}
          >
            <span aria-hidden="true">
              {formattedStatementDate(statement.pSStatementDate)} statement{' '}
            </span>
            <span className="sr-only">
              Download {formattedStatementDate(statement.pSStatementDate)} dated
              medical copay statement
            </span>
          </Link>
        </>
      ))}
    </section>
  );
};

export default HTMLStatementList;
