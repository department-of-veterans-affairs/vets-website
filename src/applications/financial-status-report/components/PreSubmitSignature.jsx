import React, { useState, useEffect } from 'react';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

const PreSubmitSignature = ({ formData, showError }) => {
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(false);
  const [veteranName, setVeteranName] = useState('');

  useEffect(
    () => {
      if (!formData.personalData) return;
      const { fullName } = formData.personalData;
      const name = Object.values(fullName)
        .filter(value => Boolean(value))
        .join(' ');
      setVeteranName(name);
    },
    [formData.personalData],
  );

  useEffect(
    () => {
      if (showError && !checked) {
        setError(true);
      } else {
        setError(false);
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
        <label htmlFor="signatureInput">Veteran's full name</label>
        <input
          name="signatureInput"
          type="text"
          value={veteranName}
          onChange={e => setVeteranName(e.target.value)}
        />
        <Checkbox
          checked={checked}
          onValueChange={value => setChecked(value)}
          label="By checking this box, I certify that the information in this request is true and correct to the best of my knowledge and belief."
          errorMessage={error && 'Must certify by checking box'}
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
  required: true,
  CustomComponent: PreSubmitSignature,
};
