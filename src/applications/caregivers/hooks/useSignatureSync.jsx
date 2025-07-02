import { useEffect, useMemo, useState } from 'react';
import {
  hasPrimaryCaregiver,
  hasSecondaryCaregiverOne,
  hasSecondaryCaregiverTwo,
  replaceStrValues,
} from '../utils/helpers';
import { DEFAULT_SIGNATURE_STATE } from '../utils/constants';
import content from '../locales/en/content.json';

// organize text content for statement of truth components
export const LABELS = {
  veteran: content['vet-input-label'],
  representative: content['representative-signature-label'],
  primary: content['primary-signature-label'],
  secondaryOne: content['secondary-one-signature-label'],
  secondaryTwo: content['secondary-two-signature-label'],
};

const STATEMENTS = {
  veteran: [content['certification-statement--vet']],
  representative: [
    content['certification-statement--rep-1'],
    content['certification-statement--rep-2'],
  ],
  caregiver: role => [
    content['certification-statement--caregiver-1'],
    replaceStrValues(content['certification-statement--caregiver-2'], role),
    content['certification-statement--caregiver-3'],
    replaceStrValues(content['certification-statement--caregiver-4'], role),
    replaceStrValues(content['certification-statement--caregiver-5'], role),
    content['certification-statement--caregiver-6'],
  ],
};

export const useSignaturesSync = ({ formData, isRep }) => {
  const signatureConfig = useMemo(
    () => ({
      veteran: {
        schemaKey: 'veteran',
        label: LABELS.veteran,
        fullName: formData.veteranFullName,
        statementText: STATEMENTS.veteran,
        shouldRender: !isRep,
      },
      representative: {
        schemaKey: 'veteran',
        label: LABELS.representative,
        fullName: formData.veteranFullName,
        statementText: STATEMENTS.representative,
        shouldRender: isRep,
      },
      primary: {
        schemaKey: 'primary',
        label: LABELS.primary,
        fullName: formData.primaryFullName,
        statementText: STATEMENTS.caregiver('Primary'),
        shouldRender: hasPrimaryCaregiver(formData),
      },
      secondaryOne: {
        schemaKey: 'secondaryOne',
        label: LABELS.secondaryOne,
        fullName: formData.secondaryOneFullName,
        statementText: STATEMENTS.caregiver('Secondary'),
        shouldRender: hasSecondaryCaregiverOne(formData),
      },
      secondaryTwo: {
        schemaKey: 'secondaryTwo',
        label: LABELS.secondaryTwo,
        fullName: formData.secondaryTwoFullName,
        statementText: STATEMENTS.caregiver('Secondary'),
        shouldRender: hasSecondaryCaregiverTwo(formData),
      },
    }),
    [formData, isRep],
  );

  const requiredElements = Object.values(signatureConfig).filter(
    config => config.shouldRender,
  );

  const [signatures, setSignatures] = useState(() =>
    requiredElements.reduce((acc, { label }) => {
      acc[label] = DEFAULT_SIGNATURE_STATE;
      return acc;
    }, {}),
  );

  // keep signatures in sync with required elements
  useEffect(
    () => {
      const requiredLabels = requiredElements.map(e => e.label);
      const currentLabels = Object.keys(signatures);

      const labelsChanged =
        requiredLabels.length !== currentLabels.length ||
        requiredLabels.some(label => !currentLabels.includes(label));

      if (labelsChanged) {
        const next = requiredLabels.reduce((acc, label) => {
          acc[label] = signatures[label] || DEFAULT_SIGNATURE_STATE;
          return acc;
        }, {});
        setSignatures(next);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData, isRep],
  );

  return {
    requiredElements,
    signatures,
    setSignatures,
    signatureConfig,
  };
};
