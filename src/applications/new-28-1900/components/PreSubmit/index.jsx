import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import StatementOfTruth from './StatementOfTruth';
import SignatureCheckbox from './SignatureCheckbox';
import SubmitLoadingIndicator from './SubmitLoadingIndicator';
import content from '../../locales/en/content.json';

// organize text content for statement of truth components
const LABELS = {
  veteran: content['vet-input-label'],
};

export const STATEMENTS = {
  veteran: [content['certification-statement--vet']],
};

// declare default state structure(s)
const DEFAULT_SIGNATURE_STATE = { value: '', checked: false };

const PreSubmitCheckboxGroup = ({ formData, showError, onSectionComplete }) => {
  const submission = useSelector(state => state.form.submission);
  const dispatch = useDispatch();

  const isRep = formData.signAsRepresentativeYesNo === 'yes';

  const signatureConfig = useMemo(
    () => ({
      veteran: {
        schemaKey: 'veteran',
        label: LABELS.veteran,
        fullName: formData.veteranFullName,
        statementText: STATEMENTS.veteran,
        shouldRender: true,
      },
    }),
    [formData, isRep],
  );

  const requiredElements = useMemo(
    () => Object.values(signatureConfig).filter(config => config.shouldRender),
    [signatureConfig],
  );

  const [signatures, setSignatures] = useState(() =>
    requiredElements.reduce(
      (acc, { label }) => ({ ...acc, [label]: DEFAULT_SIGNATURE_STATE }),
      {},
    ),
  );

  // keep signatures in sync with required data
  useEffect(
    () => {
      const requiredLabels = requiredElements.map(e => e.label);
      const currentLabels = Object.keys(signatures);

      const labelsChanged =
        requiredLabels.length !== currentLabels.length ||
        requiredLabels.some(label => !currentLabels.includes(label));

      if (labelsChanged) {
        const next = {};
        requiredLabels.forEach(label => {
          next[label] = signatures[label] || DEFAULT_SIGNATURE_STATE;
        });
        setSignatures(next);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requiredElements],
  );

  // set form data with signature values, if submission has not occurred
  useEffect(
    () => {
      if (submission.status) return;

      const transformedSignatures = requiredElements.reduce(
        (acc, { label, schemaKey }) => {
          acc[`${schemaKey}Signature`] = signatures[label]?.value || '';
          return acc;
        },
        {},
      );
      dispatch(setData({ ...formData, ...transformedSignatures }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, signatures],
  );

  // validate that all signature text is valid and all checkboxes have been checked
  useEffect(
    () => {
      const allComplete = Object.values(signatures).every(
        ({ value, checked }) => Boolean(value) && checked,
      );
      onSectionComplete(allComplete);
      return () => onSectionComplete(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signatures],
  );

  const statementsOfTruth = useMemo(
    () =>
      requiredElements.map(config => {
        const { label, fullName, statementText } = config;
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
    [requiredElements, showError, signatures, submission],
  );

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <p className="vads-u-margin-bottom--5">
        Please review information entered into this application. The{' '}
        {isRep ? 'representative' : 'Veteran'} and each family caregiver
        applicant must sign the appropriate section.
      </p>

      {statementsOfTruth}

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
