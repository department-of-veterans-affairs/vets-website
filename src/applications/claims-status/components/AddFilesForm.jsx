import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Scroll from 'react-scroll';

import FileInput from '@department-of-veterans-affairs/component-library/FileInput';
import Select from '@department-of-veterans-affairs/component-library/Select';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';

import Modal from '@department-of-veterans-affairs/component-library/Modal';

import recordEvent from 'platform/monitoring/record-event';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { checkForEncryptedPdf } from 'platform/forms-system/src/js/utilities/file';

import UploadStatus from './UploadStatus';
import MailOrFax from './MailOrFax';
import { displayFileSize, DOC_TYPES, getTopPosition } from '../utils/helpers';
import { getScrollOptions } from 'platform/utilities/ui';
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
import { uploadPdfLimitFeature } from '../utils/appeals-v2-helpers';

const displayTypes = FILE_TYPES.join(', ');

const scrollToFile = position => {
  const options = getScrollOptions({ offset: -25 });
  Scroll.scroller.scrollTo(`documentScroll${position}`, options);
};
const scrollToError = () => {
  const errors = document.querySelectorAll('.usa-input-error');
  if (errors.length) {
    const errorPosition = getTopPosition(errors[0]);
    const options = getScrollOptions({ offset: -25 });
    Scroll.animateScroll.scrollTo(errorPosition, options);
    errors[0].querySelector('label').focus();
  }
};
const Element = Scroll.Element;

class AddFilesForm extends React.Component {
  state = {
    errorMessage: null,
    checked: false,
    errorMessageCheckbox: null,
  };

  getErrorMessage = () => {
    if (this.state.errorMessage) {
      return this.state.errorMessage;
    }
    return validateIfDirty(this.props.field, () => this.props.files.length > 0)
      ? undefined
      : 'Please select a file first';
  };

  isFileEncrypted = async file =>
    checkForEncryptedPdf(file)
      .then(isEncrypted => isEncrypted)
      // This _should_ only happen if a file is deleted after the user selects
      // it for upload
      .catch(() => false);

  add = async files => {
    const file = files[0];
    const { requestLockedPdfPassword, onAddFile, pdfSizeFeature } = this.props;
    const extraData = {};
    const hasPdfSizeLimit = isPdf(file) && pdfSizeFeature;

    if (isValidFile(file, pdfSizeFeature)) {
      // Check if the file is an encrypted PDF
      if (
        requestLockedPdfPassword && // feature flag
        file.name?.toLowerCase().endsWith('pdf')
      ) {
        extraData.isEncrypted = await this.isFileEncrypted(file);
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
    } else if (!isValidFileSize(file, pdfSizeFeature)) {
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
    this.setState(
      this.state.checked
        ? { errorMessageCheckbox: null }
        : { errorMessageCheckbox: 'Please accept the above' },
    );

    const { files } = this.props;
    const hasPasswords = files.every(
      file => !file.isEncrypted || (file.isEncrypted && file.password.value),
    );

    if (
      files.length > 0 &&
      files.every(isValidDocument) &&
      hasPasswords &&
      this.state.checked
    ) {
      this.props.onSubmit();
    } else {
      this.props.onDirtyFields();
      setTimeout(scrollToError);
    }
  };

  render() {
    return (
      <div>
        <div>
          <p>
            <a
              href="#"
              onClick={evt => {
                evt.preventDefault();
                recordEvent({
                  event: 'claims-mailfax-modal',
                });
                this.props.onShowMailOrFax(true);
              }}
            >
              Need to mail or fax your files
            </a>
            ?
          </p>
        </div>
        <Element name="filesList" />
        <div>
          <FileInput
            errorMessage={this.getErrorMessage()}
            label={
              <span className="claims-upload-input-title">
                Select files to upload
              </span>
            }
            accept={FILE_TYPES.map(type => `.${type}`).join(',')}
            onChange={this.add}
            buttonText="Add Files"
            name="fileUpload"
            additionalErrorClass="claims-upload-input-error-message"
          />
        </div>
        <div className="file-requirements">
          <p className="file-requirement-header">Accepted file types:</p>
          <p className="file-requirement-text">{displayTypes}</p>
          <p className="file-requirement-header">Maximum file size:</p>
          <p className="file-requirement-text">
            {`${MAX_FILE_SIZE_MB}MB${
              this.props.pdfSizeFeature ? ' (non-PDF)' : ''
            }`}
          </p>
          {this.props.pdfSizeFeature && (
            <p className="file-requirement-text">
              {`${MAX_PDF_SIZE_MB}MB (PDF only)`}
            </p>
          )}
        </div>
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
                      This is en encrypted PDF document. In order for us to be
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
                      label={'PDF password'}
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
            <div>
              <strong>
                The files I uploaded are supporting documents for this claim
                only.
              </strong>
              <div className="vads-u-padding-top--1">
                To submit supporting documents for a new disability claim,
                please visit our{' '}
                <a href={`/disability/how-to-file-claim`}>
                  How to File a Claim
                </a>{' '}
                page.
              </div>
            </div>
          }
        />
        <div>
          <button className="usa-button" onClick={this.submit}>
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
        <Modal
          onClose={() => true}
          visible={this.props.showMailOrFax}
          hideCloseButton
          focusSelector="button"
          cssClass=""
          contents={
            <MailOrFax onClose={() => this.props.onShowMailOrFax(false)} />
          }
        />
      </div>
    );
  }
}

AddFilesForm.propTypes = {
  files: PropTypes.array.isRequired,
  field: PropTypes.object.isRequired,
  uploading: PropTypes.bool,
  showMailOrFax: PropTypes.bool,
  backUrl: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onAddFile: PropTypes.func.isRequired,
  onRemoveFile: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDirtyFields: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  requestLockedPdfPassword: toggleValues(state).request_locked_pdf_password,
  pdfSizeFeature: uploadPdfLimitFeature(state),
});

export { AddFilesForm };

export default connect(mapStateToProps)(AddFilesForm);
