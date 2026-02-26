import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { formatDate } from '../../combined/utils/helpers';

const HTMLStatementLink = ({ statementId, statementDate }) => {
  const history = useHistory();
  const statementPath = `/copay-balances/statements/${statementId}`;

  return (
    <li>
      <VaLink
        data-testid={`balance-details-${statementId}-statement-view`}
        onClick={event => {
          event.preventDefault();
          recordEvent({ event: 'cta-link-click-copay-statement-link' });
          history.push(statementPath);
        }}
        href={statementPath}
        text={`${formatDate(statementDate)} statement`}
      />
    </li>
  );
};

HTMLStatementLink.propTypes = {
  statementId: PropTypes.string.isRequired,
  statementDate: PropTypes.string,
};

export default HTMLStatementLink;
