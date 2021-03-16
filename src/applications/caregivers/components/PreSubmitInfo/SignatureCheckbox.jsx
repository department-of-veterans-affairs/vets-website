import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

import SignatureInput from './SignatureInput';

const SignatureCheckbox = ({
  children,
  fullName,
  isRequired,
  label,
  setSignature,
  showError,
  globalFormState,
}) => {
  const [hasError, setError] = useState(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const isSignatureComplete = isSigned && isChecked;
  const hasSubmit = !!globalFormState.submission.status;
  const createInputContent = inputLabel => `Enter ${inputLabel} full name`;

  useEffect(
    () => {
      setSignature(prevState => {
        return { ...prevState, [label]: isSignatureComplete };
      });
    },

    [isSignatureComplete, label, setSignature],
  );

  useEffect(
    () => {
      setError(showError);

      if (isChecked === true || hasSubmit) setError(false);
    },
    [showError, setIsChecked, isChecked, hasSubmit],
  );

  return (
    <article
      data-testid={label}
      className="vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--3 vads-u-padding-top--1px vads-u-margin-bottom--7"
    >
      {children && <header>{children}</header>}

      <SignatureInput
        setIsSigned={setIsSigned}
        label={createInputContent(label)}
        fullName={fullName}
        required={isRequired}
        showError={showError}
        hasSubmit={hasSubmit}
      />

      <Checkbox
        onValueChange={value => setIsChecked(value)}
        label="I certify the information above is correct and true to the best of my knowledge and belief."
        errorMessage={hasError && 'Must certify by checking box'}
        required={isRequired}
      />
    </article>
  );
};

SignatureCheckbox.propTypes = {
  children: PropTypes.any,
  fullName: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  label: PropTypes.string.isRequired,
  setSignature: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  signatures: PropTypes.object.isRequired,
  globalFormState: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    globalFormState: state.form,
  };
};

export default connect(
  mapStateToProps,
  null,
)(SignatureCheckbox);
