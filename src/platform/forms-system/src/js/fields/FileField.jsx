/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import classNames from 'classnames';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';

import ProgressBar from '../components/ProgressBar';
import { focusElement } from '../utilities/ui';
import {
  checkForEncryptedPdf,
  getRequestLockedPdfPassword,
} from '../utilities/file';

class FileField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      pdf: {
        file: null,
        index: null,
        getEncryptedPassword: false,
      },
      field: {
        dirty: false,
        charMax: 255,
        value: '',
      },
    };
    this.fileInputRef = React.createRef();
  }

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

  onSubmitPassword = index => {
    const password = this.state.field.value;
    if (password) {
      const { file } = this.state.pdf;
      this.resetSubmitPassword();
      this.onAddFile({ target: { files: [file] } }, index, password);
    } else {
      this.setState({
        field: {
          dirty: true,
          charMax: 255,
          value: '',
        },
      });
    }
  };

  resetSubmitPassword = () => {
    this.setState({
      pdf: {
        file: null,
        index: null,
        getEncryptedPassword: false,
      },
      field: {
        dirty: false,
        charMax: 255,
        value: '',
      },
    });
  };

  onAddFile = async (event, index = null, password) => {
    if (event.target.files && event.target.files.length) {
      const files = this.props.formData || [];
      let idx = index;
      if (idx === null) {
        idx = files.length === 0 ? 0 : files.length;
      }
      const currentFile = event.target.files[0];
      const uiOptions = this.props.uiSchema['ui:options'] || {};
      if (
        this.props.requestLockedPdfPassword && // feature flag
        uiOptions.getEncryptedPassword
      ) {
        const isEncrypted = await checkForEncryptedPdf(currentFile)
          .then(result => {
            // the input value will be empty if the password is submitted
            if (result && !this.state.field.value) {
              this.setState({
                pdf: {
                  file: currentFile,
                  index: idx,
                  getEncryptedPassword: true,
                },
              });
            }
            return result;
          })
          .catch(() => {
            // This _should_ only be called if a file is deleted after the
            // user selects it for upload
            this.uploadRequest = null;
          });

        if (isEncrypted) {
          focusElement('[name="get_password"]');
          // Don't upload until after we have a password
          if (!password) {
            return;
          }
        }
      }
      this.uploadRequest = this.props.formContext.uploadFile(
        currentFile,
        uiOptions,
        this.updateProgress,
        file => {
          this.props.onChange(_.set(idx, file, this.props.formData || []));
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
    const newFileList = this.props.formData.filter(
      (file, idx) => index !== idx,
    );
    if (!newFileList.length) {
      this.props.onChange();
    } else {
      this.props.onChange(newFileList);
    }
    if (index === this.state.pdf.index) {
      this.resetSubmitPassword();
    }
    // clear file input value; just in case
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = '';
    }
    this.focusAddAnotherButton();
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
    } = this.props;

    const uiOptions = uiSchema?.['ui:options'] || {};
    // remove temp placeholders
    const files = formData?.filter(file => !file.isTemporary) || [];
    const maxItems = schema.maxItems || Infinity;
    const SchemaField = this.props.registry.fields.SchemaField;
    const getEncryptedPassword =
      this.props.requestLockedPdfPassword && // feature flag
      this.state.pdf.getEncryptedPassword &&
      uiOptions.getEncryptedPassword;
    let encryptedFileIndex = this.state.pdf.index;
    const attachmentIdRequired = schema.additionalItems.required
      ? schema.additionalItems.required.includes('attachmentId')
      : false;

    // Find existing entry instead of always adding a new entry
    // Looks for an exact same filename in reverse order
    if (getEncryptedPassword) {
      const encryptedFileName = this.state.pdf.file?.name;
      const findEncryptedFileIndex = files
        .slice()
        .reverse()
        .findIndex(
          file => file.name === encryptedFileName && file.errorMessage,
        );
      // Add temporary placeholder for files not yet uploaded
      if (findEncryptedFileIndex < 0) {
        files.push({ name: this.state.pdf.file?.name, isTemporary: true });
      } else if (
        encryptedFileIndex !==
        files.length - findEncryptedFileIndex - 1
      ) {
        // File may be in SiPs, and since we don't prevent duplicate files
        // so this will make the password show up on the last instance of a
        // file with the exact name filename
        encryptedFileIndex = files.length - findEncryptedFileIndex - 1;
      }
    }

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
              const showPdfPasswordContent =
                (getEncryptedPassword && encryptedFileIndex === index) || false;

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
                  {!file.uploading && (
                    <span>
                      <strong>{file.name}</strong>{' '}
                      {file.unlocked && '(unlocked)'}
                    </span>
                  )}
                  {showPdfPasswordContent && (
                    <p>
                      This is en encrypted PDF document. In order for us to be
                      able to view the document, we will need the password to
                      decrypt it.
                    </p>
                  )}
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
                  {showPdfPasswordContent && (
                    // See va.gov-team/issues/14695
                    <div onKeyPress={e => e.preventDefault()}>
                      <ErrorableTextInput
                        label={'PDF password'}
                        errorMessage={
                          this.state.field.dirty &&
                          !this.state.field.value &&
                          'Please provide a password to decrypt this file'
                        }
                        name={'get_password'}
                        required
                        field={this.state.field}
                        onValueChange={field => this.setState({ field })}
                      />
                      <button
                        type="button"
                        className="usa-button-primary va-button-primary vads-u-width--auto"
                        onClick={() =>
                          this.onSubmitPassword(encryptedFileIndex)
                        }
                      >
                        Add password
                      </button>
                      <p />
                    </div>
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
  requestLockedPdfPassword: PropTypes.bool,
};

const mapStateToProps = state => ({
  requestLockedPdfPassword: getRequestLockedPdfPassword(state),
});

export { FileField };

export default connect(mapStateToProps)(FileField);
