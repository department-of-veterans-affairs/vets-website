import React from 'react';
import FormSignature from 'platform/forms-system/src/js/components/FormSignature';
/**
 * Checks that the provided signature string matches the existing
 * applicantName in the formData.
 *
 * @param {string} signatureName string we want to check
 * @param {object} formData standard formData object
 * @returns Either a string representing an error, or undefined (representing a match)
 */
export function signatureValidator(signatureName, formData) {
  const fullNmae = `${formData?.veteranFullName.first} ${
    formData?.veteranFullName.last
  }`;
  const name = Object.values(fullNmae || { empty: '' })
    .filter(el => el)
    .join('')
    .toLowerCase();

  const processedSignatureName = signatureName
    .replaceAll(' ', '')
    .toLowerCase();
  const processedName = name.replaceAll(' ', '');

  if (processedSignatureName !== processedName) {
    return `Please enter your full name exactly as entered on the form:`;
  }
  return undefined;
}

export default function StatementOfTruth(signatureProps) {
  const pp = (
    <span>
      I have read and accept the{' '}
      <a target="_blank" href="/privacy-policy/">
        privacy policy
        <va-icon icon="launch" size={3} />
      </a>
    </span>
  );

  const isCorrect = (
    <p>
      I confirm that the identifying information in this form is accurate and
      has been represented correctly.
    </p>
  );

  const content = (
    <>
      {isCorrect}
      {pp}
    </>
  );

  const validators = [signatureValidator];

  return (
    <div className="vads-u-margin-top--3">
      <section className="box vads-u-background-color--gray-lightest vads-u-padding--3">
        <h3 className="vads-u-margin-top--0">Statement of truth</h3>
        {content}
        <FormSignature
          {...signatureProps}
          signatureLabel="Your full name"
          validations={validators}
        />
      </section>
    </div>
  );
}
