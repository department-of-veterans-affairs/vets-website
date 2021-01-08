import React from 'react';
import { connect } from 'react-redux';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
const PreSubmitInfo = () => {
  onChange = value => {
    return null;
  };
  return (
    <article className="vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--3 vads-u-padding-top--1px vads-u-margin-bottom--7">
      <header>Veteran's statement of truth</header>
      <p>
        I certify that the income, assets, and expenses I provided on this form
        are correct to the best of my knowledge.
      </p>
      <p>
        I certify that my marital and household compensation has been correctly
        represented.
      </p>
      <ErrorableCheckbox
        onValueChange={value => setIsChecked(value)}
        label="I certify the information above is correct and true to the best of my knowledge and belief."
        errorMessage={hasError && 'Must certify by checking box'}
        required={true}
      />
    </article>
  );
};
export default connect(
  null,
  null,
)(PreSubmitInfo);
