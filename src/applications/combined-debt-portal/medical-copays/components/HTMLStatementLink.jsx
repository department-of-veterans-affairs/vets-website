import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { VaLinkAction } from '@department-of-veterans-affairs/web-components/react-bindings';
import { formatDate } from '../../combined/utils/helpers';

const HTMLStatementLink = ({ id, statementDate }) => {
  const history = useHistory();

  return (
    <li>
      <VaLinkAction
        data-testid={`balance-details-${id}-statement-view`}
        href={`/copay-balances/${id}/detail/statement`}
        onClick={event => {
          event.preventDefault();
          recordEvent({ event: 'cta-link-click-copay-statement-link' });
          history.push(`/copay-balances/${id}/detail/statement`);
        }}
        text={`${formatDate(statementDate)} statement`}
        type="primary"
      />
    </li>
  );
};

HTMLStatementLink.propTypes = {
  id: PropTypes.string,
  statementDate: PropTypes.string,
};

export default HTMLStatementLink;
