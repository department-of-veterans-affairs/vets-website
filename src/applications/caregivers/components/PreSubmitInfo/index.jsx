import React, { useEffect, useState } from 'react';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import SignatureInput from 'applications/caregivers/components/PreSubmitInfo/components/SignatureInput';

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
        label="Yes, the submitted information is true, accurate, and complete."
      />
    </article>
  );
};

const PreSubmitCheckboxes = ({
  sectionCompleted,
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

      if (!unSignedLength) sectionCompleted(true);

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
    [checked, formData, sectionCompleted, preSubmitInfo, showError, signatures],
  );

  const CaregiverCopy = ({ label }) => {
    const header = title => `${title} or Family Member Statement of Truth`;
    return (
      <>
        <h3 className="vads-u-margin-top--4">{header(label)}</h3>

        <p className="vads-u-margin-y--4">
          I certify that I am at least 18 years of age.
        </p>

        <p>
          I certify that I am a family member of the Veteran or service member
          named in this application OR I reside with the Veteran or service
          member or will do so upon approval.
        </p>

        <p>
          I agree to perform personal care services as the Primary Family
          Caregiver for the Veteran or service member named on this application.
        </p>

        <p>
          I understand that the Veteran may revoke my designation as Primary
          Family Caregiver at any time and that the Secretary of the Department
          of Veterans Affairs (or designee) may remove me from this position
          immediately if I fail to comply with the Program requirements as
          defined by law.
        </p>

        <p>
          I understand that participation in the Program of Comprehensive
          Assistance for Family Caregivers does not create an employment
          relationship with the Department of Veterans Affairs.
        </p>

        <p>
          I certify that the information above is correct and true to the best
          of my knowledge and belief.
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
      <SignatureCheckbox
        fullName={formData.veteranFullName}
        label="Veteran"
        signatures={signatures}
        signSignature={setSignature}
      >
        <h3>Veteran or Service Member Statement of Truth</h3>
        <p>
          I certify that I give consent to the individual(s) named in this
          application to perform personal care services for me upon being
          approved as Primary and/or Secondary Caregiver(s) in the Program of
          Comprehensive Assistance for Family Caregivers. I certify that the
          information above is correct and true to the best of my knowledge and
          belief.
        </p>
      </SignatureCheckbox>

      <SignatureCheckbox
        fullName={formData.primaryFullName}
        label="Primary Caregiver"
        signatures={signatures}
        signSignature={setSignature}
      >
        <CaregiverCopy label="Primary Caregiver" />
      </SignatureCheckbox>

      {secondaryCaregivers.hasSecondaryOne && (
        <SignatureCheckbox
          fullName={formData.secondaryOneFullName}
          label="Secondary One Caregiver"
          signatures={signatures}
          signSignature={setSignature}
        >
          <CaregiverCopy label="Secondary One Caregiver" />
        </SignatureCheckbox>
      )}

      {secondaryCaregivers.hasSecondaryTwo && (
        <SignatureCheckbox
          fullName={formData.secondaryTwoFullName}
          label="Secondary Two Caregiver"
          signatures={signatures}
          signSignature={setSignature}
        >
          <CaregiverCopy label="Secondary Two Caregiver" />
        </SignatureCheckbox>
      )}
    </section>
  );
};

export default {
  required: true,
  CustomComponent: PreSubmitCheckboxes,
};
