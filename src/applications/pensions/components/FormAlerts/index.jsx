import React from 'react';
import PropTypes from 'prop-types';

export const AssetInformationAlert = () => (
  <va-additional-info trigger="How we define assets">
    <p>
      Assets are all the money and property you or your dependents own. Don’t
      include the value of your primary residence or personal belongings such as
      appliances and vehicles you or your dependents need for transportation.
    </p>
  </va-additional-info>
);

export const AssetsInformation = () => (
  <va-accordion>
    <va-accordion-item header="What we consider an asset">
      <p>
        Assets include the fair market value of all the real and personal
        property that you own, minus the amount of any mortgages you have. "Real
        property" is the land and buildings you own. And "personal property" is
        items like these:
      </p>
      <ul>
        <li>Investments, like stocks and bonds</li>
        <li>Antique furniture</li>
        <li>Boats</li>
      </ul>
      <h5>We don’t include items like these in your assets:</h5>
      <ul>
        <li>
          Your primary residence (the home where you live most or all of your
          time)
        </li>
        <li>Your car</li>
        <li>
          Basic home items, like appliances that you wouldn’t take with you if
          you moved to a new house
        </li>
      </ul>
    </va-accordion-item>
    <va-accordion-item header="Who we consider a dependent">
      <h5>A dependent is:</h5>
      <ul>
        <li>
          A spouse (<strong>Note:</strong> We recognize same-sex and common-law
          marriages)
        </li>
        <li>
          A parent, if you’re directly caring for them and their income and net
          worth are below a certain amount
        </li>
        <li>
          An unmarried child (including an adopted child or stepchild) who meets
          one of the eligibility requirements listed here
        </li>
      </ul>
      <h5>
        To be considered a dependent, one of these must be true of an unmarried
        child:
      </h5>
      <ul>
        <li>
          They’re under 18 years old, <strong>or</strong>
        </li>
        <li>
          They’re between the ages of 18 and 23 years old and enrolled in school
          full time, <strong>or</strong>
        </li>
        <li>They became permanently disabled before they turned 18</li>
      </ul>
    </va-accordion-item>
  </va-accordion>
);

export const AssetTransferInformationAlert = () => (
  <va-additional-info trigger="How to tell if you transferred assets">
    <p>You transferred assets if you made any of these transactions:</p>
    <ul>
      <li>You gave away money or property</li>
      <li>You sold a home that isn’t your primary residence</li>
      <li>You purchased an annuity</li>
      <li>You put money or property into a trust</li>
    </ul>
  </va-additional-info>
);

export const ContactWarningAlert = () => (
  <va-alert>
    <p className="vads-u-margin-y--0">
      We usually don’t need to contact a former spouse of a Veteran’s spouse. In
      very rare cases where we need information from this person, we’ll contact
      you first.
    </p>
  </va-alert>
);

export const ContactWarningMultiAlert = () => (
  <va-alert>
    <p className="vads-u-margin-y--0">
      We won’t contact any of the people listed here without contacting you
      first.
    </p>
  </va-alert>
);

export const DisabilityDocsAlert = () => (
  <va-alert status="warning">
    <p className="vads-u-margin-y--0">
      You’ll need to provide all private medical records for your child’s
      disability.
    </p>
  </va-alert>
);

export const IncomeAssetStatementFormAlert = () => (
  <RequestFormAlert
    title="Income and Asset Statement in Support of Claim for Pension or Parents' Dependency and Indemnity Compensation"
    formName="VA Form 21P-0969"
    formLink="https://www.va.gov/find-forms/about-form-21p-0969/"
  />
);

export const IncomeInformationAlert = () => (
  <va-additional-info trigger="What is income?">
    <p>
      Your income is how much you earn. It includes your Social Security
      benefits, investment and retirement payments, and any income your spouse
      and dependents receive.
    </p>
  </va-additional-info>
);

export const LandMarketableAlert = () => (
  <va-alert status="info">
    <p className="vads-u-margin-y--0">
      The additional land might not be marketable in these situations:
    </p>
    <ul>
      <li>The entire lot of land is only slightly more than 2 acres, or</li>
      <li>The additional land isn’t accessible, or</li>
      <li>
        There are zoning rules that prevent selling the additional property
      </li>
    </ul>
  </va-alert>
);

export const MedicalEvidenceAlert = () => (
  <va-alert status="warning">
    <p className="vads-u-margin-y--0">
      You’ll need to provide medical evidence with this application.
    </p>
  </va-alert>
);

const RequestFormAlert = ({ title, formName, formLink, children }) => {
  const linkText = `Get ${formName} to download (opens in new tab)`;
  return (
    <va-alert status="warning">
      <p className="vads-u-margin-y--0">
        You’ll need to submit an {title} ({formName}
        ).
      </p>
      <p>{children}</p>
      <p>
        We’ll ask you to upload this form at the end of this application. Or you
        can send it to us by mail.
      </p>
      <p>
        <a
          href={formLink}
          rel="noopener noreferrer"
          target="_blank"
          aria-label={linkText}
        >
          {linkText}
        </a>
      </p>
    </va-alert>
  );
};

RequestFormAlert.propTypes = {
  children: PropTypes.node,
  formLink: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export const RequestIncomeAndAssetInformationAlert = () => (
  <RequestFormAlert
    title="Income and Asset Statement in Support of Claim for Pension or Parents' Dependency and Indemnity Compensation"
    formName="VA Form 21P-0969"
    formLink="https://www.va.gov/find-forms/about-form-21p-0969/"
  />
);

export const RequestNursingHomeInformationAlert = () => (
  <RequestFormAlert
    title="Nursing Home Information in Connection with Claim
    for Aid and Attendance"
    formName="VA Form 21-0779"
    formLink="https://www.va.gov/find-forms/about-form-21-0779/"
  >
    An official from your nursing home must complete the form.
  </RequestFormAlert>
);

export const SchoolAttendanceAlert = () => (
  <RequestFormAlert
    title="Request for Approval of School Attendance"
    formName="VA Form 21-674"
    formLink="https://www.va.gov/find-forms/about-form-21-674/"
  />
);

export const SpecialMonthlyPensionEvidenceAlert = () => (
  <RequestFormAlert
    title="Examination for Household Status or Permanent
    Need for Regular Aid and Attendance"
    formName="VA Form 21-2680"
    formLink="https://www.va.gov/find-forms/about-form-21-2680/"
  >
    Make sure every box is complete and has a signature from a physician,
    physician assistant, certified nurse practitioner (CNP), or clinical nurse
    specialist (CNS).
  </RequestFormAlert>
);

export const TotalNetWorthOverTwentyFiveThousandAlert = () => {
  const linkText = 'Get VA Form 21P-0969 to download (opens in new tab)';
  return (
    <va-alert status="warning">
      <p className="vads-u-margin-y--0">
        You answered that you have more than $25,000 in assets. You’ll need to
        submit an Income and Asset Statement in Support of Claim for Pension or
        Parents' Dependency and Indemnity Compensation (
        <a
          href="https://www.va.gov/find-forms/about-form-21-2680/"
          rel="noopener noreferrer"
          target="_blank"
        >
          VA Form 21P-0969
        </a>
        ).
      </p>
      <p>
        We’ll ask you to upload this form at the end of this application. Or you
        can send it to us by mail.
      </p>
      <p>
        <a
          href="https://www.va.gov/find-forms/about-form-21p-0969/"
          rel="noopener noreferrer"
          target="_blank"
          aria-label={linkText}
        >
          {linkText}
        </a>
      </p>
    </va-alert>
  );
};

export const WartimeWarningAlert = () => (
  <va-alert status="warning">
    <p className="vads-u-margin-y--0">
      <strong>Note:</strong> You have indicated that you did not serve during an{' '}
      <a
        href="http://www.benefits.va.gov/pension/wartimeperiod.asp"
        rel="noopener noreferrer"
        target="_blank"
      >
        {' '}
        eligible wartime period
      </a>
      . Find out if you still qualify.{' '}
      <a href="/pension/eligibility/" target="_blank">
        Check your eligibility
      </a>
    </p>
  </va-alert>
);

export const FormReactivationAlert = () => (
  <p>
    You should know that we updated our online form.{' '}
    <strong>If you started applying online before November 8, 2023</strong>, we
    have some new questions for you to answer. And we changed some questions, so
    you may need to provide certain information again.
    <br />
    <br />
    Select <strong>Continue your application</strong> to use our updated form.
    Or come back later to finish your application.
  </p>
);

export const AccountInformationAlert = () => (
  <div className="vads-u-margin-top--4">
    <va-alert>
      <h4 slot="headline" className="vads-u-font-size--h4">
        We’ll use this bank account for all your VA benefit payments
      </h4>
      <p className="vads-u-margin-y--0">
        If we approve your application for pension benefits, we’ll update your
        direct deposit information for all your VA benefit payments. We’ll
        deposit any payments you may receive for pension or education benefits
        directly into the bank account you provide here.
      </p>
      <p>
        We’re making this change to help protect you from fraud and to make sure
        we can pay you on time, every time, without error.
      </p>
    </va-alert>
  </div>
);

export const AdoptionEvidenceAlert = () => (
  <va-alert status="warning">
    <p className="vads-u-margin-y--0">
      You’ll need to submit adoption papers or amended birth certificate with
      this application.
    </p>
  </va-alert>
);

export const SubmissionConfirmationAlert = () => (
  <va-alert status="success">
    <h3>Thank you for submitting your Veterans Pension application.</h3>
    <p className="vads-u-margin-y--0">
      We’ve received your Veterans Pension application (VA Form 21P-527EZ).
      After we complete our review, we’ll mail you a decision letter with the
      details of our decision.
    </p>
  </va-alert>
);
