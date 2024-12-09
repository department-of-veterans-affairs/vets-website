import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { formatDate } from '../../combined/utils/helpers';

const HTMLStatementLink = ({ id, statementDate }) => {
  return (
    <li>
      <Link
        to={`/copay-balances/${id}/detail/statement`}
        data-testid={`balance-details-${id}-statement-view`}
        onClick={() => {
          recordEvent({ event: 'cta-link-click-copay-statement-link' });
        }}
      >
        {formatDate(statementDate)} statement
      </Link>
    </li>
  );
};

HTMLStatementLink.propTypes = {
  id: PropTypes.string,
  statementDate: PropTypes.string,
};

export default HTMLStatementLink;
