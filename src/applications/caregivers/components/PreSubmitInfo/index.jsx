import React, { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import SignatureCheckbox from './SignatureCheckbox';
import {
  PrivacyPolicy,
  veteranSignatureContent,
  primaryCaregiverContent,
  secondaryCaregiverContent,
  signatureBoxNoteContent,
} from 'applications/caregivers/definitions/content.js';

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

  const SecondaryCaregiverCopy = ({ label }) => {
    const header = title => `${title} Statement of Truth`;
    return (
      <div>
        <h3 className="vads-u-margin-top--4">{header(label)}</h3>

        {secondaryCaregiverContent.map((secondaryContent, idx) => (
          <p key={`label-${idx}`}>{secondaryContent}</p>
        ))}

        <p className="vads-u-margin-y--4">
          I certify that I am at least 18 years of age.
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

        {veteranSignatureContent.map((veteranContent, idx) => (
          <p key={`veteran-signature-${idx}`}>{veteranContent}</p>
        ))}

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

          {primaryCaregiverContent.map((primaryContent, idx) => (
            <p key={`veteran-signature-${idx}`}>{primaryContent}</p>
          ))}

          <p className="vads-u-margin-y--4">
            I certify that I am at least 18 years of age.
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
        <strong>Note:</strong> {signatureBoxNoteContent}
      </p>
    </section>
  );
};

export default {
  required: true,
  CustomComponent: PreSubmitCheckboxGroup,
};
