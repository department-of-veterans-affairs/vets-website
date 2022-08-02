import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { AUTH_EVENTS } from 'platform/user/authentication/constants';
import recordEvent from 'platform/monitoring/record-event';

export const FinancialDisclosureAlert = () => (
  <va-alert status="info" class="vads-u-margin-top--4">
    If you don’t provide your financial information and you don’t have another
    qualifying eligibility factor, VA can’t enroll you.
  </va-alert>
);

export const ExpensesGreaterThanIncomeWarning = () => (
  <va-alert status="warning" class="vads-u-margin-top--4">
    <h2 slot="headline">
      Your expenses are higher than or equal to your income.
    </h2>
    <p className="vads-u-margin-bottom--0">
      You can stop entering your expenses. We’ll adjust your expenses to be
      equal to your income. This won’t affect your application or benefits.
    </p>
  </va-alert>
);

export const ServerErrorAlert = () => (
  <va-alert status="error">
    <h2 slot="headline">Something went wrong on our end</h2>
    <p>We’re sorry. Something went wrong on our end. Please try again</p>
  </va-alert>
);

export const ShortFormAlert = () => (
  <va-alert-expandable
    trigger="You’re filling out a shortened application!"
    status="success"
    class="vads-u-margin-y--5"
  >
    Your service-connected disability rating is 50% or higher. This is one of
    our eligibility criteria. This means that we don’t have to ask you questions
    about other criteria like income and military service.
  </va-alert-expandable>
);

export const VerificationRequiredAlert = () => (
  <va-alert status="continue">
    <h4 slot="headline">
      Please verify your identity before applying for VA health care
    </h4>
    <p>This process should take about 5 to 10 minutes.</p>
    <p>
      <strong>If you’re applying for the first time</strong>
    </p>
    <p>
      We need to verify your identity so we can help you track the status of
      your application once you’ve submitted it. As soon as you’re finished
      verifying your identity, you can continue to the application.
    </p>
    <p>
      <strong>If you’ve applied before</strong>
    </p>
    <p>
      We need to verify your identity so we can show you the status of your past
      application. We take your privacy seriously, and we need to make sure
      we’re sharing your personal information only with you.
    </p>
    <p>
      <strong>
        If you need more information or help with verifying your identity:
      </strong>
    </p>
    <ul>
      <li>
        <a href="/resources/verifying-your-identity-on-vagov/">
          Read our identity verification FAQs
        </a>
      </li>
      <li>
        Or call us at <va-telephone contact={CONTACTS['222_VETS']} />. If you
        have hearing hearing loss, call{' '}
        <va-telephone contact={CONTACTS['711']} tty />. We’re here Monday
        through Friday, 8:00 a.m. to 8:00 p.m.{' '}
        <abbr title="eastern time">ET</abbr>.
      </li>
    </ul>
    <p>
      <a
        href="/verify"
        className="usa-button"
        onClick={() => {
          recordEvent({ event: AUTH_EVENTS.VERIFY });
        }}
      >
        Verify your identity
      </a>
    </p>
  </va-alert>
);
