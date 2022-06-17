import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import Scroll from 'react-scroll';

import FileInput from '@department-of-veterans-affairs/component-library/FileInput';
import Select from '@department-of-veterans-affairs/component-library/Select';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';

import Modal from '@department-of-veterans-affairs/component-library/Modal';

import {
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  checkIsEncryptedPdf,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { getScrollOptions } from 'platform/utilities/ui';

import UploadStatus from './UploadStatus';
import mailMessage from './MailMessage';
import { displayFileSize, DOC_TYPES, getTopPosition } from '../utils/helpers';
import {
  validateIfDirty,
  isNotBlank,
  isValidFile,
  isValidDocument,
  isValidFileSize,
  isEmptyFileSize,
  isValidFileType,
  isPdf,
  FILE_TYPES,
  MAX_FILE_SIZE_MB,
  MAX_PDF_SIZE_MB,
} from '../utils/validations';
import { setFocus } from '../utils/page';

const displayTypes = FILE_TYPES.join(', ');

const scrollToFile = position => {
  const options = getScrollOptions({ offset: -25 });
  scrollTo(`documentScroll${position}`, options);
};
const scrollToError = () => {
  const errors = document.querySelectorAll('.usa-input-error');
  if (errors.length) {
    const errorPosition = getTopPosition(errors[0]);
    const options = getScrollOptions({ offset: -25 });
    const errorID = errors[0].querySelector('label').getAttribute('for');
    const errorInput = document.getElementById(`${errorID}`);
    const inputType = errorInput.getAttribute('type');
    scrollTo(errorPosition, options);

    if (inputType === 'file') {
      // Sends focus to the file input button
      errors[0].querySelector('label[role="button"]').focus();
    } else {
      errorInput.focus();
    }
  }
};
const { Element } = Scroll;

class AddFilesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      checked: false,
      errorMessageCheckbox: null,
    };
  }

  getErrorMessage = () => {
    if (this.state.errorMessage) {
      return this.state.errorMessage;
    }

    return validateIfDirty(this.props.field, () => this.props.files.length > 0)
      ? undefined
      : 'Please select a file first';
  };

  add = async files => {
    const file = files[0];
    const { onAddFile, mockReadAndCheckFile } = this.props;
    const extraData = {};
    const hasPdfSizeLimit = isPdf(file);

    if (isValidFile(file)) {
      // Check if the file is an encrypted PDF
      const checks = { checkTypeAndExtensionMatches, checkIsEncryptedPdf };
      const checkResults = mockReadAndCheckFile
        ? mockReadAndCheckFile()
        : await readAndCheckFile(file, checks);

      if (!checkResults.checkTypeAndExtensionMatches) {
        this.setState({
          errorMessage: FILE_TYPE_MISMATCH_ERROR,
        });
        return;
      }

      if (file.name?.toLowerCase().endsWith('pdf')) {
        extraData.isEncrypted = checkResults.checkIsEncryptedPdf;
      }

      this.setState({ errorMessage: null });
      onAddFile([file], extraData);
      setTimeout(() => {
        scrollToFile(this.props.files.length - 1);
        setFocus(
          document.querySelectorAll('.document-item-container')[
            this.props.files.length - 1
          ],
        );
      });
    } else if (!isValidFileType(file)) {
      this.setState({
        errorMessage: 'Please choose a file from one of the accepted types.',
      });
    } else if (!isValidFileSize(file)) {
      const maxSize = hasPdfSizeLimit ? MAX_PDF_SIZE_MB : MAX_FILE_SIZE_MB;
      this.setState({
        errorMessage: `The file you selected is larger than the ${maxSize}MB maximum file size and could not be added.`,
      });
    } else if (isEmptyFileSize(file)) {
      this.setState({
        errorMessage:
          'The file you selected is empty. Files uploaded must be larger than 0B.',
      });
    }
  };

  submit = () => {
    const { files } = this.props;
    const hasPasswords = files.every(
      file => !file.isEncrypted || (file.isEncrypted && file.password.value),
    );

    if (files.length > 0 && files.every(isValidDocument) && hasPasswords) {
      // This nested state prevents VoiceOver from accouncing an
      // unchecked checkbox if the file is missing.
      const { checked } = this.state;

      this.setState({
        errorMessageCheckbox: checked
          ? null
          : 'Please confirm these documents apply to this claim only',
      });

      if (this.state.checked) {
        this.props.onSubmit();
        return;
      }
    }

    this.props.onDirtyFields();
    setTimeout(scrollToError);
  };

  render() {
    return (
      <div>
        <div>
          <p>
            <va-additional-info trigger="Need to mail your files?">
              {mailMessage}
            </va-additional-info>
          </p>
        </div>
        <Element name="filesList" />
        <div>
          <FileInput
            errorMessage={this.getErrorMessage()}
            label={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <span className="claims-upload-input-title">
                Select files to upload
              </span>
            }
            accept={FILE_TYPES.map(type => `.${type}`).join(', ')}
            onChange={this.add}
            buttonText="Add Files"
            name="fileUpload"
            additionalErrorClass="claims-upload-input-error-message"
            aria-describedby="file-requirements"
          />
        </div>
        <dl className="file-requirements" id="file-requirements">
          <dt className="file-requirement-header">Accepted file types:</dt>
          <dd className="file-requirement-text">{displayTypes}</dd>
          <dt className="file-requirement-header">Maximum file size:</dt>
          <dd>
            <p className="file-requirement-text">
              {`${MAX_FILE_SIZE_MB}MB (non-PDF)`}
            </p>
            <p className="file-requirement-text">
              {`${MAX_PDF_SIZE_MB}MB (PDF only)`}
            </p>
          </dd>
        </dl>
        {this.props.files.map(
          ({ file, docType, isEncrypted, password }, index) => (
            <div key={index} className="document-item-container">
              <Element name={`documentScroll${index}`} />
              <div>
                <div className="document-title-row">
                  <div className="document-title-text-container">
                    <div>
                      <span className="document-title">{file.name}</span>
                    </div>
                    <div>{displayFileSize(file.size)}</div>
                  </div>
                  <div className="remove-document-button">
                    <button
                      type="button"
                      className="usa-button-secondary"
                      onClick={() => this.props.onRemoveFile(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {isEncrypted && (
                  <>
                    <p className="clearfix">
                      This is an encrypted PDF document. In order for us to be
                      able to view the document, we will need the password to
                      decrypt it.
                    </p>
                    <TextInput
                      required
                      errorMessage={
                        validateIfDirty(password, isNotBlank)
                          ? undefined
                          : 'Please provide a password to decrypt this file'
                      }
                      name="password"
                      label="PDF password"
                      field={password}
                      onValueChange={update => {
                        this.props.onFieldChange(
                          `files[${index}].password`,
                          update,
                        );
                      }}
                    />
                  </>
                )}
                <div className="clearfix" />
                <Select
                  required
                  errorMessage={
                    validateIfDirty(docType, isNotBlank)
                      ? undefined
                      : 'Please provide a response'
                  }
                  name="docType"
                  label="What type of document is this?"
                  options={DOC_TYPES}
                  value={docType}
                  emptyDescription="Select a description"
                  onValueChange={update =>
                    this.props.onFieldChange(`files[${index}].docType`, update)
                  }
                />
              </div>
            </div>
          ),
        )}
        <Checkbox
          onValueChange={checked => {
            this.setState({ checked });
          }}
          checked={this.state.checked}
          errorMessage={this.state.errorMessageCheckbox}
          label={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <div>
              <strong>
                The files I uploaded are supporting documents for this claim
                only.
              </strong>
              <div className="vads-u-padding-top--1">
                To submit supporting documents for a new disability claim,
                please visit our{' '}
                <a href="/disability/how-to-file-claim">How to File a Claim</a>{' '}
                page.
              </div>
            </div>
          }
        />
        <div>
          <button type="submit" className="usa-button" onClick={this.submit}>
            Submit Files for Review
          </button>
          <Link to={this.props.backUrl} className="claims-files-cancel">
            Cancel
          </Link>
        </div>
        <Modal
          onClose={() => true}
          visible={this.props.uploading}
          hideCloseButton
          cssClass=""
          id="upload-status"
          contents={
            <UploadStatus
              progress={this.props.progress}
              files={this.props.files.length}
              onCancel={this.props.onCancel}
            />
          }
        />
      </div>
    );
  }
}

AddFilesForm.propTypes = {
  field: PropTypes.object.isRequired,
  files: PropTypes.array.isRequired,
  onAddFile: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDirtyFields: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onRemoveFile: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  backUrl: PropTypes.string,
  mockReadAndCheckFile: PropTypes.bool,
  uploading: PropTypes.bool,
};

export default AddFilesForm;
