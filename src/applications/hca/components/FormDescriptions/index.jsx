import React from 'react';
import { APP_URLS } from '../../utils/appUrls';
import { LAST_YEAR } from '../../utils/helpers';

/** CHAPTER 1: Veteran Information */
export const BirthInfoDescription = (
  <>
    <va-additional-info
      trigger="Why we ask for this information"
      class="vads-u-margin-bottom--4"
    >
      We ask for place of birth as an identity marker for record keeping. This
      will not impact your health care eligibility.
    </va-additional-info>
  </>
);

export const ContactInfoDescription = (
  <>
    <p>
      Adding your email and phone number is optional. But this information helps
      us contact you faster if we need to follow up with you about your
      application. If you don’t add this information, we’ll use your address to
      contact you by mail.
    </p>
    <p className="vads-u-margin-bottom--4">
      <strong>Note:</strong> We’ll always mail you a copy of our decision on
      your application for your records.
    </p>
  </>
);

export const DemographicInfoTitle = (
  <span className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--source-sans-normalized vads-u-line-height--4 vads-u-display--block">
    What is your race, ethnicity, or origin? (Please check all that apply.)
    <span className="vads-u-color--gray-medium vads-u-display--block">
      Information is gathered for statistical purposes only.
    </span>
  </span>
);

/** CHAPTER 2: VA Benefits */
export const DisabilityRatingDescription = (
  <va-additional-info
    trigger="Why we ask for this information"
    class="vads-u-margin-top--2 vads-u-margin-bottom--4 hydrated"
  >
    <div>
      <p className="vads-u-margin-top--0">
        We use this information to help us decide these 4 things:
      </p>

      <ul>
        <li>
          If you can fill out a shorter application, <strong>and</strong>
        </li>
        <li>
          What types of VA health care benefits you’re eligible for,{' '}
          <strong>and</strong>
        </li>
        <li>
          How soon we enroll you in VA health care, <strong>and</strong>
        </li>
        <li>
          How much (if anything) you’ll have to pay toward the cost of your care
        </li>
      </ul>

      <p className="vads-u-margin-bottom--0">
        We give veterans with service-connected disabilities the highest
        priority.
      </p>
    </div>
  </va-additional-info>
);

export const PensionDescription = (
  <va-additional-info
    trigger="Why we ask for this information"
    class="vads-u-margin-top--2 vads-u-margin-bottom--4 hydrated"
  >
    <div>
      <p className="vads-u-margin-top--0">
        We use this information to help us decide these 3 things:
      </p>

      <ul>
        <li>
          What types of VA health care benefits you’re eligible for,{' '}
          <strong>and</strong>
        </li>
        <li>
          How soon we enroll you in a VA health care, <strong>and</strong>
        </li>
        <li>
          How much (if anything) you’ll have to pay toward the cost of your care
        </li>
      </ul>

      <p>
        If you have a Veterans Pension, you may pay a lower copay, or no copay,
        for certain types of care and services.
      </p>
    </div>
  </va-additional-info>
);

/** CHAPTER 3: Military Service */
export const ServiceDateRangeDescription = (
  <span className="vads-u-display--block vads-u-margin-bottom--2 vads-u-color--gray-medium">
    If you don’t know the exact date, enter your best guess
  </span>
);

/** CHAPTER 4: Household Information */
export const DependentEducationExpensesDescription = (
  <div className="vads-u-color--gray-medium">
    Only enter an amount if they had gross income to report to the IRS in{' '}
    {LAST_YEAR}. This income is the minimum amount of gross income the IRS
    requires to file a federal income tax return.
  </div>
);

export const DependentSupportDescription = (
  <va-additional-info
    trigger="What we consider financial support for a dependent"
    class="vads-u-margin-top--2 vads-u-margin-bottom--3"
  >
    <div>
      <p className="vads-u-margin-top--0">
        We consider any payments, even if they aren’t regular or the same
        amount, to be financial support.
      </p>
      <p className="vads-u-font-weight--bold">
        Financial Support includes payments for these types of expenses:
      </p>
      <ul className="vads-u-margin-bottom--0">
        <li>Tuition or medical bills</li>
        <li>Monthly child support</li>
        <li>One-time payment financial support</li>
      </ul>
    </div>
  </va-additional-info>
);

export const EducationalExpensesDescription = (
  <va-additional-info
    trigger="What we consider college or vocational expenses"
    class="vads-u-margin-y--1"
  >
    <div>
      <p className="vads-u-margin-top--0">
        College and vocational expenses include payments for these expenses
        related to your own education:
      </p>
      <ul>
        <li>Tuition</li>
        <li>Books</li>
        <li>Fees</li>
        <li>Course materials</li>
      </ul>
      <p className="vads-u-margin-bottom--0">
        Only include expenses for your own education (not your dependents’
        education).
      </p>
    </div>
  </va-additional-info>
);

export const GrossIncomeDescription = (
  <>
    <div className="vads-u-margin-y--1">
      Gross income is income before taxes and any other deductions are
      subtracted.
    </div>

    <va-additional-info
      trigger="What we consider gross annual income"
      class="vads-u-margin-top--1 vads-u-margin-bottom--4"
    >
      <div>
        <p className="vads-u-font-weight--bold vads-u-margin-top--0">
          Gross income includes these types of income from a job:
        </p>
        <ul className="vads-u-margin-bottom--0">
          <li>Wages</li>
          <li>Bonuses</li>
          <li>Tips</li>
          <li>Severance pay</li>
        </ul>
      </div>
    </va-additional-info>
  </>
);

export const IncomeDescription = (
  <>
    <p>
      Please fill this section out to the best of your knowledge. Provide the
      previous calendar year’s gross annual income for you, your spouse, and
      your dependents.
    </p>
    <p>
      <strong>Gross annual income:</strong> This income is from employment only,
      and doesn’t include income from your farm, ranch, property, or business.
      When you calculate your gross annual income, include your wages, bonuses,
      tips, severance pay, and other accrued benefits. Include your dependent’s
      income information if it could have been used to pay your household
      expenses.
    </p>
    <p>
      <strong>Net income:</strong> This is the income from your farm, ranch,
      property, or business.
    </p>
    <p className="vads-u-margin-bottom--4">
      <strong>Other income:</strong> This includes retirement and pension
      income; Social Security Retirement and Social Security Disability income;
      compensation benefits such as VA disability, unemployment, Workers, and
      black lung; cash gifts; interest and dividends, including tax exempt
      earnings and distributions from Individual Retirement Accounts (IRAs) or
      annuities.
    </p>
  </>
);

export const MaritalStatusDescription = (
  <va-additional-info
    trigger="Why we ask for this information"
    class="vads-u-margin-bottom--4"
  >
    <p>
      We want to make sure we understand your household’s financial information
      to better determine what health care benefits you can get. If you’re
      married, we also need to understand your spouse’s financial information.
    </p>
  </va-additional-info>
);

export const MedicalExpensesDescription = (
  <va-additional-info
    trigger="What we consider non-reimbursable medical expenses"
    class="vads-u-margin-top--1 vads-u-margin-bottom--4"
  >
    <div>
      <p className="vads-u-margin-top--0">
        Non-reimbursable medical expenses include costs you or your spouse paid
        for these types of health care for yourselves, your dependents, or
        others you have the moral obligation to support:
      </p>
      <ul>
        <li>Doctor or dentist appointments</li>
        <li>Medications</li>
        <li>Medicare or health insurance</li>
        <li>Inpatient hospital care</li>
        <li>Nursing home care</li>
      </ul>
      <p className="vads-u-margin-bottom--0">
        We only consider expenses non-reimbursable if your health insurance
        doesn’t pay you back for the cost.
      </p>
    </div>
  </va-additional-info>
);

export const OtherIncomeDescription = (
  <>
    <div className="vads-u-margin-y--1">
      Other income is additional income that doesn’t come from a job.
    </div>

    <va-additional-info
      trigger="What we consider other annual income"
      class="vads-u-margin-y--1"
    >
      <div>
        <p className="vads-u-font-weight--bold vads-u-margin-top--0">
          Other income includes things like this:
        </p>
        <ul className="vads-u-margin-bottom--0">
          <li>Retirement benefits</li>
          <li>Unemployment</li>
          <li>VA benefit compensation</li>
          <li>Money from the sale of a house</li>
          <li>Interest from investments</li>
        </ul>
      </div>
    </va-additional-info>
  </>
);

export const SpouseAdditionalInformationDescription = () => (
  <va-additional-info
    trigger="Why we ask for this information"
    class="vads-u-margin-top--1 vads-u-margin-bottom--4"
  >
    <p>
      This information helps us determine if your spouse was your dependent in{' '}
      {LAST_YEAR}.
    </p>
  </va-additional-info>
);

export const SpouseFinancialSupportDescription = (
  <va-additional-info
    trigger="What we consider financial support for a spouse"
    class="vads-u-margin-bottom--4"
  >
    <div>
      <p className="vads-u-margin-top--0">
        We consider any payments, even if they aren’t regular or the same
        amount, to be financial support.
      </p>
      <p>
        <strong>
          Financial support includes payments for these types of payments:
        </strong>
      </p>
      <ul className="vads-u-margin-bottom--0">
        <li>Monthly spousal support</li>
        <li>One-time payment financial support</li>
      </ul>
    </div>
  </va-additional-info>
);

/** CHAPTER 5: Insurance Information */
export const FacilityLocatorDescription = (
  <>
    <p>
      <a href={APP_URLS.facilities} rel="noopener noreferrer" target="_blank">
        Find locations with the VA Facility Locator (opens in new tab)
      </a>
    </p>
    <p>
      If you’re looking for medical care outside the continental U.S. or Guam,
      you’ll need to sign up for our Foreign Medical Program.{' '}
      <a
        href="/health-care/foreign-medical-program/"
        rel="noopener noreferrer"
        target="_blank"
      >
        Learn more about the Foreign Medical Program (opens in new tab)
      </a>
      .
    </p>
    <p>
      You can also visit{' '}
      <a
        href="https://www.benefits.va.gov/PERSONA/veteran-abroad.asp"
        rel="noopener noreferrer"
        target="_blank"
      >
        Veterans Living Abroad (opens in new tab)
      </a>
      .
    </p>
  </>
);

export const MedicaidDescription = (
  <>
    <span className="vads-u-display--block vads-u-margin-y--2">
      Medicaid is a federal health insurance program for adults and families
      with low income levels and people with disabilities.
    </span>
    <span className="vads-u-display--block vads-u-margin-y--2">
      <strong>Note:</strong> Some states use different names for their Medicaid
      programs.
    </span>
  </>
);

export const MedicareClaimNumberDescription = (
  <>
    <div className="vads-u-margin-top--2 vads-u-color--gray-medium">
      You’ll find this number on the front of your Medicare card. Enter all 11
      numbers and letters.
    </div>

    <va-additional-info
      trigger="Why we ask for this information"
      class="vads-u-margin-top--2 vads-u-margin-bottom--4"
    >
      <div>
        <p className="vads-u-margin-top--0">
          We use your Medicare claim number to keep track of the health care
          services that Medicare covers. We use your claim number when we need
          to create a Medicare explanation of benefits.
        </p>
        <p>
          We don’t bill Medicare for any services. By law, Medicare can’t pay
          for our services. But this explanation shows what Medicare would have
          paid for services if they could.
        </p>
        <p>
          We may need to bill medicare supplemental insurance or a private
          insurance provider for certain services. And some providers must have
          this explanation before they’ll pay the bill.
        </p>
        <p className="vads-u-margin-bottom--0">
          <strong>Note:</strong> Having Medicare or other health insurance
          doesn’t affect the VA health care benefits you can get. And you won’t
          have to pay any unpaid balance that a health insurance provider
          doesn’t cover.
        </p>
      </div>
    </va-additional-info>
  </>
);

export const MedicareEffectiveDateDescription = (
  <div className="vads-u-margin-top--2 vads-u-margin-bottom--4 vads-u-color--gray-medium">
    You’ll find this date under “coverage starts” on the front of your Medicare
    card.
  </div>
);

export const PolicyOrGroupTitle = (
  <>
    Insurance policy number or group code.&nbsp;
    <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
      (*Required)
    </span>
  </>
);

export const TricarePolicyDescription = (
  <va-additional-info
    trigger="I have TRICARE. What’s my policy number?"
    class="vads-u-margin-y--2"
  >
    <div>
      <p className="vads-u-margin-top--0">
        You can use your Department of Defense benefits number (DBN) or your
        Social Security number as your policy number.
      </p>
      <p className="vads-u-margin-bottom--0">
        Your DBN is an 11-digit number. You’ll find this number on the back of
        your military ID card.
      </p>
    </div>
  </va-additional-info>
);
