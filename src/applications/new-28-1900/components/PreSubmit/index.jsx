import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import StatementOfTruth from './StatementOfTruth';
import SignatureCheckbox from './SignatureCheckbox';
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
  const hasSubmittedForm = !!submission.status;
  const dispatch = useDispatch();
  const [signatureComplete, setSignatureComplete] = useState(false);

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
            isRequired
          >
            <StatementOfTruth content={{ label, text: statementText }} />
          </SignatureCheckbox>
        );
      }),
    [requiredElements, showError, signatures, submission],
  );

  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheck = event => {
    const value = event.target.checked;
    setIsChecked(value);
    dispatch(setData({ ...formData, ...{ privacyAgreement: value } }));
  };

  useEffect(
    () => {
      const hasError =
        isChecked === true || hasSubmittedForm ? false : showError;
      onSectionComplete(false);
      const message = hasError ? 'My error message' : null;
      setError(message);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showError, isChecked, hasSubmittedForm],
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
      <fieldset className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--1">
        <legend className="signature-box--legend vads-u-display--block vads-u-width--full vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--bold">
          Protection of Privacy Information Statement
        </legend>
        <p>
          <strong className="privacy-statement-lede">
            I have been informed and understand
          </strong>{' '}
          that the information requested in this and any later interviews is
          requested under the authorization of Title 38, United States Code of
          Federal Regulations 1.576, Veterans Benefits. This information is
          needed to assist in vocational and educational planning, to authorize
          my receipt of rehabilitation services, to develop a record of my
          vocational progress, and to assure I obtain the best results from my
          rehabilitation program. I understand that the information I provide
          will not be used for any other purpose and that my responses may be
          disclosed outside VA only if the disclosure is authorized under the
          Privacy Act of 1974, including the routine uses identified in the VA
          system of records, 58VA21/22/28, Compensation, Pension, Education and
          Veteran Readiness and Employment Records - VA, published in the
          Federal Register. Generally, disclosures under the authority of a
          routine use will be made to develop my claim for vocational
          rehabilitation benefits under Title 38, United States Code.
        </p>
        <p>
          My giving the requested information is voluntary. I understand that
          the following results might occur if I do not give this information:
        </p>
        <ol>
          <li>
            I may not receive the maximum benefit either from counseling or from
            my education or rehabilitation program.
          </li>
          <li>
            If certain information is required before I may enter a VA program,
            my failure to give the information may result in my not receiving
            the education or rehabilitation benefit for which I have applied.
          </li>
          <li>
            If I am in a program in which information on my progress is
            required, my failure to give this information may result in my not
            receiving further benefits or services. My failure to give this
            information will not have a negative effect on any other benefit to
            which I may be entitled.
          </li>
        </ol>
        <VaCheckbox
          required
          onVaChange={handleCheck}
          label="I acknowledge I have read the Protection of Privacy Information Statement."
          error={error}
          id="privacy-statement"
          name="privacy-statement"
        />
      </fieldset>
      {statementsOfTruth}
      <p className="vads-u-margin-bottom--3">
        <strong>Note:</strong> {content['certification-signature-note']}
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
