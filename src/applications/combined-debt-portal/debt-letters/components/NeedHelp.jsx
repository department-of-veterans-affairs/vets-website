import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import PropTypes from 'prop-types';
import HowDoIDispute from './HowDoIDispute';

const NeedHelp = ({ showVHAPaymentHistory = false, showOneThingPerPage }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const disputeDebtActive = useToggleValue(TOGGLE_NAMES.disputeDebt);

  return (
    <>
      <article className="vads-u-padding-x--0 vads-u-padding-bottom--0">
        <h2
          id="howDoIGetHelp"
          className="vads-u-margin-top--4 vads-u-margin-bottom--0"
        >
          How to get financial help
        </h2>

        <p className="vads-u-margin-top--2">
          If you need financial help, you can request:
        </p>

        <ul>
          <li>
            An extended monthly payment plan, <strong>or</strong>
          </li>
          <li>
            A compromise (ask us to accept a lower amount of money as full
            payment of the debt), <strong>or</strong>
          </li>
          <li>A waiver (ask us to stop collection on the debt)</li>
        </ul>
        {showVHAPaymentHistory || showOneThingPerPage ? (
          <p>
            <strong>Note:</strong> The time limit to request a waiver (debt
            forgiveness) is 1 year from the date you received your first debt
            letter.
          </p>
        ) : (
          <p>
            <strong>Note:</strong> The time limit to request a waiver (debt
            forgiveness) has changed. You now have <strong>1 year</strong> from
            the date you received your first debt letter to request a waiver.
          </p>
        )}

        <va-link-action
          href="/manage-va-debt/request-debt-help-form-5655/"
          message-aria-describedby="Opens pay.va.gov"
          text="Request help with your debt"
          class="vads-u-margin-top--2"
        />

        {disputeDebtActive && (
          <section>
            <HowDoIDispute />
          </section>
        )}
      </article>

      <va-need-help id="needHelp">
        <div slot="content">
          <p>
            If you have any questions about your benefit overpayment. Contact us
            online through <a href="https://ask.va.gov/">Ask VA</a> or call the
            Debt Management Center at <va-telephone contact={CONTACTS.DMC} /> (
            <va-telephone contact="711" tty="true" />
            ). For international callers, use{' '}
            <va-telephone contact={CONTACTS.DMC_OVERSEAS} international />.
            We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
        </div>
      </va-need-help>
    </>
  );
};

NeedHelp.propTypes = {
  showOneThingPerPage: PropTypes.bool,
  showVHAPaymentHistory: PropTypes.bool,
};

export default NeedHelp;
