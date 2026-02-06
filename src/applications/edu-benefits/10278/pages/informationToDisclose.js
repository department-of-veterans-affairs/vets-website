// @ts-check
import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '~/platform/user/selectors';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  VaCheckbox,
  VaCheckboxGroup,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  buildValidateAtLeastOne,
  DISCLOSURE_KEYS,
  DISCLOSURE_OPTIONS,
  getFullName,
  getThirdPartyName,
  validateOtherText,
  InformationToDiscloseReviewField as ReviewField,
} from '../helpers';

export const InformationToDiscloseReviewField = props => (
  <ReviewField
    {...props}
    disclosureKeys={DISCLOSURE_KEYS}
    options={DISCLOSURE_OPTIONS}
    dataKey="claimInformation"
    otherTextKey="otherText"
  />
);
const OTHER_TEXT_MAX = 30;
const DisclosureIntro = ({ claimantName, thirdPartyName }) => (
  <>
    <p>
      I, the claimant <strong>{claimantName || 'N/A'}</strong>, authorize VA to
      speak with <strong>{thirdPartyName || 'N/A'}</strong> for the purpose of
      providing the following information pertaining to my VA record.
    </p>
  </>
);

const getChecked = e => Boolean(e?.detail?.checked);
const getValue = e => e?.detail?.value ?? '';

const validateAtLeastOne = buildValidateAtLeastOne(DISCLOSURE_KEYS);

const InformationToDiscloseField = props => {
  const {
    formData = {},
    onChange,
    rawErrors,
    errorSchema,
    idSchema,
    showErrors,
    showError,
    formContext,
  } = props;

  const profile = useSelector(selectProfile);
  const fullFormData = useSelector(state => state?.form?.data);

  const keys = useMemo(() => DISCLOSURE_KEYS, []);
  const anchorKey = DISCLOSURE_KEYS[0];

  // Most reliable "Continue clicked" gating in SchemaForm flows
  const hasAttemptedContinue = Boolean(
    showErrors ||
      showError ||
      formContext?.submitted ||
      formContext?.showErrors ||
      formContext?.showValidationErrors,
  );

  const anyChecked = keys.some(k => Boolean(formData?.[k]));

  // The at-least-one error is attached to the anchor checkbox key
  const atLeastOneMsg =
    rawErrors?.[0] ||
    errorSchema?.[anchorKey]?.__errors?.[0] ||
    keys.map(k => errorSchema?.[k]?.__errors?.[0]).find(Boolean);

  // Only show after Continue AND only when none selected.
  const groupError =
    hasAttemptedContinue && !anyChecked ? atLeastOneMsg : undefined;

  // ----- Select all derived state -----
  const selectedCount = keys.filter(k => formData?.[k] === true).length;
  const allSelected = keys.length > 0 && selectedCount === keys.length;
  const someSelected = selectedCount > 0 && !allSelected;

  const setAll = useCallback(
    checked => {
      const next = { ...(formData || {}) };
      keys.forEach(k => {
        next[k] = checked;
      });

      if (!checked) {
        next.otherText = '';
      }

      onChange(next);
    },
    [formData, keys, onChange],
  );

  const setOne = useCallback(
    (key, checked) => {
      const next = { ...(formData || {}), [key]: checked };

      if (key === 'other' && !checked) {
        next.otherText = '';
      }

      onChange(next);
    },
    [formData, onChange],
  );

  const setOtherExplanation = useCallback(
    value => {
      onChange({ ...(formData || {}), otherText: value });
    },
    [formData, onChange],
  );

  const otherChecked = Boolean(formData?.other);
  const otherHasText = (formData?.otherText || '').trim().length > 0;
  const otherNeedsError = otherChecked && !otherHasText;

  const otherErrorMessage = errorSchema?.otherText?.__errors?.[0];
  const computedOtherError =
    hasAttemptedContinue && otherNeedsError && otherErrorMessage
      ? otherErrorMessage
      : undefined;

  // Wrapper id for the whole object field
  const wrapperId = idSchema?.$id || 'claimInformation';

  const claimantName =
    getFullName(fullFormData?.claimantPersonalInformation?.fullName) ||
    getFullName(profile?.userFullName);
  const thirdPartyName = getThirdPartyName(fullFormData);

  return (
    <div id={wrapperId} tabIndex="-1">
      <DisclosureIntro
        claimantName={claimantName}
        thirdPartyName={thirdPartyName}
      />

      <VaCheckboxGroup
        id={`${wrapperId}-checkbox-group`}
        label={`Here is a list of all benefit and claim information you can allow ${thirdPartyName} to see. Select the information that you want to share.`}
        required
        error={groupError}
      >
        <VaCheckbox
          label="Select all benefit and claim information"
          checked={allSelected}
          indeterminate={someSelected}
          onVaChange={e => setAll(getChecked(e))}
        />

        {keys.map(key => {
          const opt = DISCLOSURE_OPTIONS[key];
          const label = typeof opt === 'string' ? opt : opt.title;
          const description =
            typeof opt === 'string' ? undefined : opt.description;

          // Critical fix for scrollToFirstError:
          // Create a LIGHT-DOM, focusable element with the exact schema id for this field.
          const fieldId = idSchema?.[key]?.$id || `${wrapperId}_${key}`;

          return (
            <div key={key}>
              {/* This div is what scrollToFirstError will reliably find */}
              <div id={fieldId} tabIndex="-1">
                <VaCheckbox
                  name={fieldId} // helps if scroll lookup is name-based
                  label={label}
                  checked={Boolean(formData?.[key])}
                  onVaChange={e => setOne(key, getChecked(e))}
                />
              </div>
              {description ? (
                <div className="vads-u-margin-left--3 vads-u-margin-top--0">
                  {description}
                </div>
              ) : null}

              {key === 'other' &&
                otherChecked && (
                  <div className="vads-u-margin-left--3 vads-u-margin-top--1">
                    <VaTextInput
                      id={idSchema?.otherText?.$id}
                      label="Specify other information you’d like to disclose"
                      required={otherChecked}
                      charcount
                      maxlength={OTHER_TEXT_MAX}
                      value={formData?.otherText || ''}
                      error={computedOtherError}
                      onVaInput={e => setOtherExplanation(getValue(e))}
                      onVaChange={e => setOtherExplanation(getValue(e))}
                    />
                  </div>
                )}
            </div>
          );
        })}
      </VaCheckboxGroup>
    </div>
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Disclose personal information pertaining to your VA record'),
    claimInformation: {
      'ui:field': InformationToDiscloseField,
      'ui:reviewField': InformationToDiscloseReviewField,
      'ui:validations': [validateAtLeastOne, validateOtherText],
    },
  },

  schema: {
    type: 'object',
    properties: {
      claimInformation: {
        type: 'object',
        properties: {
          statusOfClaim: { type: 'boolean' },
          currentBenefit: { type: 'boolean' },
          paymentHistory: { type: 'boolean' },
          amountOwed: { type: 'boolean' },
          minor: { type: 'boolean' },
          other: { type: 'boolean' },
          otherText: { type: 'string', maxLength: OTHER_TEXT_MAX },
        },
      },
    },
  },
};
