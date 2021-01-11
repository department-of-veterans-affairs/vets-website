import React, { useState } from 'react';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';

const PreSubmitSignature = ({ formData }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [veteranName, setVeteranName] = useState(
    formData?.veteranInfo?.fullName,
  );

  return (
    <article className="vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--3 vads-u-padding-top--1px vads-u-margin-bottom--7">
      <h3>Veteran's statement of truth</h3>
      <p>
        I certify that the income, assets, and expenses I provided on this form
        are correct to the best of my knowledge.
      </p>
      <p>
        I certify that my marital and household compensation has been correctly
        represented.
      </p>
      <label htmlFor="signatureInput">Veteran's full name</label>
      <input
        name="signatureInput"
        type="text"
        value={veteranName}
        onChange={event => setVeteranName(event.target.value)}
      />
      <ErrorableCheckbox
        onValueChange={value => setIsChecked(value)}
        label="I certify the information above is correct and true to the best of my knowledge and belief."
        errorMessage={'Must certify by checking box'}
        required={!isChecked}
      />
    </article>
  );
};
export default {
  required: true,
  CustomComponent: PreSubmitSignature,
};
