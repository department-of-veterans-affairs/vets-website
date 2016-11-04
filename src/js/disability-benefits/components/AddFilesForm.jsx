import React from 'react';
import { Link } from 'react-router';
import Scroll from 'react-scroll';

import ErrorableFileInput from '../../common/components/form-elements/ErrorableFileInput';
import ErrorableSelect from '../../common/components/form-elements/ErrorableSelect';

import Modal from '../../common/components/Modal';
import { validateIfDirty, isNotBlank } from '../../common/utils/validations';

import UploadStatus from './UploadStatus';
import MailOrFax from './MailOrFax';
import { displayFileSize, DOC_TYPES, getTopPosition } from '../utils/helpers';
import { isValidFile, isValidDocument, isValidFileSize, isValidFileType, FILE_TYPES } from '../utils/validations';

const displayTypes = FILE_TYPES.map(type => (type === 'pdf' ? 'pdf (unlocked)' : type)).join(', ');

const scrollToFile = (position) => {
  Scroll.scroller.scrollTo(`documentScroll${position}`, {
    duration: 500,
    delay: 0,
    offset: -25,
    smooth: true
  });
};
const scrollToError = () => {
  const errors = document.querySelectorAll('.usa-input-error');
  if (errors.length) {
    const errorPosition = getTopPosition(errors[0]);
    Scroll.animateScroll.scrollTo(errorPosition, {
      duration: 500,
      delay: 0,
      offset: -15,
      smooth: true
    });
  }
};
const Element = Scroll.Element;

class AddFilesForm extends React.Component {
  constructor() {
    super();
    this.add = this.add.bind(this);
    this.getErrorMessage = this.getErrorMessage.bind(this);
    this.submit = this.submit.bind(this);
    this.state = { errorMessage: null };
  }
  getErrorMessage() {
    if (this.state.errorMessage) {
      return this.state.errorMessage;
    }
    return validateIfDirty(this.props.field, () => this.props.files.length > 0)
      ? undefined
      : 'Please select a file first';
  }
  add(files) {
    const file = files[0];

    if (isValidFile(file)) {
      this.setState({ errorMessage: null });
      this.props.onAddFile(files);
      setTimeout(() => scrollToFile(this.props.files.length - 1));
    } else if (!isValidFileType(file)) {
      this.setState({ errorMessage: 'Please choose a file from one of the accepted types.' });
    } else if (!isValidFileSize(file)) {
      this.setState({
        errorMessage: 'The file you selected is larger than the 25MB maximum file size and could not be added.'
      });
    }
  }
  submit() {
    if (this.props.files.length > 0 && this.props.files.every(isValidDocument)) {
      this.props.onSubmit();
    } else {
      this.props.onDirtyFields();
      setTimeout(scrollToError);
    }
  }
  render() {
    return (
      <div className="upload-files">
        <div className="mail-or-fax-files">
          <p><a href onClick={(evt) => {
            evt.preventDefault();
            this.props.onShowMailOrFax(true);
          }}>Need to mail or fax your files?</a></p>
        </div>
        <Element name="filesList"/>
        <div className="button-container">
          <ErrorableFileInput
              errorMessage={this.getErrorMessage()}
              label={<h5>Select files to upload</h5>}
              accept={FILE_TYPES.map(type => `.${type}`).join(',')}
              onChange={this.add}
              buttonText="Add Files"
              name="fileUpload"
              additionalClass="claims-upload-input"/>
        </div>
        <div className="file-requirements">
          <p className="file-requirement-header">Accepted file types:</p>
          <p className="file-requirement-text">{displayTypes}</p>
          <p className="file-requirement-header">Maximum file size:</p>
          <p className="file-requirement-text">25MB</p>
        </div>
        {this.props.files.map(({ file, docType }, index) =>
          <div key={index} className="document-item-container">
            <Element name={`documentScroll${index}`}/>
            <div className="document-title-size">
              <div className="document-title-text-container">
                <div className="document-title-header">
                  <h4 className="title">{file.name}</h4>
                </div>
                <div className="document-size-text">
                  {displayFileSize(file.size)}
                </div>
              </div>
              <div className="remove-document-button">
                <button className="usa-button-outline" onClick={() => this.props.onRemoveFile(index)}>Remove</button>
              </div>
              <div className="clearfix"></div>
              <ErrorableSelect
                  required
                  errorMessage={validateIfDirty(docType, isNotBlank) ? undefined : 'Please provide a response'}
                  name="docType"
                  label="What type of document is this?"
                  options={DOC_TYPES}
                  value={docType}
                  emptyDescription="Select a description"
                  onValueChange={(update) => this.props.onFieldChange(`files[${index}].docType`, update)}/>
            </div>
          </div>)}
        <div className="button-container">
          <button
              className="usa-button"
              onClick={this.submit}>
            Submit Files for Review
          </button>
          <Link to={this.props.backUrl} className="claims-files-cancel">Cancel</Link>
        </div>
        <Modal
            onClose={() => true}
            visible={this.props.uploading}
            hideCloseButton
            cssClass="claims-upload-modal"
            contents={<UploadStatus
                progress={this.props.progress}
                files={this.props.files.length}
                onCancel={this.props.onCancel}/>}/>
        <Modal
            onClose={() => true}
            visible={this.props.showMailOrFax}
            hideCloseButton
            cssClass="claims-upload-modal"
            contents={<MailOrFax onClose={() => this.props.onShowMailOrFax(false)}/>}/>
      </div>
    );
  }
}

AddFilesForm.propTypes = {
  files: React.PropTypes.array.isRequired,
  field: React.PropTypes.object.isRequired,
  uploading: React.PropTypes.bool,
  showMailOrFax: React.PropTypes.bool,
  backUrl: React.PropTypes.string,
  onSubmit: React.PropTypes.func.isRequired,
  onAddFile: React.PropTypes.func.isRequired,
  onRemoveFile: React.PropTypes.func.isRequired,
  onFieldChange: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onDirtyFields: React.PropTypes.func.isRequired
};

export default AddFilesForm;
