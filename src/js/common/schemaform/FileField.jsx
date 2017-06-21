import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp';
// import Scroll from 'react-scroll';
import { displayFileSize } from '../../common/utils/helpers';
import environment from '../../common/helpers/environment';

export default class FileField extends React.Component {
  onAddFile = (e) => {
    const files = this.props.formData || [];
    this.props.onChange(files.concat({
      uploading: true
    }));
    this.uploadFile(e.target.files[0])
      .then(fileInfo => {
        const uploadingFiles = this.props.formData;
        this.props.onChange(_.set(uploadingFiles.length - 1, {
          errorMessage: null,
          uploading: false,
          fileName: fileInfo.fileName,
          maxSize: fileInfo.maxSize,
          confirmationNumber: fileInfo.confirmationNumber
        }, uploadingFiles));
      })
      .catch(message => {
        const uploadingFiles = this.props.formData || [];
        this.props.onBlur(this.props.idSchema.$id);
        this.props.onChange(_.set(uploadingFiles.length - 1, {
          uploading: false,
          errorMessage: message
        }, uploadingFiles));
      });
  }

  uploadFile = (file) => {
    const uiSchema = this.props.uiSchema;

    if (file.size > uiSchema['ui:options'].maxSize) {
      return Promise.reject('File is too large to be uploaded');
    }

    const payload = new FormData();
    payload.append('upload', file);

    return fetch(`${environment.API_URL}${uiSchema['ui:options'].endpoint}`, {
      method: 'POST',
      headers: {
        'X-Key-Inflection': 'camel'
      },
      body: payload
    }).then(resp => {
      if (resp.ok) {
        return resp.json();
      }

      return Promise.reject(resp.statusText);
    }, error => {
      return Promise.reject(error.message);
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
      schema
    } = this.props;

    const uiOptions = uiSchema['ui:options'];
    const files = formData || [];
    const maxItems = schema.maxItems || Infinity;

    const isUploading = files.some(file => file.uploading);

    return (
      <div>
        {files.map((file, index) => {
          const errors = _.get([index, '__errors'], errorSchema) || [];
          return (
            <ul key={index} className="schemaform-file-list">
              {file.uploading && 'Uploading file...'}
              {file.confirmationNumber &&
                <li>{file.fileName} ({displayFileSize(file.maxSize)})&nbsp;
                  <button
                      onClick={() => this.removeFile(index)}
                      className="usa-button usa-button-outline schemaform-file-remove-button"
                      type="button">
                    Remove
                  </button>
                </li>
              }
              {!file.uploading && !!errors.length &&
                <li>{errors[0]}&nbsp;
                  <button
                      onClick={() => this.removeFile(index)}
                      className="usa-button usa-button-outline schemaform-file-remove-button"
                      type="button">
                    Remove
                  </button>
                </li>
              }
            </ul>
          );
        })}
        {(maxItems === null || files.length < maxItems) && !isUploading &&
          <div>
            <label
                role="button"
                tabIndex="0"
                htmlFor={idSchema.$id}
                className="usa-button usa-button-outline">
              Add file
            </label>
            <input
                type="file"
                accept={uiOptions.fileTypes.map(item => `.${item}`).join(',')}
                style={{ display: 'none' }}
                id={idSchema.$id}
                name={idSchema.$id}
                onChange={this.onAddFile}/>
            <p><strong>Allowed file types:</strong><br/>{uiOptions.fileTypes.join(', ')}</p>
            <p><strong>Maximum file size:</strong><br/>{displayFileSize(uiOptions.maxSize)}</p>
          </div>}
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
