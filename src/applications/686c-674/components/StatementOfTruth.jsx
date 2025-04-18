import React from 'react';
import FormSignature from 'platform/forms-system/src/js/components/FormSignature';

export function capitalizeFirstLetter(string) {
  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Checks that the provided signature string matches the existing
 * applicantName in the formData.
 *
 * @param {string} signatureName string we want to check
 * @param {object} formData standard formData object
 * @returns Either a string representing an error, or undefined (representing a match)
 */
export function signatureValidator(signatureName, formData) {
  const firstName = formData?.veteranInformation?.fullName?.first || 'Gregory';
  const middle = formData?.veteranInformation?.fullName?.middle || 'A';
  const lastName = formData?.veteranInformation?.fullName?.last || 'Anderson';

  const fullName = `${firstName} ${middle} ${lastName}`;
  const name = fullName.replace(/\s+/g, '').toLowerCase();
  const input = signatureName?.replace(/\s+/g, '').toLowerCase();

  if (input !== name) {
    return `Please enter your full name exactly as entered on the form: ${capitalizeFirstLetter(
      fullName,
    )}`;
  }

  return undefined;
}

export default function StatementOfTruth(signatureProps) {
  const pp = (
    <span>
      I have read and accept the{' '}
      <va-link external href="/privacy-policy/" text="privacy policy" />
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
    <div>
      <div className="vads-u-margin-y--1p5">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information. (See 18
        U.S.C. 1001)
      </div>
      <section className="box vads-u-background-color--gray-lightest vads-u-padding--3">
        <h3 className="vads-u-padding--0 vads-u-margin-top--0">
          Statement of truth
        </h3>
        {content}
        <FormSignature
          {...signatureProps}
          formData={signatureProps?.formData}
          signatureLabel="Your full name"
          validations={validators}
          className="signature"
        />
      </section>
    </div>
  );
}
