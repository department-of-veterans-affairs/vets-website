import React, { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import SignatureCheckbox from './SignatureCheckbox';
import {
  PrivacyPolicy,
  veteranSignatureContent,
  primaryCaregiverContent,
  secondaryCaregiverContent,
  signatureBoxNoteContent,
} from 'applications/caregivers/definitions/content';
import SubmitLoadingIndicator from './SubmitLoadingIndicator';

const PreSubmitCheckboxGroup = ({ onSectionComplete, formData, showError }) => {
  const veteranLabel = `Veteran\u2019s`;
  const primaryLabel = `Primary Family Caregiver applicant\u2019s`;
  const secondaryOneLabel = `Secondary Family Caregiver applicant\u2019s`;
  const secondaryTwoLabel = `Secondary Family Caregiver (2) applicant\u2019s`;
  const hasPrimary = formData['view:hasPrimaryCaregiver'];
  const hasSecondaryOne = formData['view:hasSecondaryCaregiverOne'];
  const hasSecondaryTwo = formData['view:hasSecondaryCaregiverTwo'];
  // we are separating the first paragraph due to each paragraph having unique styling
  const veteranFirstParagraph = veteranSignatureContent[0];
  const veteranWithoutFirstParagraph = veteranSignatureContent.slice(1);
  const primaryFirstParagraph = primaryCaregiverContent[0];
  const primaryWithoutFirstParagraph = primaryCaregiverContent.slice(1);

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
    const header = title => `${title} statement of truth`;
    const firstParagraph = secondaryCaregiverContent[0];
    const contentWithoutFirstParagraph = secondaryCaregiverContent.slice(1);

    return (
      <div>
        <h3 className="vads-u-margin-top--4">{header(label)}</h3>

        <p className="vads-u-margin-y--4">{firstParagraph}</p>

        {contentWithoutFirstParagraph.map((secondaryContent, idx) => {
          return <p key={`${label}-${idx}`}>{secondaryContent}</p>;
        })}
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
    <section className="vads-u-display--flex vads-u-flex-direction--column">
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

        <p>{veteranFirstParagraph}</p>

        {/* currently this array is empty due to it only having one string
            checking for empty array then mapping it for future compatibility and consistency */}
        {veteranWithoutFirstParagraph &&
          veteranWithoutFirstParagraph.map((veteranContent, idx) => (
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

          <p className="vads-u-margin-y--4">{primaryFirstParagraph}</p>

          {primaryWithoutFirstParagraph.map((primaryContent, idx) => (
            <p key={`primary-signature-${idx}`}>{primaryContent}</p>
          ))}

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

      <div aria-live="polite">
        <SubmitLoadingIndicator />
      </div>
    </section>
  );
};

export default {
  required: true,
  CustomComponent: PreSubmitCheckboxGroup,
};
