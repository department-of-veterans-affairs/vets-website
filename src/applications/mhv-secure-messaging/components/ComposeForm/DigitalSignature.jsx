import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ElectronicSignature } from '../../util/constants';

const DigitalSignature = ({
  nameError,
  onInput,
  checkboxError,
  onChange,
  checked,
}) => {
  return (
    <>
      <p id="signatureNote" aria-describedby={ElectronicSignature.TITLE}>
        <strong>Note: </strong>
        {ElectronicSignature.NOTE_PARAGRAPH}
      </p>
      <va-card background class="vads-u-margin-bottom--5">
        <h2
          id="signatureTitle"
          className="vads-u-font-size--h3 vads-u-margin-top--1"
        >
          {ElectronicSignature.TITLE}
        </h2>
        <p>{ElectronicSignature.DESCRIPTION}</p>
        <va-text-input
          message-aria-describedby={ElectronicSignature.TITLE}
          label={ElectronicSignature.FULLNAME_LABEL}
          error={nameError}
          onInput={onInput}
          required
        />
        <VaCheckbox
          class="vads-u-width--full"
          error={!checked ? checkboxError : ''}
          label={ElectronicSignature.CHECKBOX_LABEL}
          message-aria-describedby="Electronic signature."
          onVaChange={onChange}
          required
        />
      </va-card>
    </>
  );
};

DigitalSignature.propTypes = {
  checkboxError: PropTypes.string,
  checked: PropTypes.bool,
  nameError: PropTypes.string,
  onChange: PropTypes.func,
  onInput: PropTypes.func,
};

export default DigitalSignature;
