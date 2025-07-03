import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { normalizeFullName } from '../../utils/helpers';
import { DEFAULT_SIGNATURE_STATE } from '../../utils/constants';
import { useSignaturesSync } from '../../hooks/useSignatureSync';
import SubmitLoadingIndicator from './SubmitLoadingIndicator';
import StatementOfTruthItem from './StatementOfTruthItem';
import content from '../../locales/en/content.json';

const PreSubmitCheckboxGroup = ({ formData, showError, onSectionComplete }) => {
  const submission = useSelector(state => state.form.submission);
  const dispatch = useDispatch();

  const isRep = formData.signAsRepresentativeYesNo === 'yes';
  const hasSubmittedForm = Boolean(submission.status);

  const { requiredElements, signatures, setSignatures } = useSignaturesSync({
    formData,
    isRep,
  });

  // set form data with signature values, if submission has not occurred
  useEffect(
    () => {
      if (hasSubmittedForm) return;

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

  // validate all signature text is valid and all checkboxes are checked
  useEffect(
    () => {
      const allComplete = Object.values(signatures).every(
        ({ checked, matches }) => matches && checked,
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
        const { fullName, label, statementText } = config;
        const signature = signatures[label] || DEFAULT_SIGNATURE_STATE;
        const { checked, dirty, matches, value } = signature;

        const hasCheckboxError = !hasSubmittedForm && !checked && showError;
        const hasInvalidInputValue = isRep ? !value : !matches;
        const hasInputError =
          !hasSubmittedForm &&
          ((dirty && hasInvalidInputValue) || (!dirty && showError));

        const itemProps = {
          fullName: normalizeFullName(fullName, true),
          hasCheckboxError,
          hasInputError,
          isRep,
          label,
          signature,
          setSignatures,
          statementText,
        };

        return (
          <li key={label}>
            <StatementOfTruthItem {...itemProps} />
          </li>
        );
      }),
    [
      hasSubmittedForm,
      isRep,
      requiredElements,
      setSignatures,
      showError,
      signatures,
    ],
  );

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <p id="hca-statements-declaration" className="vads-u-margin-bottom--5">
        Please review information entered into this application. The{' '}
        {isRep ? 'representative' : 'Veteran'} and each family caregiver
        applicant must sign the appropriate section.
      </p>

      <ul
        aria-describedby="hca-statements-declaration"
        className="caregiver-list-style-none"
      >
        {statementsOfTruth}
      </ul>

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
