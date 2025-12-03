/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import unset from 'platform/utilities/data/unset';
import { displayFileSize } from 'platform/utilities/ui';
import { focusElement } from 'platform/utilities/ui/focus';
import { scrollTo, scrollToFirstError } from 'platform/utilities/scroll';

import { FILE_UPLOAD_NETWORK_ERROR_MESSAGE } from 'platform/forms-system/src/js/constants';
import { ERROR_ELEMENTS } from 'platform/utilities/constants';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import {
  // ShowPdfPassword,
  // PasswordLabel,
  PasswordSuccess,
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  checkIsEncryptedPdf,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';
import { usePreviousValue } from 'platform/forms-system/src/js/helpers';
import { MISSING_PASSWORD_ERROR } from 'platform/forms-system/src/js/validation';
import {
  createOpenRemoveModal,
  createCloseRemoveModal,
  createCancelUpload,
} from '../utils/helpers2';

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
 * @property {string} ariaLabelAdditionalText additional screen-reader text to be appended to upload button's aria-label attribute.
 * @property {string} tryAgain='Try again' - button in enableShortWorkflow
 * @property {string} newFile='Upload a new file' - button in enableShortWorkflow
 * @property {string} cancel='Cancel' - button visible while uploading & in enableShortWorkflow
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
    enableShortWorkflow,
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
  const [isUploading, setIsUploading] = useState(
    files.some(file => file.uploading),
  );
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

  const content = {
    upload: uiOptions.buttonText || 'Upload',
    uploadAnother: uiOptions.addAnotherLabel || 'Upload another',
    ariaLabelAdditionalText: uiOptions.ariaLabelAdditionalText || '',
    passwordLabel: fileName => `Add a password for ${fileName}`,
    tryAgain: 'Try again',
    tryAgainLabel: fileName => `Try uploading ${fileName} again`,
    newFile: 'Upload a new file',
    cancel: 'Cancel',
    cancelLabel: fileName => `Cancel upload of ${fileName}`,
    delete: 'Delete file',
    deleteLabel: fileName => `Delete ${fileName}`,
    modalTitle:
      uiOptions.modalTitle || 'Are you sure you want to delete this file?',
    modalContent: fileName =>
      uiOptions.modalContent?.(fileName || 'Unknown') || (
        <span>
          We’ll delete the uploaded file{' '}
          <strong>{fileName || 'Unknown'}</strong>
        </span>
      ),
    yesButton: 'Yes, delete this file',
    noButton: 'No, keep this',
    error: 'Error',
  };

  const Tag = formContext.onReviewPage && formContext.reviewMode ? 'dl' : 'div';

  // hide upload & delete buttons on review & submit page when reviewing
  const showButtons = !formContext.reviewMode && !isUploading;

  const titleString =
    typeof uiSchema['ui:title'] === 'string'
      ? uiSchema['ui:title']
      : schema.title;

  const getFileListId = index => `${idSchema.$id}_file_${index}`;

  // This is always true if enableShortWorkflow is not enabled
  // If enabled, do not allow upload if any error exist
  const checkUploadVisibility = () =>
    !enableShortWorkflow ||
    (enableShortWorkflow &&
      !files.some((file, index) => {
        const errors =
          errorSchema?.[index]?.__errors ||
          [file.errorMessage].filter(error => error);

        return errors.length > 0;
      }));

  const focusAddAnotherButton = () => {
    // Add a timeout to allow for the upload button to reappear in the DOM
    // before trying to focus on it
    setTimeout(() => {
      // focus on upload button, not the label
      focusElement(
        // including `#upload-button` because RTL can't access the shadowRoot
        'button, #upload-button',
        {},
        $(`#upload-button`)?.shadowRoot,
      );
    }, 100);
  };

  const updateProgress = percent => {
    setProgress(percent);
  };

  useEffect(
    () => {
      const prevFiles = previousValue || [];
      fileButtonRef?.current?.classList?.toggle(
        'vads-u-display--none',
        !checkUploadVisibility(),
      );
      if (initialized && files.length !== prevFiles.length) {
        focusAddAnotherButton();
      }

      const hasUploading = files.some(file => file.uploading);
      const wasUploading = prevFiles.some(file => file.uploading);
      setIsUploading(hasUploading);
      if (hasUploading && !wasUploading) {
        setProgress(0);
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
        data => !data.file || (data.file?.name || '') !== '',
      );
      if (newData.length !== files.length) {
        onChange(newData);
      }
      setInitialized(true);
    },
    [files, onChange],
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
      const checks = { checkTypeAndExtensionMatches, checkIsEncryptedPdf };

      if (currentFile.type === 'testing') {
        // Skip read file for Cypress testing
        checkResults = {
          checkTypeAndExtensionMatches: true,
          checkIsEncryptedPdf: false,
        };
      } else {
        // read file mock for unit testing
        checkResults =
          typeof mockReadAndCheckFile === 'function'
            ? mockReadAndCheckFile()
            : await readAndCheckFile(currentFile, checks);
      }

      if (checkResults.checkIsEncryptedPdf) {
        allFiles[idx] = {
          file: currentFile,
          name: currentFile.name,
          errorMessage:
            'We weren’t able to upload your file. Make sure the file is in an accepted format and size before continuing.',
        };
        props.onChange(allFiles);
        return;
      }

      if (!checkResults.checkTypeAndExtensionMatches) {
        allFiles[idx] = {
          file: currentFile,
          name: currentFile.name,
          errorMessage: FILE_TYPE_MISMATCH_ERROR,
        };
        props.onChange(allFiles);
        return;
      }

      // Check if the file is an encrypted PDF
      if (
        currentFile.name?.endsWith('pdf') &&
        !password &&
        checkResults.checkIsEncryptedPdf
      ) {
        allFiles[idx] = {
          file: currentFile,
          name: currentFile.name,
          isEncrypted: true,
        };

        props.onChange(allFiles);
        // wait for user to enter a password before uploading
        return;
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
            // Focus on the 'Cancel' button when a file is being uploaded
            if (file.uploading) {
              $('.schemaform-file-uploading .cancel-upload')?.focus();
            }
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
          props.enableShortWorkflow,
        ),
      );
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

  const openRemoveModal = createOpenRemoveModal(
    setRemoveIndex,
    setShowRemoveModal,
  );

  const closeRemoveModal = createCloseRemoveModal(
    removeIndex,
    setRemoveIndex,
    setShowRemoveModal,
    removeFile,
    getFileListId,
  );

  const cancelUpload = createCancelUpload(uploadRequest, removeFile);

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
        primaryButtonText={content.yesButton}
        secondaryButtonText={content.noButton}
        onCloseEvent={closeRemoveModal}
        onPrimaryButtonClick={() => closeRemoveModal({ remove: true })}
        onSecondaryButtonClick={closeRemoveModal}
        visible={showRemoveModal}
        uswds
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
            // Don't show missing password error in the card (above the input
            // label), but we are adding an error for missing password to
            // prevent page submission without adding an error; see #71406
            const hasVisibleError =
              errors.length > 0 && errors[0] !== MISSING_PASSWORD_ERROR;

            const itemClasses = classNames('va-growable-background', {
              'schemaform-file-error usa-input-error':
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
            const showPasswordInput =
              file.isEncrypted && !file.confirmationCode;
            const showPasswordSuccess =
              file.isEncrypted && file.confirmationCode;
            const description =
              (!file.uploading && uiOptions.itemDescription) || '';

            const fileListId = getFileListId(index);
            const fileNameId = `${idSchema.$id}_file_name_${index}`;

            if (hasVisibleError) {
              setTimeout(() => {
                scrollToFirstError();
                if (enableShortWorkflow) {
                  const retryButton = $(`[name="retry_upload_${index}"]`);
                  if (retryButton) {
                    focusElement('button', {}, retryButton?.shadowRoot);
                  }
                } else if (showPasswordInput) {
                  focusElement(`#${fileListId} .usa-input-error-message`);
                } else {
                  focusElement(ERROR_ELEMENTS.join(','));
                }
              }, 250);
            } else if (showPasswordInput) {
              setTimeout(() => {
                const passwordInput = $(`[name="get_password_${index}"]`);
                if (passwordInput) {
                  focusElement('input', {}, passwordInput?.shadowRoot);
                  scrollTo(`get_password_${index}"]`);
                }
              }, 100);
            }

            const allowRetry = errors[0] === FILE_UPLOAD_NETWORK_ERROR_MESSAGE;

            const retryButtonText =
              content[allowRetry ? 'tryAgain' : 'newFile'];
            const deleteButtonText =
              content[hasVisibleError ? 'cancel' : 'delete'];

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
                    {/* no USWDS v3 "activity progress bar" */}
                    <va-progress-bar percent={progress} />
                    <va-button
                      secondary
                      class="cancel-upload vads-u-width--auto"
                      onClick={() => {
                        cancelUpload(index);
                      }}
                      label={content.cancelLabel(file.name)}
                      text={content.cancel}
                      uswds
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
                    <span className="usa-input-error-message" role="alert">
                      <span className="sr-only">Error</span> {errors[0]}
                    </span>
                  )}
                {!formContext.reviewMode &&
                  !isUploading && (
                    <div className="vads-u-margin-top--2">
                      {hasVisibleError && (
                        <va-button
                          name={`retry_upload_${index}`}
                          class="retry-upload vads-u-width--auto vads-u-margin-right--2"
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
                          uswds
                        />
                      )}
                      {!showPasswordInput && (
                        <va-button
                          secondary
                          class="delete-upload vads-u-width--auto"
                          onClick={() => {
                            if (hasVisibleError) {
                              // Cancelling with error should not show the remove
                              // file modal
                              removeFile(index);
                            } else {
                              openRemoveModal(index);
                            }
                          }}
                          label={content[
                            hasVisibleError ? 'cancelLabel' : 'deleteLabel'
                          ](file.name)}
                          text={deleteButtonText}
                          uswds
                        />
                      )}
                    </div>
                  )}
              </li>
            );
          })}
        </ul>
      )}
      {// Don't render an upload button on review & submit page while in
      // review mode
      showButtons && (
        <>
          {(maxItems === null || files.length < maxItems) &&
            // Prevent additional upload if any upload has error state
            checkUploadVisibility() &&
            !files.some(
              (file, index) =>
                errorSchema?.[index]?.__errors?.length > 0 || file.errorMessage,
            ) && (
              // eslint-disable-next-line jsx-a11y/label-has-associated-control
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
                  // label is the aria-label
                  label={`${uploadText} ${titleString || ''}. ${
                    content.ariaLabelAdditionalText
                  }`}
                  text={uploadText}
                  uswds
                />
              </label>
            )}
          <input
            type="file"
            ref={fileInputRef}
            accept={uiOptions.fileTypes.map(item => `.${item}`).join(',')}
            className="vads-u-display--none"
            id={idSchema.$id}
            name={idSchema.$id}
            onChange={onAddFile}
            onClick={() => {
              fileInputRef.current.value = '';
            }}
          />
        </>
      )}
    </div>
  );
};

FileField.propTypes = {
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  enableShortWorkflow: PropTypes.bool,
  errorSchema: PropTypes.object,
  formContext: PropTypes.shape({
    onReviewPage: PropTypes.bool,
    reviewMode: PropTypes.bool,
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

const mapStateToProps = state => ({
  enableShortWorkflow: toggleValues(state).file_upload_short_workflow_enabled,
});

export { FileField };

export default connect(mapStateToProps)(FileField);
