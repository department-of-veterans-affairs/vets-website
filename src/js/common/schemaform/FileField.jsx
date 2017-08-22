/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp';
import classNames from 'classnames';
import { focusElement } from '../utils/helpers';
import ProgressBar from '../components/ProgressBar';

export default class FileField extends React.Component {
  constructor(props) {
    super(props);
    const files = this.props.formData || [];
    this.state = {
      editing: files.map(() => false),
      progress: 0
    };
  }

  componentWillReceiveProps(newProps) {
    const newFiles = newProps.formData || [];
    const files = this.props.formData || [];
    if (newFiles.length !== files.length) {
      this.setState({
        editing: newFiles.map(() => false)
      });
      focusElement(`#${newProps.idSchema.$id}_add_label`);
    } else {
      const editing = this.state.editing.map((isEditing, i) => {
        if (newFiles[i].uploading !== files[i].uploading) {
          return false;
        }

        return isEditing;
      });
      this.setState({ editing });
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
      const filePath = this.props.idSchema.$id.split('_').slice(1).concat(idx);
      this.props.formContext.uploadFile(
        event.target.files[0],
        filePath,
        this.props.uiSchema['ui:options'],
        this.updateProgress
      ).then(() => {
        // rather not use the promise here, but seems better than trying to pass
        // a blur function
        this.props.onBlur(this.props.idSchema.$id);
      });
    }
  }

  updateProgress = (progress) => {
    this.setState({ progress });
  }

  editFile = (index, isEditing = true) => {
    this.setState({ editing: _.set(index, isEditing, this.state.editing) }, () => {
      focusElement(`#${this.props.idSchema.$id}_file_${index}`);
    });
  }

  removeFile = (index) => {
    const newFileList = this.props.formData.filter((file, idx) => index !== idx);
    if (!newFileList.length) {
      this.props.onChange();
    }
    this.props.onChange(newFileList);
  }

  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      formData,
      schema,
      formContext
    } = this.props;

    const uiOptions = uiSchema['ui:options'];
    const files = formData || [];
    const maxItems = schema.maxItems || Infinity;

    const isUploading = files.some(file => file.uploading);
    const isEditing = this.state.editing.some(editing => editing);

    return (
      <div className={formContext.reviewMode ? 'schemaform-file-upload-review' : undefined}>
        {files.length > 0 &&
          <ul className="schemaform-file-list">
            {files.map((file, index) => {
              const errors = _.get([index, '__errors'], errorSchema) || [];
              const editingOrErrors = this.state.editing[index] || errors.length > 0;
              const itemClasses = classNames('va-growable-background', {
                'schemaform-file-item-edit': editingOrErrors
              });

              return (
                <li key={index} id={`${idSchema.$id}_file_${index}`} className={itemClasses}>
                  {file.uploading &&
                    <div className="schemaform-file-uploading">
                      <span>{file.name}</span><br/>
                      <ProgressBar percent={this.state.progress}/>
                    </div>
                  }
                  {file.confirmationCode && <span>{file.name}</span>}
                  {!file.uploading && !!errors.length && <span>{errors[0]}</span>}
                  {!file.uploading && !editingOrErrors &&
                    <div className="schemaform-file-list-buttons">
                      <button
                          onClick={() => this.editFile(index)}
                          className="usa-button usa-button-outline schemaform-file-remove-button"
                          type="button">
                        Edit
                      </button>
                    </div>
                  }
                  {editingOrErrors && <div className="schemaform-file-list-buttons-editing">
                    <label
                        role="button"
                        tabIndex="0"
                        htmlFor={idSchema.$id}
                        className="usa-button schemaform-upload-label">
                      Replace
                    </label>
                    <input
                        type="file"
                        accept={uiOptions.fileTypes.map(item => `.${item}`).join(',')}
                        style={{ display: 'none' }}
                        id={idSchema.$id}
                        name={idSchema.$id}
                        onChange={(e) => this.onAddFile(e, index)}/>
                    {errors.length === 0 &&
                      <button
                          onClick={() => this.editFile(index, false)}
                          className="usa-button usa-button-outline schemaform-file-remove-button"
                          type="button">
                        Cancel
                      </button>
                    }
                  </div>}
                  {editingOrErrors && <a href onClick={(e) => {
                    e.preventDefault();
                    this.removeFile(index);
                  }}>
                    Delete file
                  </a>}
                </li>
              );
            })}
          </ul>
        }
        {(maxItems === null || files.length < maxItems) && !isUploading && !isEditing &&
          <div>
            <label
                role="button"
                tabIndex="0"
                id={`${idSchema.$id}_add_label`}
                htmlFor={idSchema.$id}
                className="usa-button usa-button-outline">
                {files.length > 0 ? uiOptions.addAnotherLabel : 'Upload'}
            </label>
            <input
                type="file"
                accept={uiOptions.fileTypes.map(item => `.${item}`).join(',')}
                style={{ display: 'none' }}
                id={idSchema.$id}
                name={idSchema.$id}
                onChange={this.onAddFile}/>
          </div>
        }
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
  readonly: PropTypes.bool
};
