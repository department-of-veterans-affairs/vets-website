import React, { useEffect, useState } from 'react';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import SignatureInput from 'applications/caregivers/components/PreSubmitInfo/components/SignatureInput';

// single checkbox
const SignatureCheckbox = ({
  fullName,
  label,
  children,
  signSignature,
  signatures,
}) => {
  const [isSigned, setIsSigned] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const isSignatureComplete = isSigned && isChecked;

  useEffect(
    () => {
      signSignature({ ...signatures, [label]: isSignatureComplete });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signSignature, label, isSignatureComplete],
  );

  return (
    <article className="vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--1p5 vads-u-padding-top--1px vads-u-margin-bottom--7">
      {children && <header>{children}</header>}

      <SignatureInput
        setIsSigned={setIsSigned}
        label={label}
        fullName={fullName}
      />

      <ErrorableCheckbox
        onValueChange={event => setIsChecked(event)}
        label="I certify the information above is correct and true to the best of my knowledge and belief."
      />
    </article>
  );
};

// checkbox group
const PreSubmitCheckboxes = ({
  onSectionComplete,
  showError,
  preSubmitInfo,
  checked,
  formData,
}) => {
  const [signatures, setSignature] = useState({
    Veteran: false,
    'Primary Caregiver': false,
  });
  const [secondaryCaregivers, setSecondaryCaregivers] = useState({
    hasSecondaryOne: undefined,
    hasSecondaryTwo: undefined,
  });

  useEffect(
    () => {
      const unSignedLength = Object.values(signatures).filter(
        obj => Boolean(obj) === false,
      ).length;

      if (!unSignedLength) onSectionComplete(true);

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
    [
      checked,
      formData,
      onSectionComplete,
      preSubmitInfo,
      showError,
      signatures,
    ],
  );

  const SecondaryCaregiverCopy = ({ label }) => {
    const header = title => `${title} statement of truth`;
    return (
      <>
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
            program requirements for continued participation in the program.`}{' '}
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
      </>
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
        label="Enter Veteran's or service member's full name"
        signatures={signatures}
        signSignature={setSignature}
      >
        <h3>Veteran or service member statement of truth</h3>
        <p>
          I certify that I give consent to the individual(s) named in this
          application to perform personal care services for me upon being
          approved as Primary and/or Secondary Caregiver(s) in the Program of
          Comprehensive Assistance for Family Caregivers. I have read and accept
          the
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
      </SignatureCheckbox>

      <SignatureCheckbox
        fullName={formData.primaryFullName}
        label="Enter Primary Family Caregiver's full name"
        signatures={signatures}
        signSignature={setSignature}
      >
        <>
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
            Caregiver for the Veteran or service member named on this
            application.
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
            relationship with the Department of Veterans Affairs. I have read
            and accept the
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
        </>
      </SignatureCheckbox>

      {secondaryCaregivers.hasSecondaryOne && (
        <SignatureCheckbox
          fullName={formData.secondaryOneFullName}
          label="Enter Secondary Family Caregiver's full name"
          signatures={signatures}
          signSignature={setSignature}
        >
          <SecondaryCaregiverCopy label="Secondary Family Caregiver" />
        </SignatureCheckbox>
      )}

      {secondaryCaregivers.hasSecondaryTwo && (
        <SignatureCheckbox
          fullName={formData.secondaryTwoFullName}
          label="Enter Secondary Family Caregiver's (2) full name"
          signatures={signatures}
          signSignature={setSignature}
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
  CustomComponent: PreSubmitCheckboxes,
};
