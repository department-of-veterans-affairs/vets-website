import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { Toggler } from '~/platform/utilities/feature-toggles';

import {
  VaModal,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  checkIsEncryptedPdf,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';

import {
  validateIfDirty,
  isValidFile,
  isValidDocument,
  isValidFileSize,
  isEmptyFileSize,
  isValidFileType,
  isPdf,
  MAX_FILE_SIZE_MB,
  MAX_PDF_SIZE_MB,
} from '../../utils/validations';
import UploadStatus from '../UploadStatus';
import mailMessage from '../MailMessage';
import FileInputMultiple from './FileInputMultiple';

export default function AddFilesForm({
  field,
  files,
  onAddFile,
  onCancel,
  onDirtyFields,
  onFieldChange,
  onSubmit,
  mockReadAndCheckFile,
  progress,
  uploading,
  fileTab,
}) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [canShowUploadModal, setCanShowUploadModal] = useState(false);

  const getErrorMessage = useCallback(
    () => {
      if (errorMessage) return errorMessage;

      return validateIfDirty(field, () => files.length > 0)
        ? undefined
        : 'Please select a file first';
    },
    [errorMessage, field, files.length],
  );

  const handleDocTypeChange = useCallback(
    (docType, index) => {
      onFieldChange(`files[${index}].docType`, { value: docType, dirty: true });
    },
    [onFieldChange],
  );

  const add = useCallback(
    async newFiles => {
      const file = newFiles[0];
      const extraData = {};
      const hasPdfSizeLimit = isPdf(file);

      if (isValidFile(file)) {
        const checks = { checkTypeAndExtensionMatches, checkIsEncryptedPdf };
        const checkResults = mockReadAndCheckFile
          ? mockReadAndCheckFile()
          : await readAndCheckFile(file, checks);

        if (!checkResults.checkTypeAndExtensionMatches) {
          setErrorMessage(FILE_TYPE_MISMATCH_ERROR);
          return;
        }

        if (file.name?.toLowerCase().endsWith('pdf')) {
          extraData.isEncrypted = checkResults.checkIsEncryptedPdf;
        }

        setErrorMessage(null);
        onAddFile([file], extraData);
      } else if (!isValidFileType(file)) {
        setErrorMessage('Please choose a file from one of the accepted types.');
      } else if (!isValidFileSize(file)) {
        const maxSize = hasPdfSizeLimit ? MAX_PDF_SIZE_MB : MAX_FILE_SIZE_MB;
        setErrorMessage(
          `The file you selected is larger than the ${maxSize}MB maximum file size and could not be added.`,
        );
      } else if (isEmptyFileSize(file)) {
        setErrorMessage(
          'The file you selected is empty. Files uploaded must be larger than 0B.',
        );
      }
    },
    [mockReadAndCheckFile, onAddFile],
  );

  const submit = useCallback(
    () => {
      const hasPasswords = files.every(
        f => !f.isEncrypted || (f.isEncrypted && f.password.value),
      );

      if (files.length > 0 && files.every(isValidDocument) && hasPasswords) {
        setCanShowUploadModal(true);
        onSubmit();
      } else {
        onDirtyFields();
      }
    },
    [files, onSubmit, onDirtyFields],
  );

  const showUploadModal = uploading && canShowUploadModal;

  return (
    <>
      <div className="add-files-form">
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstFriendlyEvidenceRequests}>
          <Toggler.Enabled>
            {!fileTab && (
              <>
                <h2>Upload documents</h2>
                <p>If you have a document to upload, you can do that here.</p>
              </>
            )}
          </Toggler.Enabled>
        </Toggler>
        <FileInputMultiple
          add={add}
          getErrorMessage={getErrorMessage}
          handleDocTypeChange={handleDocTypeChange}
          docType={field.docType}
        />
      </div>
      <VaButton
        id="submit"
        text="Submit documents for review"
        onClick={submit}
      />
      <va-additional-info
        class="vads-u-margin-y--3"
        trigger="Need to mail your documents?"
      >
        {mailMessage}
      </va-additional-info>
      <VaModal
        id="upload-status"
        onCloseEvent={() => setCanShowUploadModal(false)}
        visible={showUploadModal}
      >
        <UploadStatus
          progress={progress}
          files={files.length}
          onCancel={onCancel}
        />
      </VaModal>
    </>
  );
}

AddFilesForm.propTypes = {
  field: PropTypes.object.isRequired,
  files: PropTypes.array.isRequired,
  onAddFile: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDirtyFields: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onRemoveFile: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  backUrl: PropTypes.string,
  fileTab: PropTypes.bool,
  mockReadAndCheckFile: PropTypes.func,
  progress: PropTypes.number,
  uploading: PropTypes.bool,
};
