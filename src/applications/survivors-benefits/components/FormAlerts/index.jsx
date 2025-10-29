import React from 'react';
import PropTypes from 'prop-types';

const RequestFormAlert = ({
  title,
  formName,
  formLink,
  advisory,
  children,
}) => (
  <va-alert-expandable
    status="warning"
    trigger={`You’ll need to submit a ${formName}`}
  >
    <p className="vads-u-margin-y--0">
      You’ll need to submit an {title} ({formName}
      ). {advisory}
    </p>
    <p>{children}</p>
    <p>
      We’ll ask you to upload this form at the end of this application. Or you
      can send it to us by mail.
    </p>
    <p>
      <va-link href={formLink} external text={`Get ${formName} to download`} />
    </p>
  </va-alert-expandable>
);

RequestFormAlert.propTypes = {
  formLink: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  advisory: PropTypes.string,
  children: PropTypes.node,
};

export const RequestNursingHomeInformationAlert = () => (
  <RequestFormAlert
    title="Nursing Home Information in Connection with Claim
    for Aid and Attendance"
    formName="VA Form 21-0779"
    formLink="https://www.va.gov/find-forms/about-form-21-0779/"
  />
);

export const SpecialMonthlyPensionEvidenceAlert = () => (
  <RequestFormAlert
    title="Examination of Housebound Status or Permanent
    Need for Regular Aid and Attendance"
    formName="VA Form 21-2680"
    formLink="https://www.va.gov/find-forms/about-form-21-2680/"
    advisory="A licensed medical professional must complete this form."
  />
);

export const CourtOrderSeparationAlert = () => (
  <va-alert-expandable
    status="warning"
    trigger="You'll need to submit a copy of the court order."
    disable-border="true"
  >
    We’ll ask you to upload this document at the end of this application. Or you
    can send it to us by mail.
  </va-alert-expandable>
);
