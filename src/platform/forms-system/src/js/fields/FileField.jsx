/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import classNames from 'classnames';

import ProgressBar from '../components/ProgressBar';
import { focusElement } from '../utilities/ui';

export default class FileField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
    };
  }
  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillReceiveProps(newProps) {
    const newFiles = newProps.formData || [];
    const files = this.props.formData || [];
    if (newFiles.length !== files.length) {
      focusElement(`#${newProps.idSchema.$id}_add_label`);
    }

    const isUploading = newFiles.some(file => file.uploading);
    const wasUploading = files.some(file => file.uploading);
    if (isUploading && !wasUploading) {
      this.setState({ progress: 0 });
    }
  }

  onAddFile = (event, index = null) => {
    if (event.target.files && event.target.files.length) {
      const files = this.props.formData || [];
      let idx = index;
      if (idx === null) {
        idx = files.length === 0 ? 0 : files.length;
      }
      this.uploadRequest = this.props.formContext.uploadFile(
        event.target.files[0],
        this.props.uiSchema['ui:options'],
        this.updateProgress,
        file => {
          this.props.onChange(_.set(idx, file, this.props.formData || []));
          this.uploadRequest = null;
        },
        () => {
          this.uploadRequest = null;
        },
        this.props.formContext.trackingPrefix,
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

    const uiOptions = uiSchema['ui:options'];
    const files = formData || [];
    const maxItems = schema.maxItems || Infinity;
    const SchemaField = this.props.registry.fields.SchemaField;
    const attachmentIdRequired = schema.additionalItems.required
      ? schema.additionalItems.required.includes('attachmentId')
      : false;

    const isUploading = files.some(file => file.uploading);
    let { buttonText = 'Upload' } = uiOptions;
    if (files.length > 0) buttonText = uiOptions.addAnotherLabel;

    const Tag = formContext.onReviewPage ? 'dl' : 'div';

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
              const attachmentIdErrors = _.get(
                [index, 'attachmentId'],
                errorSchema,
              );
              const attachmentNameErrors = _.get([index, 'name'], errorSchema);

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
                      <strong>{file.name}</strong>
                    </span>
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
                        {errors[0]}
                      </span>
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
                className="usa-button usa-button-secondary"
              >
                <span
                  role="button"
                  onKeyPress={e => {
                    e.preventDefault();
                    if (['Enter', ' ', 'Spacebar'].indexOf(e.key) !== -1) {
                      document.getElementById(idSchema.$id).click();
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
