import React, { useState, useEffect } from 'react';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

const PreSubmitSignature = ({ formData }) => {
  const [isChecked, setIsChecked] = useState(false);
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

  return (
    <>
      <p>
        Please review information entered into this request and sign the
        statement below. Your entries provided below will serve as your
        electronic signature for the form.
      </p>
      <article className="vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--3 vads-u-padding-top--1px vads-u-margin-bottom--7">
        <h3>Veteran's statement of truth</h3>
        <p>
          I certify that the income, assets, and expenses I provided on this
          form are correct to the best of my knowledge.
        </p>
        <p>
          I certify that my marital and household compensation has been
          correctly represented.
        </p>
        <label htmlFor="signatureInput">Veteran's full name</label>
        <input
          name="signatureInput"
          type="text"
          value={veteranName}
          onChange={event => setVeteranName(event.target.value)}
        />
        <Checkbox
          checked={isChecked}
          onValueChange={value => setIsChecked(value)}
          label="I certify the information above is correct and true to the best of my knowledge and belief."
          errorMessage={'Must certify by checking box'}
          required
        />
      </article>
      <p>
        <strong>Note: </strong> The law provides severe penalties which include
        fine or imprisonment, or both, for the willful submission of any
        statement or evidence of a material fact, knowing it to be false.
      </p>
    </>
  );
};
export default {
  required: true,
  CustomComponent: PreSubmitSignature,
};
