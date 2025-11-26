import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { useHistory } from 'react-router-dom';
import { VaLinkAction } from '@department-of-veterans-affairs/web-components/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { getCopayAlertContent } from '../../combined/utils/copayAlertContent';

const CopayAlertContainer = ({ type, copay }) => {
  const history = useHistory();

  const copayAlertContent = getCopayAlertContent(copay, type);

  return (
    <va-alert
      class="vads-u-margin-bottom--1"
      disable-analytics="false"
      full-width="false"
      status={copayAlertContent.status}
      visible="true"
    >
      <h2 slot="headline">{copayAlertContent.headerText}</h2>
      {copayAlertContent.bodyText}
      {copayAlertContent.showLinks && (
        <VaLinkAction
          data-testid={`resolve-link-${copay.id}`}
          href={`/copay-balances/${copay.id}/resolve`}
          onClick={event => {
            event.preventDefault();
            recordEvent({ event: 'cta-link-click-copay-past-due-alert' });
            history.push(`/copay-balances/${copay.id}/resolve`);
          }}
          text="Pay your balance, request financial help, or dispute this bill"
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
          <p>
            <span className="no-wrap">
              <va-icon icon="phone" size={3} />{' '}
              <strong>
                <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} /> (TTY:{' '}
                <va-telephone contact={CONTACTS[711]} />)
              </strong>
            </span>
          </p>
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
