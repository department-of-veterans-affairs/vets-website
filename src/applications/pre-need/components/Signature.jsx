import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  VaCheckbox,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const Signature = ({ formData, signatureKey, certifiedKey, label }) => {
  const [signature, setSignature] = useState(formData[signatureKey] || null);
  const [certified, setCertified] = useState(formData[certifiedKey] || null);
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (signature || certified) {
        const updatedFormData = {
          ...formData,
          [signatureKey]: signature,
          [certifiedKey]: certified,
        };

        dispatch(setData(updatedFormData));
      }
    },
    [signature, certified],
  );

  return (
    <article className="vads-u-background-color--gray-lightest vads-u-padding-bottom--3 vads-u-padding-x--3 vads-u-padding-top--1px vads-u-margin-bottom--3">
      <h3>{label}</h3>
      <p>
        I have read and accept the{' '}
        <va-link href="/privacy-policy/" text="privacy policy" />.
      </p>
      <VaTextInput
        id={`${signatureKey}-signature`}
        name={`${signatureKey}-signature`}
        label="Your full name"
        class="signature-input"
        value={signature}
        onInput={event => setSignature(event.target.value)}
        type="text"
      />
      <VaCheckbox
        id={`${certifiedKey}-certify`}
        name={`${certifiedKey}-certify`}
        label="I certify the information above is correct and true to the best of my knowledge and belief."
        checked={certified}
        onVaChange={event => setCertified(event.target.checked)}
        className="statement-of-truth-va-checkbox"
        required
      />
    </article>
  );
};

export default Signature;
