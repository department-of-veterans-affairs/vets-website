import React from 'react';

export const AmericanIndianDescription = (
  <>
    <ul className="vads-u-margin-top--3">
      <li>
        You’re a member—or the first- or second-degree descendant of a member—of
        a tribe, band, or other organized group of Indians, including those
        terminated since 1940 and those recognized now or in the future by the
        state you live in (note: this applies whether or not you live on or near
        a reservation), <strong>or</strong>
      </li>
      <li>
        You’re an Eskimo or Aleut or other Alaska Native, <strong>or</strong>
      </li>
      <li>
        You’re considered by the Secretary of the Interior to be an Indian for
        any purpose, <strong>or</strong>
      </li>
      <li>
        You’re determined to be an Indian under regulations put into effect by
        the Secretary of the Interior, <strong>or</strong>
      </li>
      <li>
        You meet any of these descriptions and you live in an urban center (a
        community that the Secretary of the Interior has determined has a large
        enough urban Indian population with unmet health needs to warrant
        assistance under title V of the Indian Health Care Improvement Act, or
        IHCIA)
      </li>
    </ul>

    <div className="vads-u-margin-bottom--3">
      <a
        href="https://www.ihs.gov/ihcia/"
        rel="noopener noreferrer"
        target="_blank"
      >
        Learn more about the IHCIA on the Indian Health Service website
      </a>
    </div>
  </>
);

export const BirthInfoDescription = (
  <>
    <p className="vads-u-margin-bottom--4">
      Enter your place of birth, including city and state, province or region.
    </p>
    <va-additional-info
      trigger="Why we ask for this information"
      class="vads-u-margin-bottom--4"
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
  >
    <p className="vads-u-margin-top--0">
      Population data shows that a person’s sex can affect things like their
      health risks and the way their body responds to medications. Knowing your
      sex assigned at birth, along with other factors, helps your health care
      team use data to:
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
  >
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
      We give veterans with service-connected disabilities the highest priority.
    </p>
  </va-additional-info>
);

export const DeductibleExpensesDescription = (
  <>
    <p>
      Tell us a bit about your expenses this past calendar year. Enter
      information for any expenses that apply to you.
    </p>

    <va-additional-info
      trigger="What if my expenses are higher than my annual income?"
      class="vads-u-margin-y--2"
    >
      We understand in some cases your expenses might be higher than your
      income. If your expenses exceed your income, we’ll adjust them to be equal
      to your income. This won’t affect your application or benefits.
    </va-additional-info>
  </>
);

export const DemographicInfoDescription = (
  <legend className="schemaform-label vads-u-margin-bottom--4">
    What is your race, ethnicity, or origin? (Please check all that apply.)
    <div className="vads-u-color--gray-medium">
      Information is gathered for statistical purposes only.
    </div>
  </legend>
);

export const EssentialCoverageDescription = (
  <va-additional-info
    trigger="Learn more about minimum essential coverage."
    class="vads-u-margin-y--2 vads-u-margin-left--4"
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

export const FinancialDisclosureDescription = (
  <>
    <p>
      Next, we’ll ask you to provide your financial information from the most
      recent tax year, which we’ll verify with the IRS. We use this information
      to figure out if you:
    </p>

    <ol>
      <li>
        Are eligible for health care even if you don’t have one of the
        qualifying factors
      </li>
      <li>
        Are eligible for added benefits, like reimbusement for travel costs or
        cost-free medications
      </li>
      <li>Should be charged for copays or medication</li>
    </ol>

    <va-alert class="vads-u-margin-top--2p5" status="info">
      <strong>Note:</strong> You don’t have to provide your financial
      information. But if you don’t have a qualifying eligibility factor, this
      information is the only other way for us to see if you can get VA health
      care benefits--including added benefits like waived copays.
    </va-alert>

    <p>Qualifying factors:</p>
    <ul>
      <li>Former Prisoner of War</li>
      <li>Received a Purple Heart</li>
      <li>Recently discharged combat Veteran</li>
      <li>
        Discharged for a disability that resulted from your service or got worse
        in the line of duty
      </li>
      <li>Getting VA service-connected disability compensation</li>
      <li>Getting a VA pension</li>
      <li>Receiving Medicaid benefits</li>
      <li>Served in Vietnam between January 9, 1962, and May 7, 1975</li>
      <li>
        Served in Southwest Asia during the Gulf War between August 2, 1990, and
        November 11, 1998
      </li>
      <li>
        Served at least 30 days at Camp Lejeune between August 1, 1953, and
        December 31, 1987
      </li>
    </ul>

    <p className="vads-u-margin-bottom--4">
      <a
        href="https://www.va.gov/healthbenefits/apps/explorer/AnnualIncomeLimits/HealthBenefits"
        rel="noopener noreferrer"
        target="_blank"
      >
        Learn more
      </a>{' '}
      about our income thresholds (also called income limits) and copayments.
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
  >
    <p className="vads-u-margin-top--0">
      We ask for this information for billing purposes only. Your health
      insurance coverage doesn’t affect the VA health care benefits you can get.
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
        money you pay toward your care each year before your insurance starts to
        pay for care.
      </li>
    </ul>
  </va-additional-info>
);

export const HomeAddressDescription = (
  <p className="vads-u-line-height--6 vads-u-margin-bottom--4">
    Any updates you make here to your address will apply only to this
    application.
  </p>
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

export const MailingAddressDescription = (
  <p className="vads-u-line-height--6 vads-u-margin-bottom--4">
    We’ll send any important information about your application to this address.
    Any updates you make here to your address will apply only to this
    application.
  </p>
);

export const MaritalStatusDescription = (
  <va-additional-info
    trigger="Why we ask for this information"
    class="vads-u-margin-top--3 vads-u-margin-bottom--4"
  >
    <p className="vads-u-margin-top--0">
      We want to make sure we understand your household’s financial situation.
    </p>

    <p className="vads-u-margin-bottom--0">
      We’ll ask about your income. If you’re married, we also need to understand
      your spouse’s financial situation. This allows us to make a more informed
      decision about your application.
    </p>
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
    >
      <p className="vads-u-margin-top--0">
        We use your Medicare claim number to keep track of the health care
        services that Medicare covers. We use your claim number when we need to
        create a Medicare explanation of benefits.
      </p>
      <p>
        We don’t bill Medicare for any services. By law, Medicare can’t pay for
        our services. But this explanation shows what Medicare would have paid
        for services if they could.
      </p>
      <p>
        We may need to bill medicare supplimental insurance or a private
        insurance provider for certain services. And some providers must have
        this explanation before they’ll pay the bill.
      </p>
      <p className="vads-u-margin-bottom--0">
        <strong>Note:</strong> Having Medicare or other health insurance doesn’t
        affect the VA health care benefits you can get. And you won’t have to
        pay any unpaid balance that a health insurance provider doesn’t cover.
      </p>
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
    who are 65 years or older or who meet who meet special criteria. Part A
    insurance covers hospital care, skilled nursing and nursing home care,
    hospice, and home health services.
  </p>
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
  >
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
  </va-additional-info>
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

export const SIGIGenderDescription = (
  <>
    <legend className="schemaform-label">
      What is your gender?
      <div className="vads-u-color--gray-medium">
        Choose the option that best fits how you describe yourself.
      </div>
    </legend>

    <va-additional-info
      trigger="What to know before you decide to share your gender identity"
      class="vads-u-margin-y--4"
    >
      <p className="vads-u-margin-top--0">
        Sharing your gender identity on this application is optional. This
        information can help your health care team know how you wish to be
        addressed as a person. It can also help your team better assess your
        health needs and risks. We also use this information to help make sure
        we’re serving the needs of all Veterans.
      </p>

      <p>
        But you should know that any information you share here goes into your
        VA-wide records. VA staff outside of the health care system may be able
        to read this information.
      </p>

      <p className="vads-u-margin-bottom--0">
        We follow strict security and privacy practices to keep your personal
        information secure. But if you want to share your gender identity in
        your health records only, talk with your health care team.
      </p>
    </va-additional-info>
  </>
);

export const TricarePolicyDescription = (
  <va-additional-info trigger="I have TRICARE. What’s my policy number?">
    <p className="vads-u-margin-top--0">
      You can use your Department of Defense benefits number (DBN) or your
      Social Security number as your policy number.
    </p>
    <p className="vads-u-margin-bottom--0">
      Your DBN is an 11-digit number. You’ll find this number on the back of
      your military ID card.
    </p>
  </va-additional-info>
);
