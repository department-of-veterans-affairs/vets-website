import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp';
// import Scroll from 'react-scroll';

export default class FileField extends React.Component {
  constructor(props) {
    super(props);
    const files = this.props.formData || [];
    this.state = {
      editing: files.map(() => false)
    };
  }

  componentWillReceiveProps(newProps) {
    const newFiles = newProps.formData || [];
    const files = this.props.formData || [];
    if (newFiles.length !== files.length) {
      this.setState({
        editing: newFiles.map(() => false)
      });
    } else {
      const editing = this.state.editing.map((isEditing, i) => {
        if (newFiles[i].uploading !== files[i].uploading) {
          return false;
        }

        return isEditing;
      });
      this.setState({ editing });
    }
  }

  onAddFile = (event, index = null) => {
    const files = this.props.formData || [];
    let idx = index;
    if (idx === null) {
      if (files.length === 0) {
        idx = 0;
      } else {
        idx = files.length;
      }
    }
    const filePath = this.props.idSchema.$id.split('_').slice(1).concat(idx);
    this.props.formContext.uploadFile(event.target.files[0], filePath, this.props.uiSchema['ui:options'])
      .catch(() => {
        // rather not use the promise here, but seems better than trying to pass
        // a blur function
        this.props.onBlur(this.props.idSchema.$id);
      });
  }

  editFile = (index, isEditing = true) => {
    this.setState({ editing: _.set(index, isEditing, this.state.editing) });
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
      schema
    } = this.props;

    const uiOptions = uiSchema['ui:options'];
    const files = formData || [];
    const maxItems = schema.maxItems || Infinity;

    const isUploading = files.some(file => file.uploading);
    const isEditing = this.state.editing.some(editing => editing);

    return (
      <div>
        {files.length > 0 &&
          <ul className="schemaform-file-list">
            {files.map((file, index) => {
              const errors = _.get([index, '__errors'], errorSchema) || [];

              if (this.state.editing[index] || errors.length > 0) {
                return (
                  <li key={index} className="va-growable-background schemaform-file-item-edit">
                    {file.uploading && 'Uploading file...'}
                    {file.confirmationCode && <span>{file.fileName}</span>}
                    {!file.uploading && !!errors.length && <span>{errors[0]}</span>}
                    <div className="schemaform-file-list-buttons-editing">
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
                    </div>
                    <a href onClick={(e) => {
                      e.preventDefault();
                      this.removeFile(index);
                    }}>
                      Delete file
                    </a>
                  </li>
                );
              }
              return (
                <li key={index} className="va-growable-background">
                  {file.uploading && 'Uploading file...'}
                  {file.confirmationCode && <span>{file.fileName}</span>}
                  {!file.uploading && !!errors.length && <span>{errors[0]}</span>}
                  {!file.uploading &&
                    <div className="schemaform-file-list-buttons">
                      <button
                          onClick={() => this.editFile(index)}
                          className="usa-button usa-button-outline schemaform-file-remove-button"
                          type="button">
                        Edit
                      </button>
                    </div>
                  }
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
                htmlFor={idSchema.$id}
                className="usa-button usa-button-outline">
                {files.length > 0 ? 'Add another' : 'Upload'}
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
  formData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  registry: PropTypes.shape({
    widgets: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ])).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    definitions: PropTypes.object.isRequired,
    formContext: PropTypes.object.isRequired,
  })
};
