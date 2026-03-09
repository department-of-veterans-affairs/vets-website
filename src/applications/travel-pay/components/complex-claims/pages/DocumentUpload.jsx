import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { ACCEPTED_FILE_TYPES } from '../../../constants';

const DocumentUpload = ({
  currentDocument,
  error,
  handleDocumentChange,
  onVaFileInputError,
  label = 'Upload your proof of the expense',
  additionalHint,
}) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const heicConversionEnabled = useToggleValue(
    TOGGLE_NAMES.travelPayEnableHeicConversion,
  );

  const acceptedFileTypes = useMemo(
    () => {
      const types = [...ACCEPTED_FILE_TYPES];
      if (heicConversionEnabled) {
        types.push('.heic', '.heif');
      }
      return types;
    },
    [heicConversionEnabled],
  );

  const joinedTypes = acceptedFileTypes
    .join(', ')
    .replace(/, ([^,]*)$/, ', or $1');

  const fileTypesHint = `Make sure your file is no larger than 5MB and is a ${joinedTypes} file.`;
  const renameHint = `Note that we\u2019ll rename your file \u201cproof-of-attendance\u201d.`;

  const defaultHint = `You can upload a ${joinedTypes} file. Your file should be no larger than 5MB.`;

  const fileInputRef = useRef(null);

  const injectHintBullets = useCallback(
    () => {
      const el = fileInputRef.current;
      if (!el || !el.shadowRoot) return;
      const hintDiv = el.shadowRoot.querySelector('#input-hint-message');
      if (!hintDiv) return;
      hintDiv.innerHTML = '';
      const ul = document.createElement('ul');
      ul.style.margin = '0';
      ul.style.paddingLeft = '1.5rem';
      const li1 = document.createElement('li');
      li1.textContent = fileTypesHint;
      const li2 = document.createElement('li');
      li2.textContent = renameHint;
      ul.appendChild(li1);
      ul.appendChild(li2);
      hintDiv.appendChild(ul);
    },
    [fileTypesHint, renameHint],
  );

  useEffect(
    () => {
      if (!additionalHint) return undefined;
      const id = setTimeout(injectHintBullets, 0);
      return () => clearTimeout(id);
    },
    [additionalHint, injectHintBullets],
  );

  // Re-inject when error changes because the component re-renders its shadow DOM
  useEffect(
    () => {
      if (!additionalHint) return undefined;
      const id = setTimeout(injectHintBullets, 0);
      return () => clearTimeout(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [error],
  );

  return (
    <>
      <VaFileInput
        ref={fileInputRef}
        accept={acceptedFileTypes.join(',')}
        hint={additionalHint ? ' ' : defaultHint}
        label={label}
        maxFileSize={5200000}
        minFileSize={0}
        name="travel-pay-claim-document-upload"
        onVaChange={handleDocumentChange}
        onVaFileInputError={onVaFileInputError}
        required
        error={error}
        value={currentDocument}
      />

      <va-additional-info trigger="How to upload paper copies">
        <p>
          If you only have a paper copy, scan or take a photo and upload the
          image.
        </p>
      </va-additional-info>
    </>
  );
};

DocumentUpload.propTypes = {
  additionalHint: PropTypes.bool,
  currentDocument: PropTypes.object,
  error: PropTypes.string,
  handleDocumentChange: PropTypes.func,
  label: PropTypes.string,
  onVaFileInputError: PropTypes.func,
};

export default DocumentUpload;
