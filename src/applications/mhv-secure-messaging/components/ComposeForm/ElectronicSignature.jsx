import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ElectronicSignatureBox } from '../../util/constants';

const ElectronicSignature = ({
  nameError,
  onInput,
  checkboxError,
  onCheckboxCheck,
  checked,
  electronicSignature,
}) => {
  return (
    <>
      <p id="signatureNote" aria-describedby={ElectronicSignatureBox.TITLE}>
        <strong>Note: </strong>
        {ElectronicSignatureBox.NOTE_PARAGRAPH}
      </p>
      <va-card background class="vads-u-margin-bottom--5">
        <h2
          id="signatureTitle"
          className="vads-u-font-size--h3 vads-u-margin-top--1"
        >
          {ElectronicSignatureBox.TITLE}
        </h2>
        <p>{ElectronicSignatureBox.DESCRIPTION}</p>
        <va-text-input
          message-aria-describedby={ElectronicSignatureBox.TITLE}
          label={ElectronicSignatureBox.FULLNAME_LABEL}
          error={nameError}
          onInput={onInput}
          required
          value={electronicSignature}
        />
        <VaCheckbox
          class="vads-u-width--full"
          error={!checked ? checkboxError : ''}
          label={ElectronicSignatureBox.CHECKBOX_LABEL}
          onVaChange={onCheckboxCheck}
          required
          checked={checked}
        />
      </va-card>
    </>
  );
};

ElectronicSignature.propTypes = {
  checkboxError: PropTypes.string,
  checked: PropTypes.bool,
  electronicSignature: PropTypes.string,
  nameError: PropTypes.string,
  onCheckboxCheck: PropTypes.func,
  onInput: PropTypes.func,
};

export default ElectronicSignature;
