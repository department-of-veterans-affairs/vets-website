import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  hasPrimaryCaregiver,
  hasSecondaryCaregiverOne,
  hasSecondaryCaregiverTwo,
  replaceStrValues,
} from '../../utils/helpers';
import StatementOfTruth from './StatementOfTruth';
import SignatureCheckbox from './SignatureCheckbox';
import SubmitLoadingIndicator from './SubmitLoadingIndicator';
import content from '../../locales/en/content.json';

// organize text content for statement of truth components
const LABELS = {
  veteran: content['vet-input-label'],
  representative: content['representative-signature-label'],
  primary: content['primary-signature-label'],
  secondaryOne: content['secondary-one-signature-label'],
  secondaryTwo: content['secondary-two-signature-label'],
};

export const STATEMENTS = {
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

// declare helpers for element rendering and validation
const getCheckboxProps = ({ label, formData }) => {
  const map = {
    [LABELS.veteran]: {
      fullName: formData.veteranFullName,
      statementText: STATEMENTS.veteran,
    },
    [LABELS.representative]: {
      fullName: formData.veteranFullName,
      statementText: STATEMENTS.representative,
    },
    [LABELS.primary]: {
      fullName: formData.primaryFullName,
      statementText: STATEMENTS.caregiver('Primary'),
    },
    [LABELS.secondaryOne]: {
      fullName: formData.secondaryOneFullName,
      statementText: STATEMENTS.caregiver('Secondary'),
    },
    [LABELS.secondaryTwo]: {
      fullName: formData.secondaryTwoFullName,
      statementText: STATEMENTS.caregiver('Secondary'),
    },
  };
  return map[label];
};

const PreSubmitCheckboxGroup = ({ formData, showError, onSectionComplete }) => {
  const submission = useSelector(state => state.form.submission);
  const dispatch = useDispatch();

  const hasPrimary = hasPrimaryCaregiver(formData);
  const hasSecondaryOne = hasSecondaryCaregiverOne(formData);
  const hasSecondaryTwo = hasSecondaryCaregiverTwo(formData);
  const hasSubmittedForm = !!submission.status;
  const isRep = formData.signAsRepresentativeYesNo === 'yes';
  const defaultSignatureKey = isRep ? LABELS.representative : LABELS.veteran;

  const [signatures, setSignatures] = useState({
    [defaultSignatureKey]: '',
  });

  const requiredLabels = useMemo(
    () => {
      const base = [defaultSignatureKey];
      if (hasPrimary) base.push(LABELS.primary);
      if (hasSecondaryOne) base.push(LABELS.secondaryOne);
      if (hasSecondaryTwo) base.push(LABELS.secondaryTwo);
      return base;
    },
    [defaultSignatureKey, hasPrimary, hasSecondaryOne, hasSecondaryTwo],
  );

  const checkboxElements = useMemo(
    () =>
      requiredLabels.map(label => {
        const { fullName, statementText } = getCheckboxProps({
          label,
          formData,
        });
        return (
          <SignatureCheckbox
            key={label}
            label={label}
            fullName={fullName}
            showError={showError}
            submission={submission}
            signatures={signatures}
            setSignatures={setSignatures}
            isRepresentative={label === LABELS.representative}
            isRequired
          >
            <StatementOfTruth content={{ label, text: statementText }} />
          </SignatureCheckbox>
        );
      }),
    [formData, requiredLabels, showError, signatures, submission],
  );

  const unSignedLength = Object.values(signatures).filter(
    signature => Boolean(signature) === false,
  ).length;
  // Get the count of unchecked signature checkboxes
  const signatureCheckboxes = document.querySelectorAll('.signature-checkbox');
  const uncheckedSignatureCheckboxesLength = [...signatureCheckboxes].filter(
    checkbox =>
      !checkbox.shadowRoot?.querySelector('#checkbox-element')?.checked,
  )?.length;

  const transformSignatures = signature => {
    const keys = Object.keys(signature);

    // takes in labels and renames to what schema expects
    const getKeyName = key => {
      const keyMap = {
        [LABELS.veteran]: 'veteran',
        [LABELS.representative]: 'veteran',
        [LABELS.primary]: 'primary',
        [LABELS.secondaryOne]: 'secondaryOne',
        [LABELS.secondaryTwo]: 'secondaryTwo',
      };
      return keyMap[key];
    };

    // iterates through all keys and normalizes them using getKeyName
    const renameObjectKeys = (keysMap, obj) =>
      Object.keys(obj).reduce((acc, key) => {
        const cleanKey = `${getKeyName(key)}Signature`;
        return {
          ...acc,
          ...{ [keysMap[cleanKey] || cleanKey]: obj[key] },
        };
      }, {});

    return renameObjectKeys(keys, signatures);
  };

  const removePartyIfFalsy = (predicate, label) => {
    if (!predicate) {
      setSignatures(prevState => {
        const newState = cloneDeep(prevState);
        delete newState[label];
        return newState;
      });
    }
  };

  useEffect(
    () => {
      // do not clear signatures once form has been submitted
      if (hasSubmittedForm) return;

      dispatch(
        setData({
          ...formData,
          ...transformSignatures(signatures),
        }),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, signatures],
  );

  // when no empty signature inputs or unchecked signature checkboxes exist set AGREED (onSectionComplete) to true
  // if user goes to another page (unmount), set AGREED (onSectionComplete) to false
  useEffect(
    () => {
      onSectionComplete(!unSignedLength && !uncheckedSignatureCheckboxesLength);
      return () => {
        onSectionComplete(false);
      };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unSignedLength, uncheckedSignatureCheckboxesLength],
  );

  // remove party signature box if yes/no question is answered falsy
  useEffect(
    () => {
      removePartyIfFalsy(hasPrimary, LABELS.primary);
      removePartyIfFalsy(hasSecondaryOne, LABELS.secondaryOne);
      removePartyIfFalsy(hasSecondaryTwo, LABELS.secondaryTwo);
      removePartyIfFalsy(isRep, LABELS.representative);
      removePartyIfFalsy(!isRep, LABELS.veteran);
    },
    [hasPrimary, hasSecondaryOne, hasSecondaryTwo, isRep],
  );

  /*
    - Vet first && last name must match, and be checked
    - if hasPrimaryCaregiver first && last name must match, and be checked
    - if hasSecondary one || two, first & last name must match, and be checked to submit
   */

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <p className="vads-u-margin-bottom--5">
        Please review information entered into this application. The{' '}
        {isRep ? 'representative' : 'Veteran'} and each family caregiver
        applicant must sign the appropriate section.
      </p>

      {checkboxElements}

      <p className="vads-u-margin-bottom--6">
        <strong>Note:</strong> {content['certification-signature-note']}
      </p>

      <div aria-live="polite">
        <SubmitLoadingIndicator submission={submission} />
      </div>
    </div>
  );
};

PreSubmitCheckboxGroup.propTypes = {
  formData: PropTypes.object.isRequired,
  showError: PropTypes.bool.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
};

export default {
  required: true,
  CustomComponent: PreSubmitCheckboxGroup,
};
