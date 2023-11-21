import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

/** Global */
export const DowntimeWarning = () => (
  <va-alert status="warning">
    <h2 slot="headline">The health care application is down for maintenance</h2>
    <p>
      We’re sorry. The health care application is currently down while we fix a
      few things. We’ll be back up as soon as we can.
    </p>
    <p>
      In the meantime, you can call{' '}
      <va-telephone contact={CONTACTS['222_VETS']} />, Monday through Friday,
      8:00 a.m. to 8:00 p.m.{' '}
      <dfn>
        <abbr title="Eastern Time">ET</abbr>
      </dfn>{' '}
      and press 2 to complete this application over the phone.
    </p>
  </va-alert>
);

export const ServerErrorAlert = () => (
  <va-alert status="error">
    <h2 slot="headline">Something went wrong on our end</h2>
    <p>We’re sorry. Something went wrong on our end. Please try again.</p>
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

export const DependentSIPWarning = () => (
  <va-alert
    status="warning"
    data-testid="hca-sip-warning"
    class="vads-u-margin-bottom--2"
    background-only
  >
    <p className="vads-u-margin-y--0">
      Be sure to enter all the required information for your dependent. We can
      only save your progress when you enter the required information.
    </p>
  </va-alert>
);
