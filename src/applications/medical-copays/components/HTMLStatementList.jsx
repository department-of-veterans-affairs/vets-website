import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import { sortStatementsByDate } from '../utils/helpers';

const HTMLStatementLink = ({ id, statementDate }) => {
  const formattedStatementDate = date => {
    return moment(date, 'MM-DD-YYYY').format('MMMM D, YYYY');
  };

  return (
    <Link
      className="vads-u-font-size--sm"
      to={`/balance-details/${id}/statement-view`}
      data-testid="statement"
    >
      <span aria-hidden="true">
        {formattedStatementDate(statementDate)} statement{' '}
      </span>
      <span className="sr-only">
        Download {formattedStatementDate(statementDate)} dated medical copay
        statement
      </span>
    </Link>
  );
};

HTMLStatementLink.propTypes = {
  id: PropTypes.string,
  statementDate: PropTypes.string,
};

const HTMLStatementList = ({ selectedId }) => {
  const statements = useSelector(({ mcp }) => mcp.statements) ?? [];
  // get selected statement
  const [selectedCopay] = statements.filter(({ id }) => id === selectedId);
  // get facility  number on selected statement
  const facilityNumber = selectedCopay.pSFacilityNum;
  // filter out all statements that are not related to this facility
  const facilityCopays = statements.filter(
    ({ pSFacilityNum }) => pSFacilityNum === facilityNumber,
  );

  const sortedFacilityCopays = sortStatementsByDate(facilityCopays);

  return (
    <section data-testid="download-statements">
      <h2 id="download-statements">Your statements</h2>
      <p>
        Review your charges and download your mailed statements from the past 6
        months for this facility.
      </p>

      {sortedFacilityCopays.map(statement => (
        <HTMLStatementLink
          id={statement.id}
          statementDate={statement.pSStatementDate}
          key={statement.id}
        />
      ))}
    </section>
  );
};

HTMLStatementList.propTypes = {
  selectedId: PropTypes.string,
};

export default HTMLStatementList;
