import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
  VaTextarea,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const LimitedConsent = ({
  addOrEditMode = 'add',
  currentEvidenceData,
  onChange,
  radioError,
  setRadioError,
  setTextAreaError,
  textAreaError,
}) => {
  const [showInputField, setShowInputField] = useState(false);
  const { lcDetails, lcPrompt } = currentEvidenceData || {};

  useEffect(
    () => {
      if (lcPrompt && radioError) {
        setRadioError(false);
      }

      if (lcDetails && textAreaError) {
        setTextAreaError(false);
      }

      if (radioError) {
        setShowInputField(false);
      }
    },
    [
      lcDetails,
      lcPrompt,
      radioError,
      setRadioError,
      setShowInputField,
      setTextAreaError,
      textAreaError,
    ],
  );

  const onRadioChange = value => {
    if (!value) {
      return null;
    }

    setRadioError(false);

    if (value === 'Y' || lcPrompt === 'Y') {
      setShowInputField(true);
    }

    onChange({
      ...(currentEvidenceData || {}),
      lcPrompt: value,
    });

    return true;
  };

  const onInputChange = value => {
    onChange({
      ...(currentEvidenceData || {}),
      lcDetails: value,
    });
  };

  const radioLabel =
    addOrEditMode === 'add'
      ? 'Do you want to limit consent for the information requested?'
      : 'Edit how you want to limit consent for the information requested';

  return (
    <>
      <VaRadio
        data-testid="limited-consent"
        error={radioError ? 'Select if we should limit our request' : null}
        label={radioLabel}
        label-header-level="3"
        onVaValueChange={e => onRadioChange(e.detail.value)}
        required
      >
        <VaRadioOption
          checked={lcPrompt === 'Y'}
          label="Yes"
          name="limited-consent"
          value="Y"
        />
        {showInputField && (
          <>
            <VaTextarea
              class="vads-u-margin-left--2"
              error={textAreaError ? 'Tell us how to limit our request' : null}
              hint="If you choose to limit consent, your private provider, VA Vet
                    Center, or medical facility can’t release certain types or
                    amounts of information to us. For example, you want your doctor
                    to release only information for certain treatment dates or
                    health conditions. It may take us longer to get your medical records from a private
                    provider or VA Vet Center if you limit consent."
              id="limited-consent"
              label="How should we limit our request for your medical information?"
              name="limited-consent-description"
              onInput={e => onInputChange(e.target.value)}
              required
              value={lcDetails || ''}
            />
          </>
        )}
        <VaRadioOption
          checked={lcPrompt === 'N'}
          label="No"
          name="limited-consent"
          value="N"
        />
      </VaRadio>
    </>
  );
};

LimitedConsent.propTypes = {
  addOrEditMode: PropTypes.string,
  currentEvidenceData: PropTypes.shape({
    lcDetails: PropTypes.string,
    lcPrompt: PropTypes.string,
  }),
  radioError: PropTypes.bool,
  setRadioError: PropTypes.func,
  setTextAreaError: PropTypes.func,
  textAreaError: PropTypes.bool,
  onChange: PropTypes.func,
};

export default LimitedConsent;
