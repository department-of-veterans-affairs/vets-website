import React, { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import SignatureCheckbox from './SignatureCheckbox';

const PreSubmitCheckboxGroup = ({ onSectionComplete, formData, showError }) => {
  const veteranLabel = `Veteran\u2019s`;
  const primaryLabel = `Primary Family Caregiver applicant\u2019s`;
  const secondaryOneLabel = `Secondary Family Caregiver applicant\u2019s`;
  const secondaryTwoLabel = `Secondary Family Caregiver (2) applicant\u2019s`;
  const hasPrimary = formData['view:hasPrimaryCaregiver'];
  const hasSecondaryOne = formData['view:hasSecondaryCaregiverOne'];
  const hasSecondaryTwo = formData['view:hasSecondaryCaregiverTwo'];

  const [signatures, setSignatures] = useState({
    [veteranLabel]: false,
  });

  const unSignedLength = Object.values(signatures).filter(
    obj => Boolean(obj) === false,
  ).length;

  // when there is no unsigned signatures set AGREED (onSectionComplete) to true
  // if goes to another page (unmount), set AGREED (onSectionComplete) to false
  useEffect(
    () => {
      onSectionComplete(!unSignedLength);

      return () => {
        onSectionComplete(false);
      };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unSignedLength],
  );

  useEffect(
    () => {
      if (!hasPrimary) {
        setSignatures(prevState => {
          const newState = cloneDeep(prevState);
          delete newState[primaryLabel];
          return newState;
        });
      }

      if (!hasSecondaryOne) {
        setSignatures(prevState => {
          const newState = cloneDeep(prevState);
          delete newState[secondaryOneLabel];
          return newState;
        });
      }

      if (!hasSecondaryTwo) {
        setSignatures(prevState => {
          const newState = cloneDeep(prevState);
          delete newState[secondaryTwoLabel];
          return newState;
        });
      }
    },

    [
      hasPrimary,
      hasSecondaryOne,
      hasSecondaryTwo,
      secondaryOneLabel,
      secondaryTwoLabel,
      primaryLabel,
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
    const header = title => `${title} Statement of Truth`;
    return (
      <div>
        <h3 className="vads-u-margin-top--4">{header(label)}</h3>

        <p className="vads-u-margin-y--4">
          I certify that I am at least 18 years of age.
        </p>

        <p>
          I certify that I am a family member of the Veteran named in this
          application or I reside with the Veteran, or will do so upon
          designation as the Veteran's Secondary Family Caregiver.
        </p>

        <p>
          I agree to perform personal care services as the Secondary Family
          Caregiver for the Veteran named on this application.
        </p>

        <p>
          I understand that the Veteran or Veteran’s surrogate may request my
          discharge from the Program of Comprehensive Assistance for Family
          Caregivers (PCAFC) at any time. I understand that my designation as a
          Secondary Family Caregiver may be revoked or I may be discharged from
          the program by the Secretary of Veterans Affairs or his designee, as
          set forth in 38 CFR 71.45.
        </p>

        <p>
          I understand that participation in PCAFC does not create an employment
          relationship between me and the Department of Veterans Affairs.
        </p>

        <PrivacyPolicy />
      </div>
    );
  };

  /*
    - Vet first && last name must match, and be checked
    - if hasPrimaryCaregiver first && last name must match, and be checked
    - if hasSecondary one || two, first & last name must match, and be checked to submit
   */

  return (
    <section className="signature-container">
      <p className="vads-u-margin-bottom--5">
        Please review information entered into this application. The Veteran and
        each family caregiver applicant must sign the appropriate section.
      </p>

      <SignatureCheckbox
        fullName={formData.veteranFullName}
        label={veteranLabel}
        signatures={signatures}
        setSignature={setSignatures}
        isRequired
        showError={showError}
      >
        <h3>Veteran&apos;s statement of truth</h3>
        <p>
          I certify that I give consent to the individual(s) named in this
          application to perform personal care services for me upon being
          approved as Primary and/or Secondary Family Caregivers in the Program
          of Comprehensive Assistance for Family Caregivers.
        </p>

        <PrivacyPolicy />
      </SignatureCheckbox>

      {hasPrimary && (
        <SignatureCheckbox
          fullName={formData.primaryFullName}
          label={primaryLabel}
          signatures={signatures}
          setSignature={setSignatures}
          isRequired
          showError={showError}
        >
          <h3 className="vads-u-margin-top--4">
            Primary Family Caregiver applicant&apos;s statement of truth
          </h3>

          <p className="vads-u-margin-y--4">
            I certify that I am at least 18 years of age.
          </p>

          <p>
            I certify that I am a family member of the Veteran named in this
            application or I reside with the Veteran, or will do so upon
            designation as the Veteran's Primary Family Caregiver.
          </p>

          <p>
            I agree to perform personal care services as the Primary Family
            Caregiver for the Veteran named on this application.
          </p>

          <p>
            I understand that the Veteran or Veteran’s surrogate may request my
            discharge from the Program of Comprehensive Assistance for Family
            Caregivers (PCAFC) at any time. I understand that my designation as
            a Primary Family Caregiver may be revoked or I may be discharged
            from the program by the Secretary of Veterans Affairs or his
            designee, as set forth in 38 CFR 71.45.
          </p>

          <p>
            I understand that participation in PCAFC does not create an
            employment relationship between me and the Department of Veterans
            Affairs.
          </p>

          <PrivacyPolicy />
        </SignatureCheckbox>
      )}

      {hasSecondaryOne && (
        <SignatureCheckbox
          fullName={formData.secondaryOneFullName}
          label={secondaryOneLabel}
          signatures={signatures}
          setSignature={setSignatures}
          isRequired
          showError={showError}
        >
          <SecondaryCaregiverCopy label={secondaryOneLabel} />
        </SignatureCheckbox>
      )}

      {hasSecondaryTwo && (
        <SignatureCheckbox
          fullName={formData.secondaryTwoFullName}
          label={secondaryTwoLabel}
          signatures={signatures}
          setSignature={setSignatures}
          isRequired
          showError={showError}
        >
          <SecondaryCaregiverCopy label={secondaryTwoLabel} />
        </SignatureCheckbox>
      )}

      <p className="vads-u-margin-bottom--6">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or providing incorrect information. (See 18
        U.S.C. 1001)
      </p>
    </section>
  );
};

export default {
  required: true,
  CustomComponent: PreSubmitCheckboxGroup,
};
