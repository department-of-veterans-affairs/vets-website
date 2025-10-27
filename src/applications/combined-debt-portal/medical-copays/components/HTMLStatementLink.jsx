import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { formatDate } from '../../combined/utils/helpers';

const HTMLStatementLink = ({ id, statementDate }) => {
  const history = useHistory();

  return (
    <li>
      <VaLink
        data-testid={`balance-details-${id}-statement-view`}
        onClick={event => {
          event.preventDefault();
          recordEvent({ event: 'cta-link-click-copay-statement-link' });
          history.push(`/copay-balances/${id}/statement`);
        }}
        href={`/copay-balances/${id}/statement`}
        text={`${formatDate(statementDate)} statement`}
      />
    </li>
  );
};

HTMLStatementLink.propTypes = {
  id: PropTypes.string,
  statementDate: PropTypes.string,
};

export default HTMLStatementLink;
