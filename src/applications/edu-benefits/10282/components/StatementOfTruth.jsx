import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Checks that the provided signature string matches the existing
 * applicantName in the formData.
 *
 * @param {string} signatureName string we want to check
 * @param {object} formData standard formData object
 * @returns Either a string representing an error, or undefined (representing a match)
 */
// export function signatureValidator(signatureName, formData) {
//   const firstName = formData?.veteranFullName.first || '';
//   const lastName = formData?.veteranFullName.last || '';
//   const fullName = `${firstName} ${lastName}`;
//   const name = fullName
//     .split(' ')
//     .filter(el => el)
//     .join('')
//     .toLowerCase();

//   const processedSignatureName = signatureName
//     .replaceAll(' ', '')
//     .toLowerCase();
//   const processedName = name.replaceAll(' ', '');
//   if (processedSignatureName !== processedName) {
//     return `Please enter your full name exactly as entered on the form: ${fullName}`;
//   }
//   return undefined;
// }

export default function StatementOfTruth() {
  const formData = useSelector(state => state.form.data);
  const [signatureName, setSignatureName] = useState('');
  const [inputError, setInputError] = useState('');
  const [checked, setChecked] = useState(false);

  const handleChange = e => {
    setSignatureName(e.detail.value);
  };

  const handleBlur = () => {
    const firstName = formData?.veteranFullName.first || '';
    const lastName = formData?.veteranFullName.last || '';
    const fullName = `${firstName} ${lastName}`;
    if (signatureName !== fullName) {
      setInputError(
        `Please enter your full name exactly as entered on the form: ${fullName}`,
      );
    } else {
      setInputError('');
    }
  };

  const handleCheckboxChange = e => {
    setChecked(e.detail.checked);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <VaStatementOfTruth
        checkboxError={
          checked
            ? ''
            : 'Please check the box to certify the information is correct'
        }
        checkboxLabel="I certify the information above is correct and true to the best of my knowledge and belief."
        heading="Statement of truth"
        inputError={inputError}
        inputLabel="Your full name"
        inputMessageAriaDescribedby=""
        inputValue={signatureName}
        onVaCheckboxChange={handleCheckboxChange}
        onVaInputBlur={handleBlur}
        onVaInputChange={handleChange}
      >
        I confirm that the identifying information in this form is accurate and
        has been represented correctly.
      </VaStatementOfTruth>
    </div>
  );
}
