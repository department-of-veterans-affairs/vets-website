import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import Scroll from 'react-scroll';

import {
  VaFileInput,
  VaModal,
  VaSelect,
  VaTextInput,
  VaCheckbox,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { getScrollOptions } from '@department-of-veterans-affairs/platform-utilities/ui';
import scrollTo from '@department-of-veterans-affairs/platform-utilities/scrollTo';
import {
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  checkIsEncryptedPdf,
  FILE_TYPE_MISMATCH_ERROR,
} from '~/platform/forms-system/src/js/utilities/file';

import { displayFileSize, DOC_TYPES } from '../utils/helpers';
import { setFocus } from '../utils/page';
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
import UploadStatus from './UploadStatus';
import mailMessage from './MailMessage';
import RemoveFileModal from './claim-files-tab/RemoveFileModal';

const displayTypes = FILE_TYPES.join(', ');

const scrollToFile = position => {
  const options = getScrollOptions({ offset: -25 });
  scrollTo(`documentScroll${position}`, options);
};

const { Element } = Scroll;

class AddFilesFormOld extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      checked: false,
      errorMessageCheckbox: null,
      canShowUploadModal: false,
      showRemoveFileModal: false,
      removeFileIndex: null,
      removeFileName: null,
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

  handleDocTypeChange = (docType, index) => {
    this.props.onFieldChange(`files[${index}].docType`, {
      value: docType,
      dirty: true,
    });
  };

  handlePasswordChange = (password, index) => {
    this.props.onFieldChange(`files[${index}].password`, {
      value: password,
      dirty: true,
    });
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

      this.setState({ canShowUploadModal: true });

      if (this.state.checked) {
        this.props.onSubmit();
        return;
      }
    }

    this.props.onDirtyFields();
  };

  removeFileConfirmation = (fileIndex, fileName) => {
    this.setState({
      showRemoveFileModal: true,
      removeFileIndex: fileIndex,
      removeFileName: fileName,
    });
  };

  render() {
    const showUploadModal =
      this.props.uploading && this.state.canShowUploadModal;

    return (
      <>
        <va-additional-info
          class="vads-u-margin-y--2"
          trigger="Need to mail your files?"
        >
          {mailMessage}
        </va-additional-info>
        <Element name="filesList" />
        <div>
          <VaFileInput
            id="file-upload"
            error={this.getErrorMessage()}
            label="Select files to upload"
            accept={FILE_TYPES.map(type => `.${type}`).join(', ')}
            onVaChange={e => this.add(e.detail.files)}
            button-text="Add Files"
            name="fileUpload"
            additionalErrorClass="claims-upload-input-error-message"
            aria-describedby="file-requirements"
            uswds="false"
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
                      <span
                        className="document-title"
                        data-dd-privacy="mask"
                        data-dd-action-name="document title"
                      >
                        {file.name}
                      </span>
                    </div>
                    <div>{displayFileSize(file.size)}</div>
                  </div>
                  <div className="remove-document-button">
                    <va-button
                      secondary
                      text="Remove"
                      onClick={() => {
                        this.removeFileConfirmation(index, file.name);
                      }}
                    />
                  </div>
                </div>
                {isEncrypted && (
                  <>
                    <p className="clearfix">
                      This is an encrypted PDF document. In order for us to be
                      able to view the document, we will need the password to
                      decrypt it.
                    </p>
                    <VaTextInput
                      required
                      error={
                        validateIfDirty(password, isNotBlank)
                          ? undefined
                          : 'Please provide a password to decrypt this file'
                      }
                      label="PDF password"
                      name="password"
                      onInput={e =>
                        this.handlePasswordChange(e.target.value, index)
                      }
                    />
                  </>
                )}
                <VaSelect
                  required
                  error={
                    validateIfDirty(docType, isNotBlank)
                      ? undefined
                      : 'Please provide a response'
                  }
                  name="docType"
                  label="What type of document is this?"
                  value={docType}
                  onVaSelect={e =>
                    this.handleDocTypeChange(e.detail.value, index)
                  }
                >
                  {DOC_TYPES.map(doc => (
                    <option key={doc.value} value={doc.value}>
                      {doc.label}
                    </option>
                  ))}
                </VaSelect>
              </div>
            </div>
          ),
        )}
        <VaCheckbox
          onVaChange={event => {
            this.setState({ checked: event.detail.checked });
          }}
          checked={this.state.checked}
          error={this.state.errorMessageCheckbox}
          label="The files I uploaded are supporting documents for this claim only."
        />
        <div className="vads-u-padding-top--2 vads-u-padding-bottom--2 vads-u-padding-left--4">
          To submit supporting documents for a new disability claim, please
          visit our{' '}
          <a href="/disability/how-to-file-claim">How to File a Claim</a> page.
        </div>
        <div>
          <VaButton
            text="Submit Files for Review"
            class="submit-files-button"
            onClick={this.submit}
          />
          <Link to={this.props.backUrl} className="claims-files-cancel">
            Cancel
          </Link>
        </div>
        <RemoveFileModal
          removeFile={() => {
            this.props.onRemoveFile(this.state.removeFileIndex);
          }}
          showRemoveFileModal={this.state.showRemoveFileModal}
          removeFileName={this.state.removeFileName}
          closeModal={() => {
            this.setState({
              showRemoveFileModal: false,
              removeFileIndex: null,
              removeFileName: null,
            });
          }}
        />
        <VaModal
          id="upload-status"
          onCloseEvent={() => this.setState({ canShowUploadModal: false })}
          visible={showUploadModal}
        >
          <UploadStatus
            progress={this.props.progress}
            files={this.props.files.length}
            onCancel={this.props.onCancel}
          />
        </VaModal>
      </>
    );
  }
}

AddFilesFormOld.propTypes = {
  field: PropTypes.object.isRequired,
  files: PropTypes.array.isRequired,
  onAddFile: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDirtyFields: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onRemoveFile: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  backUrl: PropTypes.string,
  mockReadAndCheckFile: PropTypes.func,
  progress: PropTypes.number,
  uploading: PropTypes.bool,
};

export default AddFilesFormOld;
