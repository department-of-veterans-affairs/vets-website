import React, { useState, useEffect } from 'react';

import FormSignature from './FormSignature';
import FormSignatureCheckbox from './FormSignatureCheckbox';

export default function StatementOfTruth(signatureProps) {
  const [checked, setChecked] = useState(
    signatureProps?.formData?.AGREED ?? false,
  );
  const [signature, setSignature] = useState({
    value: signatureProps?.formData?.signature ?? '', // Pre-populate with existing signature if available
    dirty: signatureProps?.formData?.signature?.length > 0, // will be dirty if any prev signature is present
  });
  const [signatureOfficialTitle, setSignatureOfficialTitle] = useState({
    value: signatureProps?.formData?.signatureOfficialTitle ?? '',
    dirty: signatureProps?.formData?.signatureOfficialTitle?.length > 0,
  });

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

  return (
    <>
      <div className="vads-u-margin-top--6 vads-u-margin-left--2p5">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information.
        (Reference: 18 U.S.C. 1001).
      </div>
      <div className="vads-u-margin-top--8">
        <section className="box vads-u-background-color--gray-lightest vads-u-padding--3">
          <h3 className="vads-u-margin-top--0">Certification statement</h3>
          {content}
          <FormSignature
            signature={signature}
            setSignature={setSignature}
            signatureLabel="Your full name"
            signatureError={signatureError}
            setSignatureError={setSignatureError}
            {...signatureProps}
          />
          <FormSignature
            signature={signatureOfficialTitle}
            setSignature={setSignatureOfficialTitle}
            signatureLabel="Your school official title"
            signatureError={signatureOfficialTitleError}
            setSignatureError={setSignatureOfficialTitleError}
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
    </>
  );
}
