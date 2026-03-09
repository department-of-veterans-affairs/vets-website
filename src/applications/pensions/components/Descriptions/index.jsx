import React from 'react';
import PropTypes from 'prop-types';
import { threshold } from '../../helpers';

const RequestFormDescription = ({
  intro,
  title,
  formName,
  formLink,
  children,
}) => (
  <>
    <p>
      {intro}, you’ll need to submit an {title} ({formName}
      ).
    </p>
    <p>{children}</p>
    <p>
      We’ll give you instructions for submitting this form at the end of this
      application.
    </p>
    <p>
      <va-link href={formLink} external text={`Get ${formName} to download`} />
    </p>
  </>
);

RequestFormDescription.propTypes = {
  formLink: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export const RequestIncomeAndAssetInformation = () => (
  <RequestFormDescription
    title="Income and Asset Statement in Support of Claim for Pension or Parents' Dependency and Indemnity Compensation"
    formName="VA Form 21P-0969"
    formLink="https://www.va.gov/find-forms/about-form-21p-0969/"
  />
);

export const RequestNursingHomeInformationDescription = () => (
  <RequestFormDescription
    intro="Because you applied for Medicaid"
    title="Nursing Home Information in Connection with Claim
    for Aid and Attendance"
    formName="VA Form 21-0779"
    formLink="https://www.va.gov/find-forms/about-form-21-0779/"
  >
    An official from your nursing home must complete the form.
  </RequestFormDescription>
);

export const SchoolAttendanceDescription = () => (
  <RequestFormDescription
    intro="Because your child is at least 18 years old, but under 23, and attending school"
    title="Request for Approval of School Attendance"
    formName="VA Form 21-674"
    formLink="https://www.va.gov/find-forms/about-form-21-674/"
  />
);

export const SpecialMonthlyPensionEvidenceDescription = () => (
  <RequestFormDescription
    intro="Because you’re claiming special monthly pension"
    title="Examination for Housebound Status or Permanent
    Need for Regular Aid and Attendance"
    formName="VA Form 21-2680"
    formLink="https://www.va.gov/find-forms/about-form-21-2680/"
  >
    Make sure every box is complete and has a signature from a physician,
    physician assistant, certified nurse practitioner (CNP), or clinical nurse
    specialist (CNS).
  </RequestFormDescription>
);

export const NetWorthEstimationFormNeededDescription = () => (
  <RequestFormDescription
    intro={`Because you and your dependents have over $${threshold.toLocaleString()} in assets`}
    title="Income and Asset Statement in Support of
          Claim for Pension or Parents' Dependency and Indemnity Compensation
    Need for Regular Aid and Attendance"
    formName="VA Form 21P-0969"
    formLink="https://www.va.gov/find-forms/about-form-21p-0969/"
  />
);

export const LandMarketableFormNeededDescription = () => (
  <RequestFormDescription
    intro="Because the additional land is marketable"
    title="Income and Asset Statement in Support of
          Claim for Pension or Parents' Dependency and Indemnity Compensation
    Need for Regular Aid and Attendance"
    formName="VA Form 21P-0969"
    formLink="https://www.va.gov/find-forms/about-form-21p-0969/"
  />
);

export const IncomeAssetStatementFormNeededDescription = () => (
  <RequestFormDescription
    intro="Because you, your spouse, or your dependents transferred assets"
    title="Income and Asset Statement in Support of Claim for Pension or Parents' Dependency and Indemnity Compensation"
    formName="VA Form 21P-0969"
    formLink="https://www.va.gov/find-forms/about-form-21p-0969/"
  />
);
