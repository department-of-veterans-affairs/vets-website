import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';

const HTMLStatementLink = ({ id, statementDate }) => {
  const formattedStatementDate = date => {
    return moment(date, 'MM-DD-YYYY').format('MMMM D, YYYY');
  };

  return (
    <div className="vads-u-margin-top--3 vads-u-margin-bottom--3">
      <Link
        to={`/balance-details/${id}/statement-view`}
        data-testid={`balance-details-${id}-statement-view`}
      >
        <span aria-hidden="true">
          {formattedStatementDate(statementDate)} statement{' '}
        </span>
        <span className="sr-only">
          Download {formattedStatementDate(statementDate)} dated medical copay
          statement
        </span>
      </Link>
    </div>
  );
};

HTMLStatementLink.propTypes = {
  id: PropTypes.string,
  statementDate: PropTypes.string,
};

export default HTMLStatementLink;
