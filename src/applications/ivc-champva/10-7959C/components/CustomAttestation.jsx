import React from 'react';
import FormSignature from 'platform/forms-system/src/js/components/FormSignature';
import get from 'platform/utilities/data/get';
import { nameWording } from '../helpers/utilities';

/*
Custom attestation/signature/statement of truth component.
Had to make this because we want to collect a signature that either:
1. Matches the beneficiary name provided
OR
2. Does not match existing string, but has extra messaging indicating
   the third party is signing on behalf of the beneficiary. (This
   case is triggered when user selects that they are not the beneficiary)

Couldn't use the default because that provided no way to have the
signature field and NOT check that it matched a previously entered string.
*/

/**
 * Checks that the provided signature string matches the existing
 * applicantName in the formData.
 *
 * @param {string} signatureName string we want to check
 * @param {object} formData standard formData object
 * @returns Either a string representing an error, or undefined (representing a match)
 */
function signatureValidator(signatureName, formData) {
  const name = Object.values(formData?.applicantName || { empty: '' })
    .filter(el => el)
    .join('')
    .toLowerCase();
  if (signatureName.replaceAll(' ', '').toLowerCase() !== name) {
    return `Please enter your full name exactly as entered on the form: ${nameWording(
      { ...formData, certifierRole: '' },
      false,
    )}`;
  }
  return undefined;
}

export default function CustomAttestation(signatureProps) {
  const { formData } = signatureProps;
  const isBeneficiary = get('certifierRole', formData) === 'applicant';

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

  const content = isBeneficiary ? (
    <>
      {isCorrect}
      {pp}
    </>
  ) : (
    <>
      {isCorrect}
      {pp}
      <p>
        On behalf of:
        <br />
        <b>{nameWording(formData, false)}</b>
      </p>
    </>
  );

  const sigLabel = isBeneficiary
    ? 'Your full name'
    : 'Enter your full name to sign as the beneficiary’s representative';

  const validators = isBeneficiary ? [signatureValidator] : [];

  return (
    <>
      <p className="vads-u-padding-x--3 vads-u-margin-y--1">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information
        (Reference: 18 U.S.C. 1001).
      </p>
      <section className="box vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--3 vads-u-padding-top--1px vads-u-margin-bottom--7">
        <h3>
          {formData?.certifierRole !== 'applicant' ? 'Representative’s ' : ''}
          Statement of truth
        </h3>
        {content}
        <FormSignature
          {...signatureProps}
          signatureLabel={sigLabel}
          validations={validators}
        />
      </section>
    </>
  );
}
