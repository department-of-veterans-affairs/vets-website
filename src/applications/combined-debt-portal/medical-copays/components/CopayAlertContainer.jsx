import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { useHistory } from 'react-router-dom';
import { VaLinkAction } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useSelector } from 'react-redux';
import {
  getCopayAlertContent,
  phoneContent,
} from '../../combined/utils/copayAlertContent';
import { showVHAPaymentHistory } from '../../combined/utils/helpers';

const CopayAlertContainer = ({ type, copay }) => {
  const history = useHistory();
  const shouldShowVHAPaymentHistory = useSelector(state =>
    showVHAPaymentHistory(state),
  );
  const copayAlertContent = getCopayAlertContent(
    copay,
    type,
    shouldShowVHAPaymentHistory,
  );

  return (
    <va-alert
      class="vads-u-margin-bottom--1"
      disable-analytics="false"
      full-width="false"
      status={copayAlertContent.status}
      visible="true"
      data-testid={copayAlertContent.testId}
    >
      <h2 slot="headline">{copayAlertContent.headerText}</h2>
      {copayAlertContent.bodyText}
      {copayAlertContent.showLinks && (
        <VaLinkAction
          data-testid={`resolve-link-${copay.id}`}
          href={`/copay-balances/${copay.id}/resolve`}
          onClick={event => {
            event.preventDefault();
            recordEvent({ event: 'cta-link-click-copay-resolve-link' });
            history.push(`/copay-balances/${copay.id}/resolve`);
          }}
          text="Resolve your bill"
          type="primary"
        />
      )}
      {copayAlertContent.showCallResourceCenter && (
        <>
          <p>
            If you haven’t either paid your full balance or requested financial
            help, call the VA Health Resource Center. We’re here Monday through
            Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
          {phoneContent()}
        </>
      )}
    </va-alert>
  );
};

CopayAlertContainer.propTypes = {
  copay: PropTypes.object,
  type: PropTypes.string,
};

export default CopayAlertContainer;
