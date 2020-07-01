import React, { useEffect, useState } from 'react';
import SignatureCheckbox from './components/SignatureBox';

const PreSubmitCheckboxGroup = ({ onSectionComplete, formData, showError }) => {
  const veteranLabel = `Enter Veteran's or service member\u2019s full name`;
  const primaryLabel = 'Enter Primary Family Caregiver\u2019s full name';
  const secondaryOneLabel = 'Enter Secondary Family Caregiver\u2019s full name';
  const secondaryTwoLabel =
    'Enter Secondary Family Caregiver\u2019s (2) full name';
  const [signatures, setSignature] = useState({
    [veteranLabel]: false,
    [primaryLabel]: false,
  });

  const [secondaryCaregivers, setSecondaryCaregivers] = useState({
    [secondaryOneLabel]: false,
    [secondaryTwoLabel]: false,
  });
  const unSignedLength = Object.values(signatures).filter(
    obj => Boolean(obj) === false,
  ).length;

  useEffect(
    () => {
      if (!unSignedLength) {
        onSectionComplete(true);
      }

      if (unSignedLength) {
        onSectionComplete(false);
      }

      const hasSecondaryOne =
        formData?.secondaryOneFullName?.first &&
        formData?.secondaryOneFullName?.last;

      const hasSecondaryTwo =
        formData?.secondaryTwoFullName?.first &&
        formData?.secondaryTwoFullName?.last;

      setSecondaryCaregivers({
        hasSecondaryOne,
        hasSecondaryTwo,
      });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      formData.secondaryOneFullName.first,
      formData.secondaryOneFullName.last,
      formData.secondaryTwoFullName.first,
      formData.secondaryTwoFullName.last,
      unSignedLength,
    ],
  );

  const PrivacyPolicy = () => (
    <p>
      I have read and accept the
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="vads-u-margin-left--0p5"
        href="https://www.va.gov/privacy-policy/"
      >
        privacy policy
      </a>
      .
    </p>
  );

  const SecondaryCaregiverCopy = ({ label }) => {
    const header = title => `${title} or Family Member Statement of Truth`;
    return (
      <div>
        <h3 className="vads-u-margin-top--4">{header(label)}</h3>

        <p className="vads-u-margin-y--4">
          I certify that I am at least 18 years of age.
        </p>

        <p>
          I certify that I am a family member of the Veteran or service member
          named in this application or I reside with the Veteran or service
          member or will do so upon approval.
        </p>

        <p>
          {`I agree to perform personal care services as the ${label} for the Veteran or service member named on this application.`}
        </p>

        <p>
          {`I understand that the Veteran or Veteran’s surrogate may initiate my
            revocation as a ${label} at any time and that the VA
            may immediately revoke this designation if I fail to comply with the
            program requirements for continued participation in the program.`}
        </p>

        <PrivacyPolicy />
      </div>
    );
  };

  /*
    - Vet first && last name must match, and be checked
    - PrimaryCaregiver first && last name must match, and be checked
    - if hasSecondary one || two, first & last name must match, and be checked to submit
   */

  return (
    <section className="signature-container">
      <p className="vads-u-margin-bottom--5">
        Please review information entered into this application. The Veteran or
        service member and each family caregiver applicant must sign the
        appropriate section.
      </p>

      <SignatureCheckbox
        fullName={formData.veteranFullName}
        label={veteranLabel}
        signatures={signatures}
        setSignature={setSignature}
        isRequired
        showError={showError}
      >
        <h3>Veteran or service member statement of truth</h3>
        <p>
          I certify that I give consent to the individual(s) named in this
          application to perform personal care services for me upon being
          approved as Primary and/or Secondary Caregiver(s) in the Program of
          Comprehensive Assistance for Family Caregivers.
        </p>

        <PrivacyPolicy />
      </SignatureCheckbox>

      <SignatureCheckbox
        fullName={formData.primaryFullName}
        label={primaryLabel}
        signatures={signatures}
        setSignature={setSignature}
        isRequired
        showError={showError}
      >
        <h3 className="vads-u-margin-top--4">
          Primary Family Caregiver statement of truth
        </h3>

        <p className="vads-u-margin-y--4">
          I certify that I am at least 18 years of age.
        </p>

        <p>
          I certify that I am a family member of the Veteran or service member
          named in this application or I reside with the Veteran or service
          member or will do so upon approval.
        </p>

        <p>
          I agree to perform personal care services as the Primary Family
          Caregiver for the Veteran or service member named on this application.
        </p>

        <p>
          I understand that the Veteran or Veteran’s surrogate may initiate my
          revocation as a Primary Family Caregiver at any time and that the VA
          may immediately revoke this designation if I fail to comply with the
          program requirements for continued participation in the program.
        </p>

        <p>
          I understand that participation in the Program of Comprehensive
          Assistance for Family Caregivers does not create an employment
          relationship with the Department of Veterans Affairs.
        </p>

        <PrivacyPolicy />
      </SignatureCheckbox>

      {secondaryCaregivers.hasSecondaryOne && (
        <SignatureCheckbox
          fullName={formData.secondaryOneFullName}
          label={secondaryOneLabel}
          signatures={signatures}
          setSignature={setSignature}
          isRequired
          showError={showError}
        >
          <SecondaryCaregiverCopy label="Secondary Family Caregiver" />
        </SignatureCheckbox>
      )}

      {secondaryCaregivers.hasSecondaryTwo && (
        <SignatureCheckbox
          fullName={formData.secondaryTwoFullName}
          label={secondaryTwoLabel}
          signatures={signatures}
          setSignature={setSignature}
          isRequired
          showError={showError}
        >
          <SecondaryCaregiverCopy label="Secondary Family Caregiver (2)" />
        </SignatureCheckbox>
      )}

      <p className="vads-u-margin-bottom--6">
        <b>Note:</b> According to federal law, there are criminal penalties,
        including a fine and/or imprisonment for up to 5 years, for withholding
        information or providing incorrect information. (See 18 U.S.C. 1001)
      </p>
    </section>
  );
};

export default {
  required: true,
  CustomComponent: PreSubmitCheckboxGroup,
};
