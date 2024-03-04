import React from 'react';

/** CHAPTER 1: Veteran Information */
export const BirthInfoDescription = (
  <>
    <p className="vads-u-margin-top--0">
      Enter your place of birth, including city and state, province or region.
    </p>
    <va-additional-info
      trigger="Why we ask for this information"
      class="vads-u-margin-bottom--3"
    >
      We ask for place of birth as an identity marker for record keeping. This
      will not impact your health care eligibility.
    </va-additional-info>
  </>
);

export const BirthSexDescription = (
  <va-additional-info
    trigger="Why we ask for this information"
    class="vads-u-margin-y--2"
    uswds
  >
    <div>
      <p className="vads-u-margin-top--0">
        Population data shows that a person’s sex can affect things like their
        health risks and the way their body responds to medications. Knowing
        your sex assigned at birth, along with other factors, helps your health
        care team use data to:
      </p>

      <ul>
        <li>Interpret your lab results</li>
        <li>Prescribe the right dose of medications</li>
        <li>Recommend health prevention screenings</li>
      </ul>

      <p className="vads-u-margin-bottom--0">
        We also collect this information to better understand our Veteran
        community. This helps us make sure that we’re serving the needs of all
        Veterans.
      </p>
    </div>
  </va-additional-info>
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

export const DemographicInfoDescription = (
  <legend className="schemaform-label vads-u-margin-bottom--4">
    What is your race, ethnicity, or origin? (Please check all that apply.)
    <div className="vads-u-color--gray-medium vads-u-margin-y--1">
      Information is gathered for statistical purposes only.
    </div>
  </legend>
);

export const HomeAddressDescription = (
  <>
    Home address
    <span className="sr-only">.</span>
    <div className="vads-u-color--base vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal vads-u-line-height--6 vads-u-margin-top--2 vads-u-margin-bottom--4">
      Any updates you make here to your address will apply only to this
      application.
    </div>
  </>
);

export const MailingAddressDescription = (
  <>
    Mailing address
    <span className="sr-only">.</span>
    <div className="vads-u-color--base vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal vads-u-line-height--6 vads-u-margin-top--2 vads-u-margin-bottom--4">
      We’ll send any important information about your application to this
      address. Any updates you make here to your address will apply only to this
      application.
    </div>
  </>
);

export const SIGIGenderDescription = (
  <>
    <va-additional-info
      trigger="What to know before you decide to share your gender identity"
      class="vads-u-margin-top--2"
      uswds
    >
      <div>
        <p className="vads-u-margin-top--0">
          Sharing your gender identity on this application is optional. This
          information can help your health care team know how you wish to be
          addressed as a person. It can also help your team better assess your
          health needs and risks. We also use this information to help make sure
          we’re serving the needs of all Veterans.
        </p>

        <p>
          But you should know that any information you share here goes into your
          VA-wide records. VA staff outside of the health care system may be
          able to read this information.
        </p>

        <p className="vads-u-margin-bottom--0">
          We follow strict security and privacy practices to keep your personal
          information secure. But if you want to share your gender identity in
          your health records only, talk with your health care team.
        </p>
      </div>
    </va-additional-info>
  </>
);

/** CHAPTER 2: VA Benefits */
export const CompensationInfoDescription = (
  <p className="vads-u-margin-bottom-4">
    VA disability compensation (pay) provides monthly payments to Veterans with
    service-connected disabilities. You may get this benefit if you got sick or
    injured, or had a condition that got worse, because of your active-duty
    service. We assign a disability rating based on the severity of your
    disability.
  </p>
);

export const CompensationTypeDescription = (
  <va-additional-info
    trigger="Why we ask for this information"
    class="vads-u-margin-top--2 vads-u-margin-bottom--3"
    uswds
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

export const PensionInfoDescription = (
  <p className="vads-u-margin-bottom-4">
    Our Veterans Pension program provides monthly payments to certain wartime
    Veterans. To get a Veterans Pension, you must meet certain age or disability
    requirements and have income and net worth certain limits.
  </p>
);

export const PensionTypeDescription = (
  <va-additional-info
    trigger="Why we ask for this information"
    class="vads-u-margin-top--2 vads-u-margin-bottom--4"
    uswds
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
  <div className="vads-u-color--gray-medium">
    If you don’t know the exact date, enter your best guess
  </div>
);

export const OtherToxicExposureDescription = (
  <div className="vads-u-margin-top--2 vads-u-margin-bottom--4">
    <a
      target="_blank"
      rel="noreferrer"
      href="https://www.publichealth.va.gov/exposures/index.asp"
    >
      Learn more about exposures on our Public Health website (opens in new tab)
    </a>
  </div>
);

/** CHAPTER 4: Household Information */
export const DeductibleExpensesDescription = () => {
  const date = new Date();
  return (
    <legend className="schemaform-block-title">
      Deductible expenses from {date.getFullYear() - 1}
      <span className="sr-only">.</span>
      <div className="vads-u-color--base vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal vads-u-line-height--6 vads-u-margin-y--2">
        These deductible expenses will lower the amount of money we count as
        your income.
      </div>
    </legend>
  );
};

export const DependentDescription = () => {
  const date = new Date();
  return (
    <va-additional-info
      trigger="Who we consider a dependent"
      class="vads-u-margin-top--2 vads-u-margin-bottom--3"
      uswds
    >
      <div>
        <p className="vads-u-margin-top--0">
          <strong>Here’s who we consider to be a dependent:</strong>
        </p>
        <ul>
          <li>A spouse (we recognize same-sex and common law marriages)</li>
          <li>
            An unmarried child (including adopted children or stepchildren)
          </li>
        </ul>
        <p>
          <strong>
            If your dependent is an unmarried child, one of these descriptions
            must be true:
          </strong>
        </p>
        <ul className="vads-u-margin-bottom--0">
          <li>
            They’re under 18 years old, <strong>or</strong>
          </li>
          <li>
            They’re between the ages of 18 and 23 years old and were enrolled as
            a full-time or part-time student in high school, college, or
            vocational school in {date.getFullYear() - 1}, <strong>or</strong>
          </li>
          <li>
            They’re living with a permanent disability that happened before they
            turned 18 years old
          </li>
        </ul>
      </div>
    </va-additional-info>
  );
};

export const DependentSupportDescription = (
  <va-additional-info
    trigger="What we consider financial support for a dependent"
    class="vads-u-margin-top--2 vads-u-margin-bottom--3"
    uswds
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
    uswds
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
      class="vads-u-margin-y--1"
      uswds
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
    class="vads-u-margin-top--2 vads-u-margin-bottom--4"
    uswds
  >
    <div>
      <p className="vads-u-margin-top--0">
        We want to make sure we understand your household’s financial
        information to better determine what health care benefits you can get.
        If you’re married, we also need to understand your spouse’s financial
        information.
      </p>
    </div>
  </va-additional-info>
);

export const MedicalExpensesDescription = (
  <va-additional-info
    trigger="What we consider non-reimbursable medical expenses"
    class="vads-u-margin-y--1"
    uswds
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
      uswds
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

export const SpouseBasicInformationDescription = (
  <>
    Spouse’s personal information
    <span className="sr-only">.</span>
    <div className="vads-u-color--base vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal vads-u-line-height--6 vads-u-margin-y--2">
      Fill this out to the best of your knowledge. The more accurate your
      responses, the faster we can process your application.
    </div>
  </>
);

export const SpouseAdditionalInformationTitle = (
  <>
    Spouse’s additional information
    <span className="sr-only">.</span>
    <div className="vads-u-color--base vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal vads-u-line-height--6 vads-u-margin-top--2">
      Fill this out to the best of your knowledge. The more accurate your
      responses, the faster we can process your application.
    </div>
  </>
);

export const SpouseAdditionalInformationDescription = () => {
  const date = new Date();
  return (
    <va-additional-info
      trigger="Why we ask for this information"
      class="vads-u-margin-top--1 vads-u-margin-bottom--4"
      uswds
    >
      <div>
        <p className="vads-u-margin-top--0">
          This information helps us determine if your spouse was your dependent
          in {date.getFullYear() - 1}.
        </p>
      </div>
    </va-additional-info>
  );
};

export const SpouseFinancialSupportDescription = (
  <va-additional-info
    trigger="What we consider financial support for a spouse"
    class="vads-u-margin-y--2"
    uswds
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
export const EssentialCoverageDescription = (
  <va-additional-info
    trigger="Learn more about minimum essential coverage."
    class="vads-u-margin-y--2 vads-u-margin-left--4"
    uswds
  >
    To avoid the penalty for not having insurance, you must be enrolled in a
    health plan that qualifies as minimum essential coverage. Being signed up
    for VA health care meets the minimum essential coverage requirement under
    the Affordable Care Act.
  </va-additional-info>
);

export const FacilityLocatorDescription = (
  <>
    <p>
      OR{' '}
      <a href="/find-locations" rel="noopener noreferrer" target="_blank">
        Find locations with the VA Facility Locator
      </a>
    </p>

    <p>
      If you’re looking for medical care outside the continental U.S. or Guam,
      you’ll need to sign up for our Foreign Medical Program.{' '}
      <a
        href="https://www.va.gov/COMMUNITYCARE/programs/veterans/fmp/index.asp"
        rel="noopener noreferrer"
        target="_blank"
      >
        Learn more about the Foreign Medical Program
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
        Veterans Living Abroad
      </a>
      .
    </p>
  </>
);

export const GroupCodeDescription = (
  <div className="vads-u-color--gray-medium">
    Either this or the policy number is required
  </div>
);

export const HealthInsuranceDescription = (
  <p className="vads-u-margin-bottom--3">
    Health insurance includes any coverage that you get through a spouse or
    significant other. Health insurance also includes Medicare, private
    insurance, or insurance from your employer.
  </p>
);

export const HealthInsuranceCoverageDescription = (
  <va-additional-info
    trigger="Why we ask this information"
    class="vads-u-margin-top--2 vads-u-margin-bottom--3"
    uswds
  >
    <div>
      <p className="vads-u-margin-top--0">
        We ask for this information for billing purposes only. Your health
        insurance coverage doesn’t affect the VA health care benefits you can
        get.
      </p>

      <p>
        Giving us your health insurance information helps you for these reasons:
      </p>

      <ul className="vads-u-margin-bottom--0">
        <li>
          We must bill your private health insurance provider for any care,
          supplies, or medicines we provide to treat your non-service-connected
          conditions. If you have a VA copayment, we may be able to use the
          payments from your provider to cover some or all of your copayment.
        </li>
        <li>
          Your private insurance provider may apply your VA health care charges
          toward your annual deductible. Your annual deductible is the amount of
          money you pay toward your care each year before your insurance starts
          to pay for care.
        </li>
      </ul>
    </div>
  </va-additional-info>
);

export const MedicaidDescription = (
  <>
    <p className="vads-u-margin-top--0">
      Medicaid is a federal health insurance program for adults and families
      with low income levels and people with disabilities.
    </p>
    <p className="vads-u-margin-bottom--4">
      <strong>Note:</strong> Some states use different names for their Medicaid
      programs.
    </p>
  </>
);

export const MedicareClaimNumberDescription = (
  <>
    <div className="vads-u-color--gray-medium">
      You’ll find this number on the front of your Medicare card. Enter all 11
      numbers and letters.
    </div>

    <va-additional-info
      trigger="Why we ask for this information"
      class="vads-u-margin-top--3 vads-u-margin-bottom--4"
      uswds
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
  <div className="vads-u-margin-bottom--3 vads-u-color--gray-medium">
    You’ll find this date under “coverage starts” on the front of your Medicare
    card.
  </div>
);

export const MedicarePartADescription = (
  <p className="vads-u-margin-top--0 vads-u-margin-bottom--4">
    Medicare is a federal health insurance program providing coverage for people
    who are 65 years or older or who meet special criteria. Part A insurance
    covers hospital care, skilled nursing and nursing home care, hospice, and
    home health services.
  </p>
);

export const PolicyNumberDescription = (
  <div className="vads-u-color--gray-medium">
    Either this or the group code is required
  </div>
);

export const PolicyOrDescription = (
  <div className="schemaform-block-title schemaform-block-subtitle vads-u-margin-bottom--neg2p5 vads-u-color--primary-darkest">
    or
  </div>
);

export const PolicyOrGroupDescription = (
  <div className="schemaform-block-title schemaform-block-subtitle vads-u-margin-top--6 vads-u-margin-bottom--2 vads-u-color--primary-darkest">
    Provide either your insurance policy number or group code.{' '}
    <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
      (*Required)
    </span>
  </div>
);

export const TricarePolicyDescription = (
  <va-additional-info trigger="I have TRICARE. What’s my policy number?" uswds>
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
