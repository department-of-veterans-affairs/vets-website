import React from 'react';
import PropTypes from 'prop-types';

export const AssetInformationAlert = () => (
  <va-additional-info trigger="How we define assets" uswds>
    <p>
      Assets are all the money and property you or your dependents own. Don’t
      include the value of your primary residence or personal belongings such as
      appliances and vehicles you or your dependents need for transportation.
    </p>
  </va-additional-info>
);

export const AssetTransferInformationAlert = () => (
  <va-additional-info trigger="How to tell if you transferred assets" uswds>
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
  <va-alert uswds>
    <p className="vads-u-margin-y--0">
      We usually don’t need to contact a former spouse of a Veteran’s spouse. In
      very rare cases where we need information from this person, we’ll contact
      you first.
    </p>
  </va-alert>
);

export const ContactWarningMultiAlert = () => (
  <va-alert uswds>
    <p className="vads-u-margin-y--0">
      We won’t contact any of the people listed here without contacting you
      first.
    </p>
  </va-alert>
);

export const DisabilityDocsAlert = () => (
  <va-alert status="warning" uswds>
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
  <va-alert-expandable status="info" trigger="What is income?">
    <p>
      Your income is how much you earn. It includes your Social Security
      benefits, investment and retirement payments, and any income your spouse
      and dependents receive.
    </p>
  </va-alert-expandable>
);

export const LandMarketableAlert = () => (
  <va-alert status="info" uswds>
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
  <va-alert status="warning" uswds>
    <p className="vads-u-margin-y--0">
      You’ll need to provide medical evidence with this application.
    </p>
  </va-alert>
);

const RequestFormAlert = ({ title, formName, formLink, children }) => {
  const linkText = `Get ${formName} to download (opens in new tab)`;
  return (
    <va-alert status="warning" uswds>
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
  children: PropTypes.node.isRequired,
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
    <va-alert status="warning" uswds>
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
  <va-alert status="warning" uswds>
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
