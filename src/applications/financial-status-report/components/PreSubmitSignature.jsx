import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import environment from 'platform/utilities/environment';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';

const PreSubmitSignature = ({
  formData,
  showError,
  onSectionComplete,
  formSubmission,
}) => {
  const isSubmitPending = formSubmission.status === 'submitPending';
  const hasSubmit = !!formSubmission.status;
  const { first, middle, last } = formData.personalData.veteranFullName;
  const [certifyChecked, setCertifyChecked] = useState(false);
  const [certifyCheckboxError, setCertifyCheckboxError] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [privacyCheckboxError, setPrivacyCheckboxError] = useState(false);
  const [signatureError, setSignatureError] = useState(false);
  const [signature, setSignature] = useState({
    value: '',
    dirty: false,
  });
  const isDirty = signature.dirty;

  const privacyLabel = (
    <span>
      I have read and accept the
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="vads-u-margin-left--0p5"
        href={`${environment.BASE_URL}/privacy-policy`}
      >
        privacy policy
      </a>
    </span>
  );

  const normalize = string => {
    return string
      .split(' ')
      .join('')
      .toLowerCase();
  };

  // validate input name with name on file
  // signature matching logic is done with spaces removed
  const nameOnFile = normalize(first + middle + last);
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
        setPrivacyCheckboxError(!privacyChecked);
        setSignatureError(!signatureMatches);
      }
    },
    [showError, hasSubmit, certifyChecked, privacyChecked, signatureMatches],
  );

  useEffect(
    () => {
      if (certifyChecked && privacyChecked && isDirty && signatureMatches) {
        onSectionComplete(true);
      }
      return () => {
        onSectionComplete(false);
        setSignatureError(false);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isDirty,
      certifyChecked,
      privacyChecked,
      signatureMatches,
      setSignatureError,
    ],
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
      <p>
        Please click on each of the sections above to review the information you
        entered for this request. Then read and sign the Veteran’s statement of
        truth. The name you enter will serve as your electronic signature for
        this request.
      </p>

      <article className="vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--3 vads-u-padding-top--1px">
        <h3>Veteran’s statement of truth</h3>
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
          name="veteran-signature"
          additionalClass="signature-input"
          label={"Veteran's full name"}
          required
          onValueChange={value => setSignature(value)}
          field={{ value: signature.value, dirty: signature.dirty }}
          errorMessage={
            signatureError &&
            `Please enter your name exactly as it appears on your VA profile: ${first} ${middle} ${last}`
          }
        />

        <Checkbox
          name="veteran-certify"
          checked={certifyChecked}
          onValueChange={value => setCertifyChecked(value)}
          label="By checking this box, I certify that the information in this request is true and correct to the best of my knowledge and belief."
          errorMessage={
            certifyCheckboxError && 'You must certify by checking the box.'
          }
          required
        />
      </article>

      <p>
        <strong>Note: </strong>
        It is a crime to knowingly submit false statements or information that
        could affect our decision on this request. Penalties may include a fine,
        imprisonment, or both.
      </p>

      <Checkbox
        name="privacy-policy"
        className="vads-u-margin-bottom--3"
        checked={privacyChecked}
        onValueChange={value => setPrivacyChecked(value)}
        label={privacyLabel}
        errorMessage={
          privacyCheckboxError && 'You must accept by checking the box.'
        }
        required
      />
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
