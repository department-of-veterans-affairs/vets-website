import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';

const HTMLStatementLink = ({ id, statementDate }) => {
  const formattedStatementDate = date => {
    return moment(date, 'MM-DD-YYYY').format('MMMM D, YYYY');
  };

  return (
    <div className="vads-u-margin-top--3 vads-u-margin-bottom--3">
      <Link
        to={`/copay-balances/${id}/detail/statement`}
        data-testid={`balance-details-${id}-statement-view`}
        onClick={() => {
          recordEvent({ event: 'cta-link-click-copay-statement-link' });
        }}
      >
        <span>{formattedStatementDate(statementDate)} statement </span>
      </Link>
    </div>
  );
};

HTMLStatementLink.propTypes = {
  id: PropTypes.string,
  statementDate: PropTypes.string,
};

export default HTMLStatementLink;
