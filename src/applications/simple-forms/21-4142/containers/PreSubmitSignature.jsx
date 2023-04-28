import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

const PreSubmitSignature = ({
  formData,
  showError,
  onSectionComplete,
  formSubmission,
}) => {
  const isSubmitPending = formSubmission.status === 'submitPending';
  const hasSubmit = !!formSubmission.status;
  const [nameOfSigner, setNameOfSigner] = useState(
    formData.preparerIdentification?.preparerFullName,
  );
  const [certifyChecked, setCertifyChecked] = useState(false);
  const [certifyCheckboxError, setCertifyCheckboxError] = useState(false);
  const [signatureError, setSignatureError] = useState(false);
  const [signature, setSignature] = useState({
    value: '',
    dirty: false,
  });
  const isDirty = signature.dirty;

  const legalText =
    'I certify that the identifying information in this form has been correctly represented.';

  const setNewSignature = event => {
    setSignature({ value: event.target.value, dirty: true });
  };

  const normalize = string => {
    if (!string) {
      return '';
    }

    return string
      .split(' ')
      .join('')
      .toLowerCase();
  };

  // validate input name with name on file
  // signature matching logic is done with spaces removed
  const nameOnFile =
    normalize(nameOfSigner?.first) +
    normalize(nameOfSigner?.middle) +
    normalize(nameOfSigner?.last);
  const inputValue = normalize(signature.value);
  const signatureMatches = !!nameOnFile && nameOnFile === inputValue;

  useEffect(
    () => {
      // show error if user has touched input and signature does not match
      // show error if there is a form error and has not been submitted
      if ((isDirty && !signatureMatches) || (showError && !hasSubmit)) {
        setSignatureError(true);
      }

      // if input has been touched and signature matches allow submission
      // if input is dirty and representative is signing skip validation
      // make sure signature is not undefined
      if (isDirty && signatureMatches) {
        setSignatureError(false);
      }
    },
    [showError, hasSubmit, isDirty, signature.dirty, signatureMatches],
  );

  useEffect(
    () => {
      if (showError && !hasSubmit) {
        setCertifyCheckboxError(!certifyChecked);
        setSignatureError(!signatureMatches);
      }
    },
    [showError, hasSubmit, certifyChecked, signatureMatches],
  );

  useEffect(
    () => {
      if (certifyChecked && isDirty && signatureMatches) {
        onSectionComplete(true);
      }
      return () => {
        onSectionComplete(false);
        setSignatureError(false);
      };
    },
    [isDirty, certifyChecked, signatureMatches, setSignatureError],
  );

  useEffect(
    () => {
      const preparerNameDefined =
        formData.preparerIdentification?.preparerFullName?.first &&
        formData.preparerIdentification?.preparerFullName?.last;
      setNameOfSigner(
        preparerNameDefined
          ? formData.preparerIdentification.preparerFullName
          : formData.veteran.fullName,
      );
    },
    [formData],
  );

  if (isSubmitPending) {
    return (
      <div className="vads-u-margin-bottom--3">
        <va-loading-indicator
          label="Loading"
          message="We’re processing your application."
        />
      </div>
    );
  }

  return (
    <>
      <p className="vads-u-padding-x--3">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information (See 18
        U.S.C. 1001).
      </p>
      <article className="vads-u-background-color--gray-lightest vads-u-padding-bottom--3 vads-u-padding-x--3 vads-u-padding-top--1px vads-u-margin-bottom--3">
        <h3>Statement of truth</h3>
        <p>{legalText}</p>
        <p>
          I have read and accept the{' '}
          <a
            aria-label="Privacy policy, will open in new tab"
            target="_blank"
            href="/privacy-policy/"
          >
            privacy policy
          </a>
          .
        </p>

        <va-text-input
          label="Your full name"
          class="signature-input"
          id="veteran-signature"
          name="veteran-signature"
          onInput={setNewSignature}
          type="text"
          required
          error={
            signatureError
              ? `Please enter your name exactly as it appears on your application: ${
                  nameOfSigner?.first
                } ${nameOfSigner?.middle ? `${nameOfSigner?.middle} ` : ''}${
                  nameOfSigner?.last
                }`
              : ''
          }
          message-aria-describedby={`Statement of Truth: ${legalText}`}
        />

        <Checkbox
          name="veteran-certify"
          checked={certifyChecked}
          onValueChange={value => setCertifyChecked(value)}
          label="I certify the information above is correct and true to the best of my knowledge and belief."
          errorMessage={
            certifyCheckboxError && 'You must certify by checking the box.'
          }
          required
        />
      </article>
    </>
  );
};

PreSubmitSignature.propTypes = {
  formData: PropTypes.object,
  formSubmission: PropTypes.object,
  showError: PropTypes.bool,
  onSectionComplete: PropTypes.func,
};

const mapStateToProps = ({ form }) => {
  return {
    formSubmission: form.submission,
  };
};

export default {
  required: true,
  CustomComponent: connect(
    mapStateToProps,
    null,
  )(PreSubmitSignature),
};
