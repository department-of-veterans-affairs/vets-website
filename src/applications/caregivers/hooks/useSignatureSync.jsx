import { useEffect, useMemo, useState } from 'react';
import {
  hasPrimaryCaregiver,
  hasSecondaryCaregiverOne,
  hasSecondaryCaregiverTwo,
  normalizeFullName,
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
  representative: vetName => [
    replaceStrValues(content['certification-statement--rep'], vetName),
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
        statementText: STATEMENTS.representative(formData.veteranFullName),
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

  const shouldPrefill = label => label !== LABELS.representative;

  const [signatures, setSignatures] = useState(() =>
    requiredElements.reduce((acc, { fullName, label }) => {
      acc[label] = {
        ...DEFAULT_SIGNATURE_STATE,
        matches: shouldPrefill(label),
        value: shouldPrefill(label) ? normalizeFullName(fullName, true) : '',
      };
      return acc;
    }, {}),
  );

  // keep signatures in sync with required elements
  useEffect(
    () => {
      const requiredLabels = requiredElements.map(e => e.label);
      const currentLabels = Object.keys(signatures);

      const next = requiredLabels.reduce((acc, label) => {
        const existing = signatures[label];
        const el = requiredElements?.find(e => e.label === label);
        const fullName = shouldPrefill(label)
          ? normalizeFullName(el?.fullName, true)
          : '';
        const shouldReplace =
          !existing || (shouldPrefill(label) && existing?.value !== fullName);

        acc[label] = shouldReplace
          ? {
              ...DEFAULT_SIGNATURE_STATE,
              matches: shouldPrefill(label),
              value: fullName,
            }
          : existing;
        return acc;
      }, {});

      const nextLabels = Object.keys(next);
      const hasChanged =
        nextLabels.length !== currentLabels.length ||
        nextLabels.some(label => {
          const a = next[label];
          const b = signatures[label];
          return a.value !== b?.value || a.matches !== b?.matches;
        });

      if (hasChanged) setSignatures(next);
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
