/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';
import classNames from 'classnames';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleValues } from '../../../../site-wide/feature-toggles/selectors';
import get from '../../../../utilities/data/get';
import set from '../../../../utilities/data/set';
import unset from '../../../../utilities/data/unset';
import {
  displayFileSize,
  focusElement,
  scrollTo,
  scrollToFirstError,
} from '../../../../utilities/ui';

import { FILE_UPLOAD_NETWORK_ERROR_MESSAGE } from '../constants';
import { ERROR_ELEMENTS } from '../../../../utilities/constants';
import { $ } from '../utilities/ui';
import {
  ShowPdfPassword,
  PasswordLabel,
  PasswordSuccess,
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  checkIsEncryptedPdf,
  FILE_TYPE_MISMATCH_ERROR,
  reMapErrorMessage,
} from '../utilities/file';
import { usePreviousValue } from '../helpers';
import {
  MISSING_PASSWORD_ERROR,
  UNSUPPORTED_ENCRYPTED_FILE_ERROR,
} from '../validation';

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

/**
 * Optional alert to override error message
 * @typedef {Object} Alert
 * @property {string} header - The title or headline of the alert.
 * @property {Array<string|JSX.Element>} body - An array of strings or JSX elements to be displayed as the main body of the alert.
 * @property {string} [formName] - Optional. The name of a form to display within the alert message.
 * @property {string} [formNumber] - Optional. The form number (e.g., "21-526EZ") to include in the alert.
 * @property {string} [formLink] - Optional. A URL to the form (e.g., a VA.gov form page) for users to download or view.
 * @property {boolean} [showMailingAddress] - Optional. Whether to show the VA mailing address for submitting forms and documents.
 */
const MAILING_ADDRESS = (
  <>
    <p className="vads-u-margin-top--0">
      Mail your completed form and copies of supporting documents to this
      address:
    </p>
    <p>
      Department of Veterans Affairs <br />
      Pension Intake Center <br />
      PO Box 5365 <br />
      Janesville, WI 53547-5365 <br />
    </p>
  </>
);

const AlertComponent = ({ alert }) => {
  const {
    header,
    body,
    formName,
    formNumber,
    formLink,
    showMailingAddress,
  } = alert;
  return (
    <va-alert status="error">
      {header && <h2 slot="headline">{header}</h2>}
      {Array.isArray(body) &&
        body.map((content, i) => (
          <p key={`alert-body-${i}`} className="vads-u-margin-top--0">
            {content}
          </p>
        ))}
      {formName && (
        <p className="vads-u-margin-y--0">
          Fill out an {formName}
          {formNumber && ` (VA Form ${formNumber}).`}
        </p>
      )}
      {formLink && (
        <p className="vads-u-margin-top--0">
          <a href={formLink} rel="noopener noreferrer" target="_blank">
            Get VA Form {formNumber} to download
          </a>
        </p>
      )}
      {showMailingAddress && MAILING_ADDRESS}
    </va-alert>
  );
};

AlertComponent.propTypes = {
  alert: PropTypes.shape({
    header: PropTypes.string,
    body: PropTypes.arrayOf(PropTypes.string),
    formName: PropTypes.string,
    formNumber: PropTypes.string,
    formLink: PropTypes.string,
    showMailingAddress: PropTypes.bool,
  }).isRequired,
};

/**
 * Conditionally displays either an error message or an alert based on the provided props and user login status.
 * @typedef {Object} ErrorMessageOrAlertComponentProps
 * @property {string} error - The error message string to display when no alert is rendered.
 * @property {Object} [alert] - Optional. An object containing alert details for rendering an alert instead of an error message.
 * @property {boolean} [hideAlertIfLoggedIn=false] - Optional. If `true`, the alert will not render if the user is logged in,
 * and the error message will be shown instead. Defaults to `false`.
 */
const ErrorMessageOrAlertComponent = ({
  hasVisibleError,
  hasVisibleAlert,
  error,
  alert,
  hideAlertIfLoggedIn = false,
}) => {
  const loggedIn = useSelector(isLoggedIn);
  const shouldHideAlert = hideAlertIfLoggedIn && loggedIn;
  return (
    <>
      {/* Show error message if there's no alert or if alert is hidden */}
      {hasVisibleError && (!hasVisibleAlert || shouldHideAlert) && (
        <span className="usa-input-error-message" role="alert">
          <span className="sr-only">Error</span> {reMapErrorMessage(error)}
        </span>
      )}
      {/* Show alert if it's visible and not hidden */}
      {hasVisibleAlert && !shouldHideAlert && (
        <div className="vads-u-margin-y--1p5">
          <AlertComponent alert={alert} />
        </div>
      )}
    </>
  );
};

ErrorMessageOrAlertComponent.propTypes = {
  error: PropTypes.string.isRequired,
  hasVisibleAlert: PropTypes.bool.isRequired,
  hasVisibleError: PropTypes.bool.isRequired,
  alert: PropTypes.shape({
    header: PropTypes.string,
    body: PropTypes.arrayOf(PropTypes.string),
    formName: PropTypes.string,
    formNumber: PropTypes.string,
    formLink: PropTypes.string,
    showMailingAddress: PropTypes.bool,
  }),
  hideAlertIfLoggedIn: PropTypes.bool,
};

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
    allowEncryptedFiles: uiOptions.allowEncryptedFiles ?? true,
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

  useEffect(() => {
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
  }, [files, onChange]);

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
            const alerts = [file.alert].filter(alert => alert);

            if (file.isEncrypted && !content.allowEncryptedFiles) {
              if (errors[0] === MISSING_PASSWORD_ERROR) {
                errors[0] = UNSUPPORTED_ENCRYPTED_FILE_ERROR;
              } else {
                errors.push(UNSUPPORTED_ENCRYPTED_FILE_ERROR);
              }
            }

            // Don't show missing password error in the card (above the input
            // label), but we are adding an error for missing password to
            // prevent page submission without adding an error; see #71406
            const hasVisibleError =
              errors.length > 0 && errors[0] !== MISSING_PASSWORD_ERROR;

            const hasVisibleAlert = alerts.length > 0;

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
              file.isEncrypted &&
              !file.confirmationCode &&
              content.allowEncryptedFiles;
            const showPasswordSuccess =
              file.isEncrypted &&
              file.confirmationCode &&
              content.allowEncryptedFiles;
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
                {/* Sometimes an error needs to be shown as an alert instead of an error message. */}
                {!file.uploading && hasVisibleError && (
                  <ErrorMessageOrAlertComponent
                    hasVisibleError={hasVisibleError}
                    hasVisibleAlert={hasVisibleAlert}
                    error={errors[0]}
                    alert={
                      hasVisibleAlert && {
                        header: alerts[0].header,
                        body: alerts[0].body,
                        formName: alerts[0].formName,
                        formNumber: alerts[0].formNumber,
                        formLink: alerts[0].formLink,
                        showMailingAddress: alerts[0].showMailingAddress,
                      }
                    }
                    hideAlertIfLoggedIn={
                      hasVisibleAlert && alerts[0].hideAlertIfLoggedIn
                    }
                  />
                )}
                {showPasswordInput && (
                  <ShowPdfPassword
                    file={file.file}
                    index={index}
                    onSubmitPassword={onSubmitPassword}
                    passwordLabel={content.passwordLabel(file.name)}
                  />
                )}
                {!formContext.reviewMode && !isUploading && (
                  <div className="vads-u-margin-top--2">
                    {hasVisibleError && (
                      <va-button
                        name={`retry_upload_${index}`}
                        class="retry-upload vads-u-width--auto vads-u-margin-right--2"
                        onClick={getRetryFunction(allowRetry, index, file.file)}
                        label={
                          allowRetry
                            ? content.tryAgainLabel(file.name)
                            : content.newFile
                        }
                        text={retryButtonText}
                        uswds
                      />
                    )}
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
            checkUploadVisibility() && (
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
