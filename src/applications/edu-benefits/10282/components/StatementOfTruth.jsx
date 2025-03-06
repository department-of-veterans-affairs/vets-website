import React from 'react';
import FormSignature from 'platform/forms-system/src/js/components/FormSignature';
import { capitalizeFirstLetter } from '../../utils/helpers';
/**
 * Checks that the provided signature string matches the existing
 * applicantName in the formData.
 *
 * @param {string} signatureName string we want to check
 * @param {object} formData standard formData object
 * @returns Either a string representing an error, or undefined (representing a match)
 */
export function signatureValidator(signatureName, formData) {
  const firstName = formData?.veteranFullName.first || '';
  const middle = formData?.veteranFullName.middle || '';
  const lastName = formData?.veteranFullName.last || '';
  const fullName = `${firstName} ${middle} ${lastName}`;
  const name =
    Object.values(fullName)
      .filter(el => el)
      .join('')
      .toLowerCase() || '';

  const processedSignatureName = signatureName
    .replaceAll(' ', '')
    .toLowerCase();
  const processedName = name.replaceAll(' ', '');
  if (processedSignatureName !== processedName) {
    return `Please enter your full name exactly as entered on the form: ${capitalizeFirstLetter(
      name,
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
    <div className="vads-u-margin-top--3">
      <section className="box vads-u-background-color--gray-lightest vads-u-padding--3">
        <p className="vads-u-margin-top--1">
          <strong>Note:</strong> According to federal law, there are criminal
          penalties, including a fine and/or imprisonment for up to 5 years, for
          withholding information or for providing incorrect information (See 18
          U.S.C. 1001).
        </p>
        <h3 className="vads-u-padding-top--1">Certification statement</h3>
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
