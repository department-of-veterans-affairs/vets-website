import React from 'react';

export const MedicalEvidenceAlert = () => (
  <va-alert status="warning" uswds slim>
    <p className="vads-u-margin-y--0">
      You’ll need to provide medical evidence with this application.
    </p>
  </va-alert>
);

// To do: refactor RequestNursingHomeInformationAlert and SpecialMonthlyPensionEvidenceAlert into one reusable component <RequestFormAlert /> with props
export const RequestNursingHomeInformationAlert = () => (
  <va-alert status="warning" uswds slim>
    <p className="vads-u-margin-y--0">
      You’ll need to submit a Request for Nursing Home Information in Connection
      with Claim for Aid and Attendance(VA Form 21-0779). An official from your
      nursing home must complete the form.
    </p>
    <p>
      We’ll ask you to upload this form at the end of this application. Or you
      can send it to us by mail.
    </p>
    <p>
      <a
        href="https://www.vba.va.gov/pubs/forms/vba-21-0779-are.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        Get VA Form 21-0779 to download.
      </a>
    </p>
  </va-alert>
);

export const SpecialMonthlyPensionEvidenceAlert = () => (
  <va-alert status="warning" uswds slim>
    <p className="vads-u-margin-y--0">
      You’ll need to submit an Examination for Household Status or Permanent
      Need for Regular Aid and Attendance (
      <a
        href="https://www.vba.va.gov/pubs/forms/vba-21-2680-are.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        VA Form 21-2680
      </a>
      ).
    </p>
    <p>
      Make sure every box is complete and has a signature from a physician,
      physician assistant, certified nurse practitioner (CNP), or clinical nurse
      specialist (CNS).
    </p>
    <p>
      We’ll ask you to upload this form at the end of this application. Or you
      can send it to us by mail.
    </p>
    <p>
      <a
        href="https://www.vba.va.gov/pubs/forms/vba-21-2680-are.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        Get VA Form 21-2680 to download.
      </a>
    </p>
  </va-alert>
);
