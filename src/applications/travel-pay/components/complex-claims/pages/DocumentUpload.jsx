import React, { useMemo, useEffect, useRef } from 'react';
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

  const fileTypesHint = `Make sure your file is no larger than 5MB and is a ${joinedTypes} file`;
  const renameHint = `Note that we'll rename your file "proof-of-attendance"`;

  const defaultHint = `You can upload a ${joinedTypes} file. Your file should be no larger than 5MB.`;

  const fileInputRef = useRef(null);

  useEffect(
    () => {
      if (!additionalHint) return undefined;

      const el = fileInputRef.current;
      if (!el) return undefined;

      const hintHTML = `<ul style="margin:0;padding-left:1.5rem"><li>${fileTypesHint}</li><li>${renameHint}</li></ul>`;

      const inject = root => {
        const hintDiv = root.querySelector('#input-hint-message');
        if (!hintDiv) return false;
        hintDiv.innerHTML = hintHTML;
        return true;
      };

      const watchAndInject = root => {
        if (inject(root)) return null;
        const observer = new MutationObserver(() => {
          if (inject(root)) observer.disconnect();
        });
        observer.observe(root, { childList: true, subtree: true });
        return observer;
      };

      let observer;
      if (el.shadowRoot) {
        observer = watchAndInject(el.shadowRoot);
      } else {
        const hostObserver = new MutationObserver(() => {
          if (el.shadowRoot) {
            hostObserver.disconnect();
            observer = watchAndInject(el.shadowRoot);
          }
        });
        hostObserver.observe(el, { childList: true });
        return () => hostObserver.disconnect();
      }

      return () => observer && observer.disconnect();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [additionalHint, fileTypesHint, renameHint, error],
  );

  return (
    <>
      <VaFileInput
        ref={fileInputRef}
        accept={acceptedFileTypes.join(',')}
        hint={additionalHint ? fileTypesHint : defaultHint}
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
