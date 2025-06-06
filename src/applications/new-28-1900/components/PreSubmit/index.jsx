import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import StatementOfTruth from './StatementOfTruth';
import SignatureCheckbox from './SignatureCheckbox';
import ProtectionOfPrivacyStatement from './ProtectionOfPrivacyStatement';

// declare default state structure(s)
const DEFAULT_SIGNATURE_STATE = { value: '', checked: false };

const PreSubmitCheckboxGroup = ({ formData, showError, onSectionComplete }) => {
  const submission = useSelector(state => state.form.submission);
  const hasSubmittedForm = !!submission.status;
  const dispatch = useDispatch();
  const [signatureComplete, setSignatureComplete] = useState(false);

  const signatureConfig = useMemo(
    () => ({
      veteran: {
        schemaKey: 'veteran',
        label: 'Veteran\u2019s',
        fullName: formData.veteranFullName,
        statementText:
          'I certify that the individual(s) named in this application are involved in my care and I consent to sharing information necessary to their involvement in my health care, payment related to such health care or as needed for notification purposes.',
        shouldRender: true,
      },
    }),
    [formData],
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
      setSignatureComplete(allComplete);
      return () => onSectionComplete(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signatures],
  );

  const statementsOfTruth = useMemo(
    () =>
      requiredElements.map(config => {
        const { label, fullName } = config;
        return (
          <SignatureCheckbox
            key={label}
            label={label}
            fullName={fullName}
            showError={showError}
            submission={submission}
            signatures={signatures}
            setSignatures={setSignatures}
            isRequired
          >
            <StatementOfTruth />
          </SignatureCheckbox>
        );
      }),
    [requiredElements, showError, signatures, submission],
  );

  const [isChecked, setIsChecked] = useState(false);
  const privacyStatement = useMemo(
    () => {
      return (
        <ProtectionOfPrivacyStatement
          formData={formData}
          hasSubmittedForm={hasSubmittedForm}
          isChecked={isChecked}
          onSectionComplete={onSectionComplete}
          setIsChecked={setIsChecked}
          showError={showError}
        />
      );
    },
    [isChecked, setIsChecked, showError],
  );

  // Mark the review page as complete when the Statement of Truth and Privacy Agreement are both complete
  useEffect(
    () => {
      if (signatureComplete && isChecked) {
        onSectionComplete(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isChecked, signatureComplete],
  );

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      {privacyStatement}
      {statementsOfTruth}
      <p className="vads-u-margin-bottom--3">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or providing incorrect information. (See 18
        U.S.C. 1001)
      </p>
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
