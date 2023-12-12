import React from 'react';
import PropTypes from 'prop-types';

export const MedicalEvidenceAlert = () => (
  <va-alert status="warning" uswds slim>
    <p className="vads-u-margin-y--0">
      You’ll need to provide medical evidence with this application.
    </p>
  </va-alert>
);

export const AssetInformationAlert = () => (
  <va-alert-expandable status="info" trigger="What are assets?">
    <p>Assets are all the money and property you or your dependents own.</p>
    <br />
    <p>
      Don’t include the value of your primary residence or personal belongings
      such as appliances and vehicles you or your dependents need for
      transportation.
    </p>
  </va-alert-expandable>
);

export const AssetTransferInformationAlert = () => (
  <va-alert-expandable status="info" trigger="What are assets?">
    <p>Assets are all the money and property you or your dependents own.</p>
    <br />
    <p>
      Don’t include the value of your primary residence or personal belongings
      such as appliances and vehicles you or your dependents need for
      transportation.
    </p>
    <br />
    <p>You transferred assets if you made any of these transactions:</p>
    <br />
    <ul>
      <li>You gave away money or property</li>
      <li>You sold a home that isn’t your primary residence</li>
      <li>You purchased an annuity</li>
      <li>You put money or property into a trust</li>
    </ul>
  </va-alert-expandable>
);

const RequestFormAlert = ({ title, formName, formLink, children }) => (
  <va-alert status="warning" uswds slim>
    <p className="vads-u-margin-y--0">
      You’ll need to submit an {title} (
      <a href={formLink} rel="noopener noreferrer" target="_blank">
        {formName}
      </a>
      ).
    </p>
    <p>{children}</p>
    <p>
      We’ll ask you to upload this form at the end of this application. Or you
      can send it to us by mail.
    </p>
    <p>
      <a href={formLink} rel="noopener noreferrer" target="_blank">
        Get {formName} to download
      </a>
    </p>
  </va-alert>
);

RequestFormAlert.propTypes = {
  children: PropTypes.node.isRequired,
  formLink: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export const RequestIncomeAndAssetInformationAlert = () => (
  <RequestFormAlert
    title="Income and Asset Statement in Support of Claim for Pension or Parents"
    formName="VA Form 21P-0969"
    formLink="https://www.vba.va.gov/pubs/forms/VBA-21P-0969-ARE.pdf"
  />
);

export const RequestNursingHomeInformationAlert = () => (
  <RequestFormAlert
    title="Nursing Home Information in Connection with Claim
    for Aid and Attendance"
    formName="VA Form 21-0779"
    formLink="https://www.vba.va.gov/pubs/forms/vba-21-0779-are.pdf"
  >
    An official from your nursing home must complete the form.
  </RequestFormAlert>
);

export const SpecialMonthlyPensionEvidenceAlert = () => (
  <RequestFormAlert
    title="Examination for Household Status or Permanent
    Need for Regular Aid and Attendance"
    formName="VA Form 21-2680"
    formLink="https://www.vba.va.gov/pubs/forms/vba-21-2680-are.pdf"
  >
    Make sure every box is complete and has a signature from a physician,
    physician assistant, certified nurse practitioner (CNP), or clinical nurse
    specialist (CNS).
  </RequestFormAlert>
);

export const AssetTransferFormAlert = () => (
  <va-alert status="warning" uswds slim>
    <p className="vads-u-margin-y--0">
      You’ll need to submit an Income and Asset Statement in Support of Claim
      for Pension or Parents' Dependency and Indemnity Compensation (
      <a
        href="https://www.vba.va.gov/pubs/forms/VBA-21P-0969-ARE.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        VA Form 21P-0969
      </a>
      ).
    </p>
    <p>
      We’ll ask you to upload this form at the end of this application. Or you
      can mail it to us.
    </p>
    <p>
      <a
        href="https://www.vba.va.gov/pubs/forms/VBA-21P-0969-ARE.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        Get VA Form 21P-0969 to download.
      </a>
    </p>
  </va-alert>
);
