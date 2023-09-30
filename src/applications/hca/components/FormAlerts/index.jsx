import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { AUTH_EVENTS } from 'platform/user/authentication/constants';
import recordEvent from 'platform/monitoring/record-event';

/** Global */
export const DowntimeWarning = () => (
  <va-alert status="warning" uswds>
    <h2 slot="headline">The health care application is down for maintenance</h2>
    <p>
      We’re sorry. The health care application is currently down while we fix a
      few things. We’ll be back up as soon as we can.
    </p>
    <p>
      <strong>
        If you’re trying to apply by the September 30th special enrollment
        deadline for certain combat Veterans
      </strong>
      , you can also apply in other ways. Call us at{' '}
      <va-telephone contact={CONTACTS['222_VETS']} />. We’re here Friday,
      September 29, 7:00 a.m. to 9:00 p.m.{' '}
      <dfn>
        <abbr title="Central Time">CT</abbr>
      </dfn>
      , and Saturday, September 30, 7:00 a.m. to 11:59 p.m.{' '}
      <dfn>
        <abbr title="Central Time">CT</abbr>
      </dfn>
      . Mail us an application postmarked by September 30, 2023. Or bring your
      application in person to your nearest VA health facility.{' '}
      <a href="/health-care/how-to-apply/">
        Learn more about how to apply by phone, mail, or in person
      </a>
      .
    </p>
  </va-alert>
);

export const PerformanceWarning = () => (
  <va-alert status="warning" class="vads-u-margin-bottom--4" uswds>
    <h3 slot="headline">This application may not be working right now</h3>
    <div>
      <p className="vads-u-margin-top--0">
        You may have trouble using this application at this time. We’re working
        to fix the problem. If you have trouble, you can try again or check back
        later.
      </p>
      <p>
        <strong>
          If you’re trying to apply by the September 30th special enrollment
          deadline for certain combat Veterans
        </strong>
        , you can also apply in other ways. Call us at{' '}
        <va-telephone contact={CONTACTS['222_VETS']} />. We’re here Friday,
        September 29, 7:00 a.m. to 9:00 p.m.{' '}
        <dfn>
          <abbr title="Central Time">CT</abbr>
        </dfn>
        , and Saturday, September 30, 7:00 a.m. to 11:59 p.m.{' '}
        <dfn>
          <abbr title="Central Time">CT</abbr>
        </dfn>
        . Mail us an application postmarked by September 30, 2023. Or bring your
        application in person to your nearest VA health facility.{' '}
        <a href="/health-care/how-to-apply/">
          Learn more about how to apply by phone, mail, or in person
        </a>
        .
      </p>
    </div>
  </va-alert>
);

export const ServerErrorAlert = () => (
  <va-alert status="error" uswds>
    <h2 slot="headline">Something went wrong on our end</h2>
    <p>We’re sorry. Something went wrong on our end. Please try again.</p>
    <p>
      <strong>
        If you’re trying to apply by the September 30th special enrollment
        deadline for certain combat Veterans
      </strong>
      , you can also apply in other ways:
    </p>
    <ul>
      <li>
        Call us at <va-telephone contact={CONTACTS['222_VETS']} />. We’re here
        Friday, September 29, 7:00 a.m. to 9:00 p.m.{' '}
        <dfn>
          <abbr title="Central Time">CT</abbr>
        </dfn>
        , and Saturday, September 30, 7:00 a.m. to 11:59 p.m.{' '}
        <dfn>
          <abbr title="Central Time">CT</abbr>
        </dfn>
        .
      </li>
      <li>Mail us an application postmarked by September 30, 2023.</li>
      <li>
        Or bring your application in person to your nearest VA health facility.
      </li>
    </ul>
    <p>
      <a href="/health-care/how-to-apply/">
        Learn more about how to apply by phone, mail, or in person
      </a>
      .
    </p>
  </va-alert>
);

export const ShortFormAlert = () => (
  <va-alert-expandable
    trigger="You’re filling out a shortened application!"
    status="success"
    class="vads-u-margin-y--5"
    data-testid="hca-short-form-alert"
  >
    Your service-connected disability rating is 50% or higher. This is one of
    our eligibility criteria. This means that we don’t have to ask you questions
    about other criteria like income and military service.
  </va-alert-expandable>
);

/** CHAPTER 1: Veteran Information */
export const IdentityVerificationAlert = () => (
  <va-alert status="continue" data-testid="hca-identity-alert" uswds>
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
        <va-link
          href="/resources/verifying-your-identity-on-vagov/"
          text="Read our identity verification FAQs"
        />
      </li>
      <li>
        Or call us at <va-telephone contact={CONTACTS['222_VETS']} />. If you
        have hearing hearing loss, call{' '}
        <va-telephone contact={CONTACTS['711']} tty />. We’re here Monday
        through Friday, 8:00 a.m. to 8:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        .
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

/** CHAPTER 4: Household Information */
// NOTE: for household v1 only -- remove when v2 is fully-adopted
export const ExpensesWarning = () => (
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

// NOTE: for household v1 only -- remove when v2 is fully-adopted
export const FinancialDisclosureAlert = () => (
  <va-alert status="info" class="vads-u-margin-top--4">
    If you don’t provide your financial information and you don’t have another
    qualifying eligibility factor, VA can’t enroll you.
  </va-alert>
);
