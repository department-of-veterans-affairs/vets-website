import React, { useState, useEffect, useCallback } from 'react';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';

const PreSubmitSignature = ({ formData, showError }) => {
  const [checked, setChecked] = useState(false);
  const [signatureError, setSignatureError] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [veteranName, setVeteranName] = useState({
    value: '',
  });

  const getName = useCallback(
    () => {
      const { veteranFullName } = formData.personalData;
      return Object.values(veteranFullName)
        .filter(value => Boolean(value))
        .join(' ');
    },
    [formData.personalData],
  );

  useEffect(
    () => {
      if (!formData.personalData) return;
      const nameOnFile = getName();
      setVeteranName({
        value: nameOnFile,
      });
    },
    [getName, formData.personalData],
  );

  useEffect(
    () => {
      const nameOnFile = getName();
      if (veteranName.value !== nameOnFile) {
        setSignatureError(true);
      } else {
        setSignatureError(false);
      }
    },
    [getName, veteranName],
  );

  useEffect(
    () => {
      if (showError && !checked) {
        setCheckboxError(true);
      } else {
        setCheckboxError(false);
      }
    },
    [checked, showError],
  );

  return (
    <>
      <p>
        Please click on each of the sections above to review the information you
        entered for this request. Then read and sign the Veteran’s statement of
        truth. The name you enter will serve as your electronic signature for
        this request.
      </p>
      <article className="vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--3 vads-u-padding-top--1px">
        <h3>Veteran's statement of truth</h3>
        <p>
          I’ve reviewed the information I provided in this request, including:
        </p>
        <ul>
          <li>My marital status and number of dependents</li>
          <li>My income (and my spouse’s income if included)</li>
          <li>My household assets and expenses</li>
          <li>My bankruptcy history</li>
        </ul>

        <TextInput
          additionalClass="signature-input"
          label={"Veteran's full name"}
          required
          onValueChange={value => setVeteranName(value)}
          field={{ value: veteranName.value }}
          errorMessage={signatureError && 'Your signature must match.'}
        />

        <Checkbox
          checked={checked}
          onValueChange={value => setChecked(value)}
          label="By checking this box, I certify that the information in this request is true and correct to the best of my knowledge and belief."
          errorMessage={checkboxError && 'Must certify by checking box'}
          required
        />
      </article>
      <p>
        <strong>Note: </strong>
        It is a crime to knowingly submit false statements or information that
        could affect our decision on this request. Penalties may include a fine,
        imprisonment, or both.
      </p>
    </>
  );
};
export default {
  required: false,
  CustomComponent: PreSubmitSignature,
};
