import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import content from '../../locales/en/content.json';
import {
  formatFullName,
  replaceStrValues,
} from '../../utils/helpers/formatting';
import { VaStatementOfTruth } from '../../utils/imports';

const STATEMENT_TEXT_DEFAULT = content['statement-of-truth--default'];
const STATEMENT_TEXT_REP = content['statement-of-truth--representative'];
const ERR_MSG_CHECKBOX = content['validation--sot--checkbox'];
const ERR_MSG_INPUT_APPLICANT = content['validation--sot--applicant-signature'];
const ERR_MSG_INPUT_OTHER = content['validation--sot--other-signature'];

const PreSubmitInfo = ({ formData, showError, onSectionComplete }) => {
  const dispatch = useDispatch();
  const hasSubmittedForm = useSelector(state =>
    Boolean(state.form.submission.status),
  );

  const isRep = formData.certifierRole === 'other';

  const [signature, setSignature] = useState(formData.signature ?? '');
  const [checked, setChecked] = useState(false);
  const [dirty, setDirty] = useState(false);

  const prevCompleteRef = useRef();
  const onCompleteRef = useRef(onSectionComplete);

  const onVaCheckboxChange = useCallback(e => setChecked(e.detail.checked), []);

  const onVaInputBlur = useCallback(() => setDirty(true), []);

  const onVaInputChange = useCallback(
    e => {
      const nextValue = e.detail.value.trim();
      setSignature(nextValue);

      if (!hasSubmittedForm && nextValue !== formData.signature) {
        dispatch(setData({ ...formData, signature: nextValue }));
      }
    },
    [dispatch, formData, hasSubmittedForm],
  );

  const applicantName = useMemo(
    () => formatFullName(formData.applicantName, { includeMiddle: true }),
    [formData.applicantName],
  );

  const nameMatchesValue = useMemo(
    () =>
      isRep ? true : signature.toLowerCase() === applicantName.toLowerCase(),
    [applicantName, isRep, signature],
  );

  const hasValidInputValue = useMemo(
    () => (isRep ? Boolean(signature) : nameMatchesValue),
    [isRep, nameMatchesValue, signature],
  );

  const inputError = useMemo(
    () => {
      if (hasSubmittedForm) return null;
      if (hasValidInputValue) return null;

      const shouldShow = showError || dirty;
      if (!shouldShow) return null;

      return isRep
        ? ERR_MSG_INPUT_OTHER
        : replaceStrValues(ERR_MSG_INPUT_APPLICANT, applicantName);
    },
    [
      applicantName,
      dirty,
      hasSubmittedForm,
      hasValidInputValue,
      isRep,
      showError,
    ],
  );

  const checkboxError = useMemo(
    () => {
      if (hasSubmittedForm) return null;
      return !checked && showError ? ERR_MSG_CHECKBOX : null;
    },
    [hasSubmittedForm, checked, showError],
  );

  const statementText = useMemo(
    () =>
      isRep
        ? replaceStrValues(STATEMENT_TEXT_REP, applicantName)
        : STATEMENT_TEXT_DEFAULT,
    [applicantName, isRep],
  );

  const isComplete = checked && hasValidInputValue;

  useEffect(() => setSignature(formData.signature ?? ''), [formData.signature]);

  useEffect(
    () => {
      onCompleteRef.current = onSectionComplete;
    },
    [onSectionComplete],
  );

  useEffect(
    () => {
      if (prevCompleteRef.current === isComplete) return;
      prevCompleteRef.current = isComplete;
      onCompleteRef.current(isComplete);
    },
    [isComplete],
  );

  useEffect(() => {
    return () => onCompleteRef.current(false);
  }, []);

  return (
    <VaStatementOfTruth
      name="root_signature"
      checked={checked}
      inputValue={signature}
      inputError={inputError}
      checkboxError={checkboxError}
      onVaInputBlur={onVaInputBlur}
      onVaInputChange={onVaInputChange}
      onVaCheckboxChange={onVaCheckboxChange}
    >
      {statementText}
    </VaStatementOfTruth>
  );
};

PreSubmitInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  showError: PropTypes.bool.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
};

export default {
  required: true,
  CustomComponent: PreSubmitInfo,
};
