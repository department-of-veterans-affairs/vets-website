/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import classNames from 'classnames';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import ProgressBar from '../components/ProgressBar';
import { focusElement } from '../utilities/ui';
import {
  ShowPdfPassword,
  PasswordLabel,
  PasswordSuccess,
  checkForEncryptedPdf,
} from '../utilities/file';

class FileField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      files: [], // see Files~state definition
    };
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

  focusAddAnotherButton = () => {
    // focus on span pseudo-button, not the label
    focusElement(`#${this.props.idSchema.$id}_add_label span`);
  };

  /**
   * @typedef Files~state - File state object
   * @type {object}
   * @property {object|null} file - upload API supplied File object: see
   *   https://developer.mozilla.org/en-US/docs/Web/API/File
   * @property {number} index - index matching formData array position
   * @property {boolean} isEncrypted - detected encrypted state of a PDF file
   * @property {boolean} isTemporary - indicates state data that needs needs a
   *   placeholder
   */
  /**
   * Update file state
   * @param {object|null} file - API supplied File object; store the entire File
   *   object because it needs to be passed to the `uploadRequest` function
   * @param {number} index - index of file in formData
   * @param {boolean} isEncrypted - encrypted state
   */
  setFileState = ({ file, index, isEncrypted }) => {
    // remove already uploaded files from state
    const files = this.state.files.filter(
      fileObj =>
        this.props.formData.findIndex(
          fileData => fileData.name === fileObj.file.name,
        ) < 0,
    );

    const existingIndex = files.findIndex(fileData => fileData.index === index);
    const data = { file, index, isEncrypted, isTemporary: true };
    if (existingIndex > -1) {
      files[existingIndex] = data;
      this.setState({ files });
    } else {
      this.setState({ files: [...files, data] });
    }
  };

  onSubmitPassword = (file, index, password) => {
    if (file && password) {
      this.onAddFile({ target: { files: [file] } }, index, password);
    }
  };

  processFile = async (file, index) => {
    const { requestLockedPdfPassword, uiSchema } = this.props;
    return checkForEncryptedPdf(file, requestLockedPdfPassword, uiSchema)
      .then(isEncrypted => {
        if (isEncrypted) {
          this.setFileState({ file, index, isEncrypted: true });
        }
        return isEncrypted;
      })
      .catch(() => {
        // This _should_ only be called if a file is deleted after the
        // user selects it for upload
        this.setFileState({ index, isEncrypted: false });
        return false;
      });
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

      let idx = index;
      if (idx === null) {
        idx = files.length === 0 ? 0 : files.length;
      }

      // Check if the file is an encrypted PDF
      if (currentFile.name.endsWith('pdf') && !password) {
        const needsPassword = await this.processFile(currentFile, idx);
        if (needsPassword) {
          // wait for user to enter a password before uploading
          return;
        }
      }

      this.uploadRequest = this.props.formContext.uploadFile(
        currentFile,
        this.props.uiSchema['ui:options'] || {},
        this.updateProgress,
        file => {
          const data = password ? { ...file, password } : file;
          this.props.onChange(_.set(idx, data, this.props.formData || []));
          this.uploadRequest = null;
        },
        () => {
          this.uploadRequest = null;
        },
        this.props.formContext.trackingPrefix,
        password,
      );
    }
  };

  onAttachmentIdChange = (index, value) => {
    if (!value) {
      this.props.onChange(
        _.unset([index, 'attachmentId'], this.props.formData),
      );
    } else {
      this.props.onChange(
        _.set([index, 'attachmentId'], value, this.props.formData),
      );
    }
  };

  onAttachmentNameChange = (index, value) => {
    if (!value) {
      this.props.onChange(_.unset([index, 'name'], this.props.formData));
    } else {
      this.props.onChange(_.set([index, 'name'], value, this.props.formData));
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

  removeFile = index => {
    const newFileList = this.props.formData.filter((__, idx) => index !== idx);
    if (!newFileList.length) {
      this.props.onChange();
    } else {
      this.props.onChange(newFileList);
    }
    this.setState({
      files: this.state.files.filter(entry => entry.index !== index),
    });
    // clear file input value; just in case
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = '';
    }
    this.focusAddAnotherButton();
  };

  /**
   * @typeof Files~ApiResponse
   * @type {object}
   * @property {string} name - file name
   * @property {string} confirmationCode - uuid of uploaded file
   * @property {string} attachmentId - form ID set by user
   */
  /**
   * @typedef Files~render
   * @type {object}
   * @property {Files~ApiResponse} file - File object, used when user submits
   *   password
   * @property {string} name - file name for UI
   * @property {boolean} isEncrypted - encrypted state
   * @property {boolean} isTemporary - temporary file listing added
   *   before uploading to have a placeholder in the UI
   */
  /**
   * Get file list. It needs to add files that have been marked as encrypted in
   * the state file data
   * @return {Files~render}
   */
  getFiles = () => {
    // remove temp placeholders; just in case
    const fileList =
      this.props.formData?.filter(file => !file.isTemporary) || [];
    this.state.files.forEach(({ file, index, isEncrypted }) => {
      // This does not remove duplicate file uploads! The user may have same
      // file names from different paths
      if (file.name === fileList[index]?.name) {
        // already uploaded; remove from state list
        return false;
      }
      fileList.push({
        file,
        name: file.name,
        isEncrypted,
        isTemporary: true,
      });
      return true;
    });
    return fileList;
  };

  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      formData,
      schema,
      formContext,
      onBlur,
      requestLockedPdfPassword,
    } = this.props;
    const uiOptions = uiSchema?.['ui:options'] || {};
    const files = this.getFiles();
    const maxItems = schema.maxItems || Infinity;
    const SchemaField = this.props.registry.fields.SchemaField;
    const attachmentIdRequired = schema.additionalItems.required
      ? schema.additionalItems.required.includes('attachmentId')
      : false;

    const isUploading = files.some(file => file.uploading);
    let { buttonText = 'Upload' } = uiOptions;
    if (files.length > 0) buttonText = uiOptions.addAnotherLabel;

    const Tag =
      formContext.onReviewPage && formContext.reviewMode ? 'dl' : 'div';

    return (
      <div
        className={
          formContext.reviewMode ? 'schemaform-file-upload-review' : undefined
        }
      >
        {files.length > 0 && (
          <ul className="schemaform-file-list">
            {files.map((file, index) => {
              const errors = _.get([index, '__errors'], errorSchema) || [];
              const hasErrors = errors.length > 0 || file.errorMessage;
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
              const attachmentIdErrors = _.get(
                [index, 'attachmentId'],
                errorSchema,
              );
              const attachmentNameErrors = _.get([index, 'name'], errorSchema);
              const showPasswordInput =
                requestLockedPdfPassword && // feature flag
                (files[index].isEncrypted || // needs password
                  // incorrect password, returning error message
                  (files[index].password && files[index].errorMessage));
              const showPasswordSuccess =
                requestLockedPdfPassword &&
                file.password &&
                !hasErrors &&
                !file.errorMessage;

              if (showPasswordInput) {
                setTimeout(() => {
                  focusElement(`[name="get_password_${index}"]`);
                }, 100);
              }

              return (
                <li
                  key={index}
                  id={`${idSchema.$id}_file_${index}`}
                  className={itemClasses}
                >
                  {file.uploading && (
                    <div className="schemaform-file-uploading">
                      <span>{file.name}</span>
                      <br />
                      <ProgressBar percent={this.state.progress} />
                      <button
                        type="button"
                        className="va-button-link"
                        onClick={() => {
                          this.cancelUpload(index);
                        }}
                        aria-label="Cancel Upload"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {!file.uploading && <p>{uiOptions.itemDescription}</p>}
                  {!file.uploading && <strong>{file.name}</strong>}
                  {(showPasswordInput || showPasswordSuccess) && (
                    <PasswordLabel />
                  )}
                  {showPasswordSuccess && <PasswordSuccess />}
                  {!hasErrors &&
                    _.get('properties.attachmentId', itemSchema) && (
                      <Tag className="schemaform-file-attachment review">
                        <SchemaField
                          name="attachmentId"
                          required={attachmentIdRequired}
                          schema={itemSchema.properties.attachmentId}
                          uiSchema={uiOptions.attachmentSchema}
                          errorSchema={attachmentIdErrors}
                          idSchema={attachmentIdSchema}
                          formData={formData[index].attachmentId}
                          onChange={value =>
                            this.onAttachmentIdChange(index, value)
                          }
                          onBlur={onBlur}
                          registry={this.props.registry}
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
                          uiSchema={uiOptions.attachmentName}
                          errorSchema={attachmentNameErrors}
                          idSchema={attachmentNameSchema}
                          formData={formData[index].name}
                          onChange={value =>
                            this.onAttachmentNameChange(index, value)
                          }
                          onBlur={onBlur}
                          registry={this.props.registry}
                          disabled={this.props.disabled}
                          readonly={this.props.readonly}
                        />
                      </Tag>
                    )}
                  {!file.uploading &&
                    hasErrors && (
                      <span className="usa-input-error-message">
                        {errors[0] || file.errorMessage}
                      </span>
                    )}
                  {showPasswordInput && (
                    <ShowPdfPassword
                      file={file.file}
                      index={index}
                      onSubmitPassword={this.onSubmitPassword}
                    />
                  )}
                  {!file.uploading && (
                    <div>
                      <button
                        type="button"
                        className="va-button-link"
                        onClick={() => {
                          this.removeFile(index);
                        }}
                      >
                        Delete file
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {(maxItems === null || files.length < maxItems) &&
          // Don't render an upload button on review & submit page while in
          // review mode
          !formContext.reviewMode &&
          !isUploading && (
            <>
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
                  aria-label={`${buttonText} ${uiSchema['ui:title'] ||
                    schema.title}`}
                >
                  {buttonText}
                </span>
              </label>
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
});

export { FileField };

export default connect(mapStateToProps)(FileField);
