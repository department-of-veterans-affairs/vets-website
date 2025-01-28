import React, { useState, useEffect } from 'react';
// import FormSignature from 'platform/forms-system/src/js/components/FormSignature';

import FormSignature from './FormSignature';
import FormSignatureCheckbox from './FormSignatureCheckbox';

export default function StatementOfTruth(signatureProps) {
  // Input states
  const [checked, setChecked] = useState(
    signatureProps?.formData?.AGREED ?? false,
  );
  const [signature, setSignature] = useState({
    value: signatureProps?.formData?.signature ?? '', // Pre-populate with existing signature if available
    dirty: signatureProps?.formData?.signature?.length > 0, // will be dirty if any prev signature is present
  });
  const [signatureOfficialTitle, setSignatureOfficialTitle] = useState({
    value: signatureProps?.formData?.signatureOfficialTitle ?? '', // Pre-populate with existing signature if available
    dirty: signatureProps?.formData?.signatureOfficialTitle?.length > 0, // will be dirty if any prev signature is present
  });

  // Validation states
  const [signatureError, setSignatureError] = useState(null);
  const [
    signatureOfficialTitleError,
    setSignatureOfficialTitleError,
  ] = useState(null);

  // Section complete state (so callback isn't called too many times)
  const [sectionComplete, setSectionComplete] = useState(false);

  // Call onCompleteSection with true or false when switching between valid
  // and invalid states respectively
  useEffect(
    () => {
      const isComplete =
        checked && !signatureError && !signatureOfficialTitleError;
      if (sectionComplete !== isComplete) {
        setSectionComplete(isComplete);
        signatureProps?.onSectionComplete(isComplete);
      }
    },
    [
      checked,
      signatureError,
      signatureOfficialTitleError,
      sectionComplete,
      signatureProps?.onSectionComplete,
    ],
  );

  const pp = (
    <span>
      I have read and accept the{' '}
      <va-link external href="/privacy-policy/" text="privacy policy" />
    </span>
  );

  const isCorrect = (
    <p>
      I hereby certify that the calculations above are true and correct in
      content and policy.
    </p>
  );

  const content = (
    <>
      {isCorrect}
      {pp}
    </>
  );

  // const validators = [signatureValidator];

  return (
    <div className="vads-u-margin-top--3">
      <section className="box vads-u-background-color--gray-lightest vads-u-padding--3">
        <h3 className="vads-u-margin-top--0">Statement of truth</h3>
        {content}
        <FormSignature
          signature={signature}
          setSignature={setSignature}
          signatureLabel="Your full name"
          signatureError={signatureError}
          setSignatureError={setSignatureError}
          // validations={validators}
          {...signatureProps}
        />
        <FormSignature
          signature={signatureOfficialTitle}
          setSignature={setSignatureOfficialTitle}
          signatureLabel="Your school official title"
          signatureError={signatureOfficialTitleError}
          setSignatureError={setSignatureOfficialTitleError}
          // validations={validators}
          signaturePath="signatureOfficialTitle"
          requiredErrorMessage="Please enter your school official title"
          {...signatureProps}
        />
        <FormSignatureCheckbox
          checked={checked}
          setChecked={setChecked}
          {...signatureProps}
        />
      </section>
    </div>
  );
}
