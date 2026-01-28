import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
  VaTextarea,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const content = {
  editPrompt:
    'Edit how you want to limit consent for the information requested',
  prompt: 'Do you want to limit consent for the information requested?',
  radioError: 'Select if we should limit our request',
  textareaError: 'Tell us how to limit our request',
  textareaLabel:
    'How should we limit our request for your medical information?',
};

const LimitedConsent = ({
  lcDetails,
  lcPrompt,
  onChange,
  radioError,
  setRadioError,
  setTextAreaError,
  textAreaError,
}) => {
  const [showInputField, setShowInputField] = useState(false);

  useEffect(
    () => {
      if (lcPrompt && radioError) {
        setRadioError(false);
      }

      if (lcDetails && textAreaError) {
        setTextAreaError(false);
      }

      if (lcPrompt === 'Y' && !showInputField) {
        setShowInputField(true);
      } else if (lcPrompt === 'N' && showInputField) {
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
      showInputField,
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

    return onChange({
      lcPrompt: value,
    });
  };

  const onInputChange = value => {
    if (!value) {
      return null;
    }

    setTextAreaError(false);

    return onChange({
      lcDetails: value,
    });
  };

  // TODO come back to this to determine how to tell if we're editing
  // from the review page
  // const radioLabel =
  //   addOrEditMode === 'add' ? content.prompt : content.editPrompt;

  return (
    <>
      <VaRadio
        data-testid="limited-consent"
        error={radioError ? content.radioError : null}
        label={content.prompt}
        label-header-level="3"
        name="root_limitedConsent"
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
              error={textAreaError ? content.textareaError : null}
              hint="If you choose to limit consent, your private provider, VA Vet
                    Center, or medical facility can’t release certain types or
                    amounts of information to us. For example, you want your doctor
                    to release only information for certain treatment dates or
                    health conditions. It may take us longer to get your medical records from a private
                    provider or VA Vet Center if you limit consent."
              id="limited-consent"
              label={content.textareaLabel}
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
  lcDetails: PropTypes.string,
  lcPrompt: PropTypes.string,
  radioError: PropTypes.bool,
  setRadioError: PropTypes.func,
  setTextAreaError: PropTypes.func,
  textAreaError: PropTypes.bool,
  onChange: PropTypes.func,
};

export default LimitedConsent;
