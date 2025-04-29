import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import get from '@department-of-veterans-affairs/platform-forms-system/get';
import set from '@department-of-veterans-affairs/platform-forms-system/set';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import {
  displayFileSize,
  focusElement,
  scrollTo,
} from '@department-of-veterans-affairs/platform-utilities/ui';

import unset from '~/platform/utilities/data/unset';
import { FILE_UPLOAD_NETWORK_ERROR_MESSAGE } from '~/platform/forms-system/src/js/constants';
import {
  PasswordLabel,
  PasswordSuccess,
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  FILE_TYPE_MISMATCH_ERROR,
} from '~/platform/forms-system/src/js/utilities/file';
import { usePreviousValue } from '~/platform/forms-system/src/js/helpers';

import {
  focusAddAnotherButton,
  focusCancelButton,
  focusFirstError,
} from '../utils/focus';
import {
  MISSING_PASSWORD_ERROR,
  INCORRECT_PASSWORD_ERROR,
  FILE_NAME_TOO_LONG_ERROR,
  createContent,
  reMapErrorMessage,
  checkIsFileNameTooLong,
  hasSomeUploading,
  checkUploadVisibility,
} from '../utils/upload';

import { ShowPdfPassword } from './ShowPdfPassword';

/**
 * Modal content callback
 * @typedef ModalContent
 * @type {function}
 * @property {string} fileName - name of file to be removed
 * @returns {JSX} - default='<span>We’ll delete the uploaded file
 *  <strong>{fileName}</strong></span>'
 */
/**
 * UI options used in FileField
 * @typedef uiOptions
 * @type {object}
 * @property {string} buttonText='Upload' - upload button text
 * @property {string} addAnotherLabel='Upload another' - upload another text,
 *  replaces upload button text when greater than one upload is showing
 * @property {string} tryAgain='Try again' - server error
 * @property {string} newFile='Upload a new file' - file error
 * @property {string} cancel='Cancel' - button visible while uploading & after error
 * @property {string} delete='Delete file' - delete button text
 * @property {string} modalTitle='Are you sure you want to delete this file?' -
 *  delete confirmation modal title
 * @property {ModalContent} modalContent - delete confirmation modal content
 * @property {string} yesButton='Yes, delete this' - modal Yes button text
 * @property {string} noButton='No, keep this' - modal No button text
 */
/**
 * FormData of supported files
 * @typeof Files
 * @type {object}
 * @property {string} name - file name
 * @property {boolean} uploading - flag indicating that an upload is in
 *  progress
 * @property {string} confirmationCode - uuid of uploaded file
 * @property {string} attachmentId - form ID set by user
 * @property {string} errorMessage - error message string returned from API
 * @property {boolean} isEncrypted - (Encrypted PDF only; pre-upload only)
 *  encrypted state of the file
 * @property {DOMFileObject} file - (Encrypted PDF only) File object, used
 *  when user submits password
 */
const FileField = props => {
  const {
    errorSchema,
    formContext,
    formData = [],
    idSchema,
    onBlur,
    onChange,
    registry,
    schema,
    uiSchema,
  } = props;

  const files = formData || [];
  const [progress, setProgress] = useState(0);
  const [uploadRequest, setUploadRequest] = useState(null);
  const [isUploading, setIsUploading] = useState(hasSomeUploading(files));
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const previousValue = usePreviousValue(formData);
  const fileInputRef = useRef(null);
  const fileButtonRef = useRef(null);

  const uiOptions = uiSchema?.['ui:options'];

  const maxItems = schema.maxItems || Infinity;
  const { SchemaField } = registry.fields;
  const attachmentIdRequired = schema.additionalItems.required
    ? schema.additionalItems.required.includes('attachmentId')
    : false;
  const content = createContent();

  const Tag = formContext.onReviewPage && formContext.reviewMode ? 'dl' : 'div';

  // hide upload & delete buttons on review & submit page when reviewing
  const showButtons = !formContext.reviewMode && !isUploading;

  const titleString =
    typeof uiSchema['ui:title'] === 'string'
      ? uiSchema['ui:title']
      : schema.title;

  const getFileListId = index => `${idSchema.$id}_file_${index}`;

  const showUpload =
    (maxItems === null || files.length < maxItems) &&
    // Prevent additional upload if any upload has error state
    checkUploadVisibility(files, errorSchema);

  const updateProgress = percent => {
    setProgress(percent);
  };

  useEffect(
    () => {
      if (files.length === 0 && formContext.submitted) {
        // scroll fieldset to top
        scrollTo('topContentElement');
        // focus on error text above upload button
        setTimeout(() => {
          focusElement('span.usa-input-error-message');
        });
      }
    },
    [formContext.submitted, files.length],
  );

  useEffect(
    () => {
      const prevFiles = previousValue || [];
      fileButtonRef?.current?.classList?.toggle(
        'vads-u-display--none',
        !checkUploadVisibility(files, errorSchema),
      );

      const hasUploading = hasSomeUploading(files);
      const wasUploading = hasSomeUploading(prevFiles);
      setIsUploading(hasUploading);
      if (hasUploading && !wasUploading) {
        setProgress(0);
        focusCancelButton();
      } else if (initialized && files.length !== prevFiles.length) {
        focusAddAnotherButton();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData],
  );

  useEffect(
    () => {
      // The File object is not preserved in the save-in-progress data
      // We need to remove these entries; an empty `file` is included in the
      // entry, but if API File Object still exists (within the same session), we
      // can't use Object.keys() on it because it returns an empty array
      const newData = files.filter(
        // keep - file may not exist (already uploaded)
        // keep - file may contain File object; ensure name isn't empty
        // remove - file may be an empty object
        // remove - file without confirmationCode & an error
        data =>
          (!data.file &&
            (initialized || (!initialized && !data.errorMessage))) ||
          (data.file?.name || '') !== '',
      );
      if (newData.length !== files.length) {
        onChange(newData);
      }
      setInitialized(true);
    },
    [files, onChange, initialized],
  );

  /**
   * Add file to list and upload
   * @param {Event} event - DOM File upload event
   * @param {number} index - uploaded file index, if already uploaded
   * @param {string} password - encrypted PDF password, only defined by
   *   `onSubmitPassword` function
   * @listens
   */
  const onAddFile = async (event, index = null, password) => {
    if (event.target?.files?.length) {
      // Only upload the first file; when va-file-input v3 supports multiple
      // files, we'll need to update this entire component
      const currentFile = event.target.files[0];
      const allFiles = props.formData || [];
      const addUiOptions = props.uiSchema['ui:options'];
      // needed for FileField unit tests
      const { mockReadAndCheckFile } = uiOptions;

      let idx = index;
      if (idx === null) {
        idx = allFiles.length === 0 ? 0 : allFiles.length;
      }

      let checkResults;
      // no longer checking if the PDF is encrypted on the frontend. Detection
      // was not differentiating user and owner password - user requires that
      // a password is used to unlock, an owner password does not
      const checks = { checkTypeAndExtensionMatches };

      allFiles[idx] = {
        file: currentFile,
        name: currentFile.name,
      };

      if (checkIsFileNameTooLong(currentFile.name)) {
        allFiles[idx].errorMessage = FILE_NAME_TOO_LONG_ERROR;
        props.onChange(allFiles);
        return;
      }

      if (currentFile.type === 'testing') {
        // Skip read file for Cypress testing
        checkResults = {
          checkTypeAndExtensionMatches: true,
        };
      } else {
        // read file mock for unit testing
        checkResults =
          typeof mockReadAndCheckFile === 'function'
            ? mockReadAndCheckFile()
            : await readAndCheckFile(currentFile, checks);
      }

      if (!checkResults.checkTypeAndExtensionMatches) {
        allFiles[idx].errorMessage = FILE_TYPE_MISMATCH_ERROR;
        props.onChange(allFiles);
        return;
      }

      // Check if the file is an encrypted PDF
      if (currentFile.name?.endsWith('pdf')) {
        allFiles[idx].isEncrypted = !!password;
        props.onChange(allFiles);
      }

      setUploadRequest(
        props.formContext.uploadFile(
          currentFile,
          addUiOptions,
          updateProgress,
          file => {
            // formData is undefined initially
            const newData = props.formData || [];
            newData[idx] = { ...file, isEncrypted: !!password };
            onChange(newData);
            focusCancelButton();

            // Focus on the file card after the file has finished uploading
            if (!file.uploading) {
              $(getFileListId(idx))?.focus();
            }
            setUploadRequest(null);
          },
          () => {
            setUploadRequest(null);
          },
          formContext.trackingPrefix,
          password,
        ),
      );
    }
  };

  const onSubmitPassword = (file, index, password) => {
    if (file && password) {
      onAddFile({ target: { files: [file] } }, index, password);
    }
  };

  const onAttachmentIdChange = (index, value) => {
    if (!value) {
      props.onChange(unset([index, 'attachmentId'], props.formData));
    } else {
      props.onChange(set([index, 'attachmentId'], value, props.formData));
    }
  };

  const onAttachmentNameChange = (index, value) => {
    if (!value) {
      props.onChange(unset([index, 'name'], props.formData));
    } else {
      props.onChange(set([index, 'name'], value, props.formData));
    }
  };

  const removeFile = (index, focusAddButton = true) => {
    const newFileList = props.formData.filter((__, idx) => index !== idx);
    if (!newFileList.length) {
      props.onChange();
    } else {
      props.onChange(newFileList);
    }

    // clear file input value; without this, the user won't be able to open the
    // upload file window
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // When other actions follow removeFile, we do not want to apply this focus
    if (focusAddButton) {
      focusAddAnotherButton();
    }
  };

  const openRemoveModal = index => {
    setRemoveIndex(index);
    setShowRemoveModal(true);
  };

  const closeRemoveModal = ({ remove = false } = {}) => {
    const idx = removeIndex;
    setRemoveIndex(null);
    setShowRemoveModal(false);
    if (remove) {
      removeFile(idx);
    } else {
      setTimeout(() => {
        focusElement(
          'button, .delete-upload',
          {},
          $(`#${getFileListId(idx)} .delete-upload`)?.shadowRoot,
        );
      });
    }
  };

  const cancelUpload = index => {
    if (uploadRequest) {
      uploadRequest.abort();
    }
    removeFile(index);
  };

  const retryLastUpload = (index, file) => {
    onAddFile({ target: { files: [file] } }, index);
  };

  const deleteThenAddFile = index => {
    removeFile(index, false);
    fileInputRef.current?.click();
  };

  const getRetryFunction = (allowRetry, index, file) => {
    return allowRetry
      ? () => retryLastUpload(index, file)
      : () => deleteThenAddFile(index);
  };

  const uploadText = content[files.length > 0 ? 'uploadAnother' : 'upload'];

  return (
    <div
      className={
        formContext.reviewMode ? 'schemaform-file-upload-review' : undefined
      }
    >
      <VaModal
        clickToClose
        status="warning"
        modalTitle="Are you sure you want to delete this file?"
        primaryButtonText={content.modalYesButton}
        secondaryButtonText={content.modalNoButton}
        onCloseEvent={closeRemoveModal}
        onPrimaryButtonClick={() => closeRemoveModal({ remove: true })}
        onSecondaryButtonClick={closeRemoveModal}
        visible={showRemoveModal}
      >
        <p>
          {removeIndex !== null
            ? content.modalContent(files[removeIndex]?.name)
            : null}
        </p>
      </VaModal>
      {files.length > 0 && (
        <ul className="schemaform-file-list">
          {files.map((file, index) => {
            const errors =
              errorSchema?.[index]?.__errors ||
              [file.errorMessage].filter(error => error);

            const showPasswordInput =
              file.name?.endsWith('pdf') &&
              [...MISSING_PASSWORD_ERROR, INCORRECT_PASSWORD_ERROR].includes(
                errors[0],
              ) &&
              !file.password;

            // Don't show missing password error in the card (above the input
            // label), but we are adding an error for missing password to
            // prevent page submission without adding an error; see #71406
            const hasVisibleError =
              errors.length > 0 && !MISSING_PASSWORD_ERROR.includes(errors[0]);

            const itemClasses = classNames('va-growable-background', {
              'schemaform-file-error usa-input-error vads-u-border-color--secondary-dark':
                hasVisibleError && !file.uploading,
            });
            const itemSchema = schema.items[index];
            const attachmentIdSchema = {
              $id: `${idSchema.$id}_${index}_attachmentId`,
            };
            const attachmentNameSchema = {
              $id: `${idSchema.$id}_${index}_attachmentName`,
            };
            const attachmentIdErrors = get(
              [index, 'attachmentId'],
              errorSchema,
            );
            const attachmentNameErrors = get([index, 'name'], errorSchema);
            const showPasswordSuccess =
              file.isEncrypted && file.confirmationCode;
            const description =
              (!file.uploading && uiOptions.itemDescription) || '';

            const fileListId = getFileListId(index);
            const fileNameId = `${idSchema.$id}_file_name_${index}`;

            if (hasVisibleError) {
              setTimeout(() => {
                scrollTo(fileListId);
                const retryButton = $(`[name="retry_upload_${index}"]`);
                if (showPasswordInput || uiOptions.focusOnAlertRole) {
                  focusElement(`#${fileListId} .usa-input-error-message`);
                } else if (retryButton) {
                  focusElement('button', {}, retryButton?.shadowRoot);
                } else {
                  focusFirstError();
                }
              }, 250);
            } else if (showPasswordInput) {
              setTimeout(() => {
                scrollTo(fileListId);
                const passwordInput = $(`[name="get_password_${index}"]`);
                if (passwordInput) {
                  focusElement('input', {}, passwordInput?.shadowRoot);
                }
              }, 100);
            }

            const allowRetry = errors[0] === FILE_UPLOAD_NETWORK_ERROR_MESSAGE;

            const retryButtonText =
              content[allowRetry ? 'tryAgain' : 'newFile'];
            const deleteButtonText =
              content[
                hasVisibleError || showPasswordInput ? 'cancel' : 'delete'
              ];

            const cancelButton = (
              <va-button
                secondary
                class="delete-upload vads-u-width--auto"
                onClick={() => {
                  if (hasVisibleError || showPasswordInput) {
                    // Cancelling with error should not show the remove
                    // file modal
                    removeFile(index);
                  } else {
                    openRemoveModal(index);
                  }
                }}
                label={content[hasVisibleError ? 'cancelLabel' : 'deleteLabel'](
                  file.name,
                )}
                text={deleteButtonText}
              />
            );

            const getUiSchema = innerUiSchema =>
              typeof innerUiSchema === 'function'
                ? innerUiSchema({
                    fileId: fileNameId,
                    index,
                    fileName: file.name,
                  })
                : innerUiSchema;

            // make index available to widgets in attachment ui schema
            const indexedRegistry = {
              ...registry,
              formContext: {
                ...registry.formContext,
                pagePerItemIndex: index,
              },
            };

            return (
              <li key={index} id={fileListId} className={itemClasses}>
                {file.uploading && (
                  <div className="schemaform-file-uploading">
                    <strong
                      id={fileNameId}
                      className="dd-privacy-hidden"
                      data-dd-action-name="file name"
                    >
                      {file.name}
                    </strong>
                    <br />
                    <va-progress-bar percent={progress} />
                    <va-button
                      secondary
                      class="cancel-upload vads-u-width--auto"
                      onClick={() => {
                        cancelUpload(index);
                      }}
                      label={content.cancelLabel(file.name)}
                      text={content.cancel}
                    />
                  </div>
                )}
                {description && <p>{description}</p>}
                {!file.uploading && (
                  <>
                    <strong
                      id={fileNameId}
                      className="dd-privacy-hidden"
                      data-dd-action-name="file name"
                    >
                      {file.name}
                    </strong>
                    {file?.size && <div> {displayFileSize(file.size)}</div>}
                  </>
                )}
                {(showPasswordInput || showPasswordSuccess) && (
                  <PasswordLabel />
                )}
                {showPasswordSuccess && <PasswordSuccess />}
                {!hasVisibleError &&
                  !showPasswordInput &&
                  get('properties.attachmentId', itemSchema) && (
                    <Tag className="schemaform-file-attachment review">
                      <SchemaField
                        name="attachmentId"
                        required={attachmentIdRequired}
                        schema={itemSchema.properties.attachmentId}
                        uiSchema={getUiSchema(uiOptions.attachmentSchema)}
                        errorSchema={attachmentIdErrors}
                        idSchema={attachmentIdSchema}
                        formData={formData[index].attachmentId}
                        onChange={value => onAttachmentIdChange(index, value)}
                        onBlur={onBlur}
                        registry={indexedRegistry}
                        disabled={props.disabled}
                        readonly={props.readonly}
                      />
                    </Tag>
                  )}
                {!hasVisibleError &&
                  !showPasswordInput &&
                  uiOptions.attachmentName && (
                    <Tag className="schemaform-file-attachment review">
                      <SchemaField
                        name="attachmentName"
                        required
                        schema={itemSchema.properties.name}
                        uiSchema={getUiSchema(uiOptions.attachmentName)}
                        errorSchema={attachmentNameErrors}
                        idSchema={attachmentNameSchema}
                        formData={formData[index].name}
                        onChange={value => onAttachmentNameChange(index, value)}
                        onBlur={onBlur}
                        registry={indexedRegistry}
                        disabled={props.disabled}
                        readonly={props.readonly}
                      />
                    </Tag>
                  )}
                {!file.uploading &&
                  hasVisibleError && (
                    <div className="usa-input-error-message vads-u-color--secondary-dark">
                      <span className="sr-only">Error</span>{' '}
                      {reMapErrorMessage(errors[0])}
                    </div>
                  )}
                {showPasswordInput && (
                  <ShowPdfPassword
                    file={file.file}
                    index={index}
                    onSubmitPassword={onSubmitPassword}
                    passwordLabel={content.passwordLabel(file.name)}
                    cancelButton={cancelButton}
                  />
                )}
                {!formContext.reviewMode &&
                  !file.uploading && (
                    <div className="vads-u-margin-top--2">
                      {hasVisibleError &&
                        !showPasswordInput && (
                          <va-button
                            name={`retry_upload_${index}`}
                            class="retry-upload vads-u-width--auto vads-u-margin-right--1"
                            onClick={getRetryFunction(
                              allowRetry,
                              index,
                              file.file,
                            )}
                            label={
                              allowRetry
                                ? content.tryAgainLabel(file.name)
                                : content.newFile
                            }
                            text={retryButtonText}
                          />
                        )}
                      {!showPasswordInput && cancelButton}
                    </div>
                  )}
              </li>
            );
          })}
        </ul>
      )}
      {// Don't show upload button on review & submit page while in
      // review mode
      showButtons && (
        <div
          id="upload-wrap"
          className={
            showUpload ? 'vads-u-margin-bottom--2' : 'vads-u-display--none'
          }
        >
          {/* eslint-disable jsx-a11y/label-has-associated-control */}
          <label
            id={`${idSchema.$id}_add_label`}
            htmlFor={idSchema.$id}
            className="upload-button-label vads-u-display--inline-block"
          >
            <va-button
              id="upload-button"
              ref={fileButtonRef}
              secondary
              class="vads-u-padding-x--0 vads-u-padding-y--1"
              onClick={() => fileInputRef?.current?.click()}
              label={`${uploadText} ${titleString || ''}`}
              text={uploadText}
            />
          </label>
          {/* eslint-enable jsx-a11y/label-has-associated-control */}
          <input
            type="file"
            ref={fileInputRef}
            accept={uiOptions.fileTypes.map(item => `.${item}`).join(',')}
            className="vads-u-display--none"
            id={idSchema.$id}
            name={idSchema.$id}
            onChange={onAddFile}
          />
        </div>
      )}
    </div>
  );
};

FileField.propTypes = {
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  errorSchema: PropTypes.object,
  formContext: PropTypes.shape({
    onReviewPage: PropTypes.bool,
    reviewMode: PropTypes.bool,
    submitted: PropTypes.bool,
    trackingPrefix: PropTypes.string,
    uploadFile: PropTypes.func,
  }),
  formData: PropTypes.array,
  idSchema: PropTypes.object,
  readonly: PropTypes.bool,
  registry: PropTypes.shape({
    fields: PropTypes.shape({
      SchemaField: PropTypes.func,
    }),
    formContext: PropTypes.shape({}),
  }),
  requiredSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  onBlur: PropTypes.func,
};

export default FileField;
