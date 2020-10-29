import React, { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import { updateSchemaAndData } from 'platform/forms-system/src/js/state/helpers';
import SignatureCheckbox from './SignatureCheckbox';
import PrivacyPolicy from './components/PrivacyPolicy';
import SecondaryCaregiverCopy from './components/SecondaryCaregiverCopy';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { reviewPageLabels } from 'applications/caregivers/definitions/constants';

const PreSubmitCheckboxGroup = props => {
  console.log('props: ', props);
  const { onSectionComplete, formData, showError } = props;
  const {
    veteranLabel,
    primaryLabel,
    secondaryOneLabel,
    secondaryTwoLabel,
  } = reviewPageLabels;
  const hasSecondaryOne = formData['view:hasSecondaryCaregiverOne'];
  const hasSecondaryTwo = formData['view:hasSecondaryCaregiverTwo'];

  // veteranCertifications (always required)
  // all optional
  // primaryCertifications
  // secondaryOneCertifications
  // secondaryTwoCertifications
  const [certifications, setCertifications] = useState({
    [veteranLabel]: [],
    [primaryLabel]: [],
  });

  const uncertifiedLength = Object.values(certifications).filter(
    certArray => certArray.length === 0,
  ).length;

  const [signatures, setSignatures] = useState({
    [veteranLabel]: false,
    [primaryLabel]: false,
  });

  const unSignedLength = Object.values(signatures).filter(
    obj => Boolean(obj) === false,
  ).length;

  const allPartiesSignedAndCertified = !unSignedLength && !uncertifiedLength;

  console.log('allPartiesSignedAndCertified: ', allPartiesSignedAndCertified);

  // when there is no unsigned signatures set AGREED (onSectionComplete) to true
  // if goes to another page (unmount), set AGREED (onSectionComplete) to false
  // TODO compute certs for all parties
  // once all parties are computed add to AGREED logic
  // once AGREED logic is fulfilled hoist data to redux state
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

  useEffect(() => {
    if (allPartiesSignedAndCertified) {
      updateSchemaAndData(fullSchema, null, formData);
    }
  }, []);

  // prune party if they no longer exist
  useEffect(
    () => {
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

    [hasSecondaryOne, hasSecondaryTwo, secondaryOneLabel, secondaryTwoLabel],
  );

  /*
    - Vet first && last name must match, and be checked
    - PrimaryCaregiver first && last name must match, and be checked
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
        setCertifications={setCertifications}
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

      <SignatureCheckbox
        fullName={formData.primaryFullName}
        label={primaryLabel}
        signatures={signatures}
        setSignature={setSignatures}
        isRequired
        showError={showError}
        setCertifications={setCertifications}
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
          Caregivers (PCAFC) at any time. I understand that my designation as a
          Primary Family Caregiver may be revoked or I may be discharged from
          the program by the Secretary of Veterans Affairs or his designee, as
          set forth in 38 CFR 71.45.
        </p>

        <p>
          I understand that participation in the PCAFC does not create an
          employment relationship between me and the Department of Veterans
          Affairs.
        </p>
      </SignatureCheckbox>

      {hasSecondaryOne && (
        <SignatureCheckbox
          fullName={formData.secondaryOneFullName}
          label={secondaryOneLabel}
          signatures={signatures}
          setSignature={setSignatures}
          isRequired
          showError={showError}
          setCertifications={setCertifications}
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
          setCertifications={setCertifications}
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
