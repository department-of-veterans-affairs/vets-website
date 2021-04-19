import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

const PreSubmitSignature = ({
  formData,
  showError,
  onSectionComplete,
  formSubmission,
}) => {
  const fullName = formData.personalData.veteranFullName;
  const hasSubmit = !!formSubmission.status;
  const firstName = fullName.first?.toLowerCase() || '';
  const lastName = fullName.last?.toLowerCase() || '';
  const middleName = fullName.middle?.toLowerCase() || '';
  const [checked, setChecked] = useState(false);
  const [signatureError, setSignatureError] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [signature, setSignature] = useState({
    value: '',
    dirty: false,
  });

  const firstLetterOfMiddleName =
    middleName === undefined ? '' : middleName.charAt(0);

  const removeSpaces = string =>
    string
      .split(' ')
      .join('')
      .toLocaleLowerCase();

  const getName = (middle = '') =>
    removeSpaces(`${firstName}${middle}${lastName}`);

  const normalizedSignature = removeSpaces(signature.value);

  // first and last
  const firstAndLastMatches = getName() === normalizedSignature;

  // middle initial
  const middleInitialMatches =
    getName(firstLetterOfMiddleName) === normalizedSignature;

  // middle name
  const withMiddleNameMatches = getName(middleName) === normalizedSignature;

  const signatureMatches =
    firstAndLastMatches || middleInitialMatches || withMiddleNameMatches;

  useEffect(
    () => {
      const isDirty = signature.dirty;

      /* show error if user has touched input and signature does not match
           show error if there is a form error and has not been submitted */
      if ((isDirty && !signatureMatches) || (showError && !hasSubmit)) {
        setSignatureError(true);
      }

      /* if input has been touched and signature matches allow submission
           if input is dirty and representative is signing skip validation and make sure signature is present
           all signature matching logic is with spaces removed
        */

      if (isDirty && signatureMatches) {
        setSignatureError(false);
      }
    },
    [
      signature.dirty,
      signatureMatches,
      showError,
      hasSubmit,
      normalizedSignature,
    ],
  );

  useEffect(
    () => {
      if (showError && !checked) {
        setCheckboxError(true);
      } else {
        setCheckboxError(false);
      }

      if (showError && !signatureMatches) {
        setSignatureError(true);
      } else {
        setSignatureError(false);
      }
    },
    [checked, showError, signatureError, signatureMatches],
  );

  useEffect(
    () => {
      if (checked && signatureMatches) {
        onSectionComplete(true);
      }

      return () => onSectionComplete(false);
    },
    [checked, signatureMatches],
  );

  if (hasSubmit) {
    return <LoadingIndicator message="Loading your application..." />;
  }

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

        <TextInput
          additionalClass="signature-input"
          label={"Veteran's full name"}
          required
          onValueChange={value => setSignature(value)}
          field={{ value: signature.value, dirty: signature.dirty }}
          errorMessage={signatureError && 'Your signature must match.'}
        />

        <Checkbox
          checked={checked}
          onValueChange={value => setChecked(value)}
          label="By checking this box, I certify that the information in this request is true and correct to the best of my knowledge and belief."
          errorMessage={checkboxError && 'Must certify by checking box'}
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

const mapStateToProps = state => {
  return {
    formSubmission: state.form.submission,
  };
};

export default {
  required: true,
  CustomComponent: connect(
    mapStateToProps,
    null,
  )(PreSubmitSignature),
};
