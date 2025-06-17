import PropTypes from 'prop-types';
import React from 'react';
import { Toggler } from '~/platform/utilities/feature-toggles';

import {
  VaModal,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  checkIsEncryptedPdf,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';

import {
  validateIfDirty,
  isValidFile,
  isValidDocument,
  isValidFileSize,
  isEmptyFileSize,
  isValidFileType,
  isPdf,
  MAX_FILE_SIZE_MB,
  MAX_PDF_SIZE_MB,
} from '../../utils/validations';
import UploadStatus from '../UploadStatus';
import mailMessage from '../MailMessage';
import FileInputMultiple from './FileInputMultiple';

class AddFilesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      canShowUploadModal: false,
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
      // Note that the lighthouse api changes the file type to a pdf and the name is then updated as well.
      // After submitting a file you will see this change in the Documents Filed section.
      // EX: test.jpg ->> test.pdf
      onAddFile([file], extraData);
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
      this.setState({ canShowUploadModal: true });
      this.props.onSubmit();
      return;
    }

    this.props.onDirtyFields();
  };

  render() {
    const showUploadModal =
      this.props.uploading && this.state.canShowUploadModal;

    return (
      <>
        <div className="add-files-form">
          <Toggler
            toggleName={Toggler.TOGGLE_NAMES.cstFriendlyEvidenceRequests}
          >
            <Toggler.Enabled>
              <div>
                {!this.props.fileTab && (
                  <>
                    <h2>Upload documents</h2>
                    <p>
                      If you have a document to upload, you can do that here.
                    </p>
                  </>
                )}
              </div>
            </Toggler.Enabled>
          </Toggler>
          <FileInputMultiple />
        </div>
        <VaButton
          id="submit"
          text="Submit documents for review"
          onClick={this.submit}
        />
        <va-additional-info
          class="vads-u-margin-y--3"
          trigger="Need to mail your documents?"
        >
          {mailMessage}
        </va-additional-info>
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
  fileTab: PropTypes.bool,
  mockReadAndCheckFile: PropTypes.func,
  progress: PropTypes.number,
  uploading: PropTypes.bool,
};

export default AddFilesForm;
