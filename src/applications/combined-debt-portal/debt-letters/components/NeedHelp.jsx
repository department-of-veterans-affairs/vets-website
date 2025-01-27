import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const NeedHelp = () => (
  <>
    <article className="vads-u-padding-x--0">
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
          A compromise (ask us to accept a lower amount of money as full payment
          of the debt), <strong>or</strong>
        </li>
        <li>A waiver (ask us to stop collection on the debt)</li>
      </ul>
      <p>
        <strong>Note:</strong> The time limit to request a waiver (debt
        forgiveness) has changed. You now have <strong>1 year</strong> from the
        date you received your first debt letter to request a waiver.
      </p>
      <a
        className="vads-c-action-link--blue"
        href="/manage-va-debt/request-debt-help-form-5655/"
      >
        Request help with your debt
      </a>

      <section>
        <h2
          id="howDoIDispute"
          className="vads-u-margin-top--4 vads-u-margin-bottom--0"
        >
          How to dispute a debt
        </h2>
        <p className="vads-u-margin-top--2">
          If you think a debt was created in error, you can dispute it. Get
          information about disputing a debt by contacting us online through{' '}
          <a href="https://ask.va.gov/">Ask VA</a> or calling the Debt
          Management Center at <va-telephone contact={CONTACTS.DMC} /> (
          <va-telephone contact="711" tty="true" />
          ). For international callers, use{' '}
          <va-telephone contact={CONTACTS.DMC_OVERSEAS} international />. We’re
          here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
        </p>
      </section>
    </article>

    <va-need-help id="needHelp">
      <div slot="content">
        <p>
          If you have any questions about your benefit overpayment. Contact us
          online through <a href="https://ask.va.gov/">Ask VA</a> or call the
          Debt Management Center at <va-telephone contact={CONTACTS.DMC} /> (
          <va-telephone contact="711" tty="true" />
          ). For international callers, use{' '}
          <va-telephone contact={CONTACTS.DMC_OVERSEAS} international />. We’re
          here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
        </p>
      </div>
    </va-need-help>
  </>
);

export default NeedHelp;
