import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp';
// import Scroll from 'react-scroll';
import { displayFileSize } from '../../common/utils/helpers';

export default class FileField extends React.Component {
  uploadFile = () => {
    const files = this.props.formData || [];
    this.props.onChange(files.concat({
      uploading: true
    }));
    setTimeout(() => {
      const uploadingFiles = this.props.formData;
      this.props.onChange(_.set(uploadingFiles.length - 1, {
        uploading: false,
        fileName: 'testing.txt',
        fileSize: 32444,
        confirmationNumber: '123123'
      }, uploadingFiles));
    }, 2000);
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
          return (
            <ul key={index} className="schemaform-file-list">
              {file.uploading && 'Uploading file...'}
              {!file.uploading &&
                <li>{file.fileName} ({displayFileSize(file.fileSize)}) <button className="usa-button usa-button-outline schemaform-file-remove-button" type="button">Remove</button></li>}
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
            <input type="file"
                style={{ display: 'none' }}
                id={idSchema.$id}
                name={idSchema.$id}
                onChange={this.uploadFile}/>
            <p><strong>Allowed file types:</strong><br/>{uiOptions.fileTypes}</p>
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
