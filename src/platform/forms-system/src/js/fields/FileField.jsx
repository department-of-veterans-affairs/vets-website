/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { displayFileSize } from 'platform/utilities/ui';
import { FILE_UPLOAD_NETWORK_ERROR_MESSAGE } from 'platform/forms-system/src/js/constants';
import get from '../../../../utilities/data/get';
import set from '../../../../utilities/data/set';
import unset from '../../../../utilities/data/unset';

import { focusElement } from '../utilities/ui';
import {
  ShowPdfPassword,
  PasswordLabel,
  PasswordSuccess,
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  checkIsEncryptedPdf,
  FILE_TYPE_MISMATCH_ERROR,
} from '../utilities/file';

class FileField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
    };
    this.uploadRequest = null;
  }

  fileInputRef = React.createRef();

  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillReceiveProps(newProps) {
    const newFiles = newProps.formData || [];
    const files = this.props.formData || [];
    if (newFiles.length !== files.length) {
      this.focusAddAnotherButton();
    }

    const isUploading = newFiles.some(file => file.uploading);
    const wasUploading = files.some(file => file.uploading);
    if (isUploading && !wasUploading) {
      this.setState({ progress: 0 });
    }
  }

  componentDidMount() {
    // The File object is not preserved in the save-in-progress data
    // We need to remove these entries; an empty `file` is included in the
    // entry, but if API File Object still exists (within the same session), we
    // can't use Object.keys() on it because it returns an empty array
    const formData = (this.props.formData || []).filter(
      // keep - file may not exist (already uploaded)
      // keep - file may contain File object; ensure name isn't empty
      // remove - file may be an empty object
      data => !data.file || (data.file?.name || '') !== '',
    );
    if (formData.length !== (this.props.formData || []).length) {
      this.props.onChange(formData);
    }
  }

  focusAddAnotherButton = () => {
    // focus on span pseudo-button, not the label
    focusElement(`#${this.props.idSchema.$id}_add_label span`);
  };

  onSubmitPassword = (file, index, password) => {
    if (file && password) {
      this.onAddFile({ target: { files: [file] } }, index, password);
    }
  };

  /**
   * Add file to list and upload
   * @param {Event} event - DOM File upload event
   * @param {number} index - uploaded file index, if already uploaded
   * @param {string} password - encrypted PDF password, only defined by
   *   `onSubmitPassword` function
   * @listens
   */
  onAddFile = async (event, index = null, password) => {
    if (event.target.files && event.target.files.length) {
      const currentFile = event.target.files[0];
      const files = this.props.formData || [];
      const {
        requestLockedPdfPassword,
        onChange,
        formContext,
        uiSchema,
        enableShortWorkflow,
      } = this.props;
      const uiOptions = uiSchema['ui:options'];
      // needed for FileField unit tests
      const { mockReadAndCheckFile } = uiOptions;

      let idx = index;
      if (idx === null) {
        idx = files.length === 0 ? 0 : files.length;
      }

      let checkResults;
      const checks = { checkTypeAndExtensionMatches, checkIsEncryptedPdf };

      if (currentFile.type === 'testing') {
        // Skip read file for Cypress testing
        checkResults = {
          checkTypeAndExtensionMatches: () => true,
          checkIsEncryptedPdf: () => false,
        };
      } else {
        // read file mock for unit testing
        checkResults = uiOptions.mockReadAndCheckFile
          ? mockReadAndCheckFile()
          : await readAndCheckFile(currentFile, checks);
      }

      if (!checkResults.checkTypeAndExtensionMatches) {
        files[idx] = {
          file: currentFile,
          name: currentFile.name,
          errorMessage: FILE_TYPE_MISMATCH_ERROR,
        };
        onChange(files);
        return;
      }

      // Check if the file is an encrypted PDF
      if (
        requestLockedPdfPassword && // feature flag
        currentFile.name?.endsWith('pdf') &&
        !password &&
        checkResults.checkIsEncryptedPdf
      ) {
        files[idx] = {
          file: currentFile,
          name: currentFile.name,
          isEncrypted: true,
        };

        onChange(files);
        // wait for user to enter a password before uploading
        return;
      }

      this.uploadRequest = formContext.uploadFile(
        currentFile,
        uiOptions,
        this.updateProgress,
        file => {
          // formData is undefined initially
          const { formData = [] } = this.props;
          formData[idx] = { ...file, isEncrypted: !!password };
          onChange(formData);
          this.uploadRequest = null;
        },
        () => {
          this.uploadRequest = null;
        },
        formContext.trackingPrefix,
        password,
        enableShortWorkflow,
      );
    }
  };

  onAttachmentIdChange = (index, value) => {
    if (!value) {
      this.props.onChange(unset([index, 'attachmentId'], this.props.formData));
    } else {
      this.props.onChange(
        set([index, 'attachmentId'], value, this.props.formData),
      );
    }
  };

  onAttachmentNameChange = (index, value) => {
    if (!value) {
      this.props.onChange(unset([index, 'name'], this.props.formData));
    } else {
      this.props.onChange(set([index, 'name'], value, this.props.formData));
    }
  };

  updateProgress = progress => {
    this.setState({ progress });
  };

  cancelUpload = index => {
    if (this.uploadRequest) {
      this.uploadRequest.abort();
    }
    this.removeFile(index);
  };

  removeFile = (index, focusAddButton = true) => {
    const newFileList = this.props.formData.filter((__, idx) => index !== idx);
    if (!newFileList.length) {
      this.props.onChange();
    } else {
      this.props.onChange(newFileList);
    }

    // clear file input value; without this, the user won't be able to open the
    // upload file window
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = '';
    }

    // When other actions follow removeFile, we do not want to apply this focus
    if (focusAddButton) {
      this.focusAddAnotherButton();
    }
  };

  retryLastUpload = (index, file) => {
    this.onAddFile({ target: { files: [file] } }, index);
  };

  deleteThenAddFile = index => {
    this.removeFile(index, false);
    this.fileInputRef.current.click();
  };

  getRetryFunction = (allowRetry, index, file) =>
    allowRetry
      ? () => this.retryLastUpload(index, file)
      : () => this.deleteThenAddFile(index);

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
  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      formData,
      schema,
      formContext,
      onBlur,
      registry,
      requestLockedPdfPassword,
      enableShortWorkflow,
    } = this.props;
    const uiOptions = uiSchema?.['ui:options'];
    const files = formData || [];
    const maxItems = schema.maxItems || Infinity;
    const { SchemaField } = registry.fields;
    const attachmentIdRequired = schema.additionalItems.required
      ? schema.additionalItems.required.includes('attachmentId')
      : false;

    const isUploading = files.some(file => file.uploading);
    // hide upload & delete buttons on review & submit page when reviewing
    const showButtons = !formContext.reviewMode && !isUploading;

    let { buttonText = 'Upload' } = uiOptions;
    if (files.length > 0) buttonText = uiOptions.addAnotherLabel;

    const Tag =
      formContext.onReviewPage && formContext.reviewMode ? 'dl' : 'div';

    const titleString =
      typeof uiSchema['ui:title'] === 'string'
        ? uiSchema['ui:title']
        : schema.title;

    // This is always true if enableShortWorkflow is not enabled
    // If enabled, do not allow upload if any error exist
    const allowUpload =
      !enableShortWorkflow ||
      (enableShortWorkflow &&
        !files.some((file, index) => {
          const errors =
            errorSchema?.[index]?.__errors ||
            [file.errorMessage].filter(error => error);

          return errors.length > 0;
        }));

    return (
      <div
        className={
          formContext.reviewMode ? 'schemaform-file-upload-review' : undefined
        }
      >
        {files.length > 0 && (
          <ul className="schemaform-file-list">
            {files.map((file, index) => {
              const errors =
                errorSchema?.[index]?.__errors ||
                [file.errorMessage].filter(error => error);
              const hasErrors = errors.length > 0;
              const itemClasses = classNames('va-growable-background', {
                'schemaform-file-error usa-input-error':
                  hasErrors && !file.uploading,
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
              // feature flag
              const showPasswordContent =
                requestLockedPdfPassword && file.isEncrypted;
              const showPasswordInput =
                showPasswordContent && !file.confirmationCode;
              const showPasswordSuccess =
                showPasswordContent &&
                !showPasswordInput &&
                file.confirmationCode;
              const description =
                (!file.uploading && uiOptions.itemDescription) || '';

              if (showPasswordInput) {
                setTimeout(() => {
                  focusElement(`[name="get_password_${index}"]`);
                }, 100);
              } else if (hasErrors && enableShortWorkflow) {
                setTimeout(() => {
                  focusElement(`[name="retry_upload_${index}"]`);
                }, 100);
              }

              const allowRetry =
                errors[0] === FILE_UPLOAD_NETWORK_ERROR_MESSAGE;

              const retryButtonText = allowRetry
                ? 'Try again'
                : 'Upload a new file';

              const deleteButtonText =
                enableShortWorkflow && hasErrors ? 'Cancel' : 'Delete file';

              const fileId = `${idSchema.$id}_file_name_${index}`;

              const getUiSchema = innerUiSchema =>
                typeof innerUiSchema === 'function'
                  ? innerUiSchema({ fileId, index })
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
                <li
                  key={index}
                  id={`${idSchema.$id}_file_${index}`}
                  className={itemClasses}
                >
                  {file.uploading && (
                    <div className="schemaform-file-uploading">
                      <strong id={fileId}>{file.name}</strong>
                      <br />
                      <va-progress-bar percent={this.state.progress} />
                      <button
                        type="button"
                        className="usa-button-secondary vads-u-width--auto"
                        onClick={() => {
                          this.cancelUpload(index);
                        }}
                        aria-label="Cancel Upload"
                        aria-describedby={fileId}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {description && <p>{description}</p>}
                  {!file.uploading && (
                    <>
                      <strong id={fileId}>{file.name}</strong>
                      {file?.size && <div> {displayFileSize(file.size)}</div>}
                    </>
                  )}
                  {(showPasswordInput || showPasswordSuccess) && (
                    <PasswordLabel />
                  )}
                  {showPasswordSuccess && <PasswordSuccess />}
                  {!hasErrors &&
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
                          onChange={value =>
                            this.onAttachmentIdChange(index, value)
                          }
                          onBlur={onBlur}
                          registry={indexedRegistry}
                          disabled={this.props.disabled}
                          readonly={this.props.readonly}
                        />
                      </Tag>
                    )}
                  {!hasErrors &&
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
                          onChange={value =>
                            this.onAttachmentNameChange(index, value)
                          }
                          onBlur={onBlur}
                          registry={indexedRegistry}
                          disabled={this.props.disabled}
                          readonly={this.props.readonly}
                        />
                      </Tag>
                    )}
                  {!file.uploading &&
                    hasErrors && (
                      <span className="usa-input-error-message" role="alert">
                        <span className="sr-only">Error</span> {errors[0]}
                      </span>
                    )}
                  {showPasswordInput && (
                    <ShowPdfPassword
                      file={file.file}
                      index={index}
                      onSubmitPassword={this.onSubmitPassword}
                      ariaDescribedby={fileId}
                    />
                  )}
                  {showButtons && (
                    <div className="vads-u-margin-top--2">
                      {hasErrors &&
                        enableShortWorkflow && (
                          <button
                            name={`retry_upload_${index}`}
                            type="button"
                            className="usa-button-primary vads-u-width--auto vads-u-margin-right--2"
                            onClick={this.getRetryFunction(
                              allowRetry,
                              index,
                              file.file,
                            )}
                            aria-describedby={fileId}
                          >
                            {retryButtonText}
                          </button>
                        )}
                      <button
                        type="button"
                        className="usa-button-secondary vads-u-width--auto"
                        onClick={() => {
                          this.removeFile(index);
                        }}
                        aria-describedby={fileId}
                      >
                        {deleteButtonText}
                      </button>
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
              allowUpload && (
                <label
                  id={`${idSchema.$id}_add_label`}
                  htmlFor={idSchema.$id}
                  className="vads-u-display--inline-block"
                >
                  <span
                    role="button"
                    className="usa-button usa-button-secondary vads-u-padding-x--2 vads-u-padding-y--1"
                    onKeyPress={e => {
                      e.preventDefault();
                      if (['Enter', ' ', 'Spacebar'].indexOf(e.key) !== -1) {
                        this.fileInputRef.current.click();
                      }
                    }}
                    tabIndex="0"
                    aria-label={`${buttonText} ${titleString}`}
                  >
                    {buttonText}
                  </span>
                </label>
              )}
            <input
              type="file"
              ref={this.fileInputRef}
              accept={uiOptions.fileTypes.map(item => `.${item}`).join(',')}
              style={{ display: 'none' }}
              id={idSchema.$id}
              name={idSchema.$id}
              onChange={this.onAddFile}
            />
          </>
        )}
      </div>
    );
  }
}

FileField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  requiredSchema: PropTypes.object,
  idSchema: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  formData: PropTypes.array,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
};

const mapStateToProps = state => ({
  requestLockedPdfPassword: toggleValues(state).request_locked_pdf_password,
  enableShortWorkflow: toggleValues(state).file_upload_short_workflow_enabled,
});

export { FileField };

export default connect(mapStateToProps)(FileField);
