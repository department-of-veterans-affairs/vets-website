import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Toggler } from '~/platform/utilities/feature-toggles';

import {
  VaFileInput,
  VaModal,
  VaSelect,
  VaTextInput,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  checkIsEncryptedPdf,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';
import { getScrollOptions } from '@department-of-veterans-affairs/platform-utilities/ui';
import scrollTo from '@department-of-veterans-affairs/platform-utilities/scrollTo';

import { Element } from 'platform/utilities/scroll';

import { displayFileSize, DOC_TYPES } from '../../utils/helpers';
import { setFocus } from '../../utils/page';
import {
  validateIfDirty,
  isNotBlank,
  isValidFile,
  isValidDocument,
  isValidFileSize,
  isEmptyFileSize,
  isValidFileType,
  isPdf,
  FILE_TYPES,
  MAX_FILE_SIZE_MB,
  MAX_PDF_SIZE_MB,
} from '../../utils/validations';
import UploadStatus from '../UploadStatus';
import mailMessage from '../MailMessage';
import RemoveFileModal from './RemoveFileModal';

const scrollToFile = position => {
  const options = getScrollOptions({ offset: -25 });
  scrollTo(`documentScroll${position}`, options);
};

const AddFilesForm = ({
  field,
  files = [],
  onAddFile,
  onCancel,
  onDirtyFields,
  onFieldChange,
  onRemoveFile,
  onSubmit,
  mockReadAndCheckFile,
  progress = 0,
  uploading = false,
}) => {
  const [state, setState] = useState({
    errorMessage: null,
    canShowUploadModal: false,
    showRemoveFileModal: false,
    removeFileIndex: null,
    removeFileName: null,
  });

  /* ------------------------------------------------------------------------ */
  const getErrorMessage = () =>
    state.errorMessage ??
    (validateIfDirty(field, () => files.length > 0)
      ? undefined
      : 'Please select a file first');

  const handleDocTypeChange = useCallback(
    (docType, index) => {
      onFieldChange(`files[${index}].docType`, { value: docType, dirty: true });
    },
    [onFieldChange],
  );

  const handlePasswordChange = useCallback(
    (password, index) => {
      onFieldChange(`files[${index}].password`, {
        value: password,
        dirty: true,
      });
    },
    [onFieldChange],
  );

  const add = useCallback(
    async selectedFiles => {
      const file = selectedFiles[0];
      const extraData = {};
      const hasPdfSizeLimit = isPdf(file);

      if (isValidFile(file)) {
        const checks = { checkTypeAndExtensionMatches, checkIsEncryptedPdf };
        const checkResults = mockReadAndCheckFile
          ? mockReadAndCheckFile()
          : await readAndCheckFile(file, checks);

        if (!checkResults.checkTypeAndExtensionMatches) {
          setState(prev => ({ ...prev, errorMessage: FILE_TYPE_MISMATCH_ERROR }));
          return;
        }

        if (file.name?.toLowerCase().endsWith('pdf')) {
          extraData.isEncrypted = checkResults.checkIsEncryptedPdf;
        }

        setState(prev => ({ ...prev, errorMessage: null }));
        onAddFile([file], extraData);

        setTimeout(() => {
          scrollToFile(files.length - 1);
          setFocus(
            document.querySelectorAll('.document-item-container')[files.length - 1],
          );
        });
      } else if (!isValidFileType(file)) {
        setState(prev => ({
          ...prev,
          errorMessage: 'Please choose a file from one of the accepted types.',
        }));
      } else if (!isValidFileSize(file)) {
        const maxSize = hasPdfSizeLimit ? MAX_PDF_SIZE_MB : MAX_FILE_SIZE_MB;
        setState(prev => ({
          ...prev,
          errorMessage: `The file you selected is larger than the ${maxSize}MB maximum file size and could not be added.`,
        }));
      } else if (isEmptyFileSize(file)) {
        setState(prev => ({
          ...prev,
          errorMessage:
            'The file you selected is empty. Files uploaded must be larger than 0B.',
        }));
      }
    },
    [files.length, mockReadAndCheckFile, onAddFile],
  );

  const submit = useCallback(() => {
    const hasPasswords = files.every(
      f => !f.isEncrypted || (f.isEncrypted && f.password.value),
    );

    if (files.length > 0 && files.every(isValidDocument) && hasPasswords) {
      setState(prev => ({ ...prev, canShowUploadModal: true }));
      onSubmit();
    } else {
      onDirtyFields();
    }
  }, [files, onSubmit, onDirtyFields]);

  const removeFileConfirmation = (fileIndex, fileName) =>
    setState(prev => ({
      ...prev,
      showRemoveFileModal: true,
      removeFileIndex: fileIndex,
      removeFileName: fileName,
    }));

  const showUploadModal = uploading && state.canShowUploadModal;

  /* ------------------------------------------------------------------------ */
  return (
    <>
      <div className="add-files-form">
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstFriendlyEvidenceRequests}>
          <Toggler.Enabled>
            <div>
              <h2>Upload Documents</h2>
              <p>If you have a document to upload, you can do that here.</p>
              <VaFileInput
                id="file-upload"
                className="vads-u-margin-bottom--3"
                error={getErrorMessage()}
                label="Upload document(s)"
                hint="You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only)."
                accept={FILE_TYPES.map(t => `.${t}`).join(',')}
                onVaChange={e => add(e.detail.files)}
                name="fileUpload"
                additionalErrorClass="claims-upload-input-error-message"
                aria-describedby="file-requirements"
                uswds
              />
            </div>
          </Toggler.Enabled>
          <Toggler.Disabled>
            <VaFileInput
              id="file-upload"
              className="vads-u-margin-bottom--3"
              error={getErrorMessage()}
              label="Upload additional evidence"
              hint="You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only)."
              accept={FILE_TYPES.map(t => `.${t}`).join(',')}
              onVaChange={e => add(e.detail.files)}
              name="fileUpload"
              additionalErrorClass="claims-upload-input-error-message"
              aria-describedby="file-requirements"
            />
          </Toggler.Disabled>
        </Toggler>
      </div>

      {files.map(({ file, docType, isEncrypted, password }, index) => (
        <div key={index} className="document-item-container">
          <Element name={`documentScroll${index}`} />
          <div>
            <div className="document-title-row">
              <div className="document-title-text-container">
                <div>
                  <span
                    className="document-title"
                    data-dd-privacy="mask"
                    data-dd-action-name="document title"
                  >
                    {file.name}
                  </span>
                </div>
                <div>{displayFileSize(file.size)}</div>
              </div>
              <div className="remove-document-button">
                <va-button
                  secondary
                  text="Remove"
                  onClick={() => removeFileConfirmation(index, file.name)}
                />
              </div>
            </div>

            {isEncrypted && (
              <>
                <p className="clearfix">
                  This is an encrypted PDF document. In order for us to be able
                  to view the document, we will need the password to decrypt it.
                </p>
                <VaTextInput
                  id="password-input"
                  required
                  error={
                    validateIfDirty(password, isNotBlank)
                      ? undefined
                      : 'Please provide a password to decrypt this file'
                  }
                  label="PDF password"
                  name="password"
                  onInput={e => handlePasswordChange(e.target.value, index)}
                />
              </>
            )}

            <VaSelect
              required
              error={
                validateIfDirty(docType, isNotBlank)
                  ? undefined
                  : 'Please provide a response'
              }
              name="docType"
              label="What type of document is this?"
              value={docType}
              onVaSelect={e => handleDocTypeChange(e.detail.value, index)}
            >
              {DOC_TYPES.map(doc => (
                <option key={doc.value} value={doc.value}>
                  {doc.label}
                </option>
              ))}
            </VaSelect>
          </div>
        </div>
      ))}

      <VaButton id="submit" text="Submit documents for review" onClick={submit} />

      <va-additional-info
        class="vads-u-margin-y--3"
        trigger="Need to mail your files?"
      >
        {mailMessage}
      </va-additional-info>

      <RemoveFileModal
        removeFile={() => onRemoveFile(state.removeFileIndex)}
        showRemoveFileModal={state.showRemoveFileModal}
        removeFileName={state.removeFileName}
        closeModal={() =>
          setState(prev => ({
            ...prev,
            showRemoveFileModal: false,
            removeFileIndex: null,
            removeFileName: null,
          }))
        }
      />

      <VaModal
        id="upload-status"
        onCloseEvent={() => setState(prev => ({ ...prev, canShowUploadModal: false }))}
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
};

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
  mockReadAndCheckFile: PropTypes.func,
  progress: PropTypes.number,
  uploading: PropTypes.bool,
};

export default AddFilesForm;
