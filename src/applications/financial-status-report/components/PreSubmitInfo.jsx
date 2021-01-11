import React from 'react';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
const PreSubmitInfo = () => {
  const onChange = value => {
    return null;
  };
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
      <ErrorableCheckbox
        onValueChange={value => onChange(value)}
        label="I certify the information above is correct and true to the best of my knowledge and belief."
        errorMessage={'Must certify by checking box'}
        required={true}
      />
    </article>
  );
};
export default {
  required: true,
  CustomComponent: PreSubmitInfo,
};
