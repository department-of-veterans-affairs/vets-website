import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { DownloadLink, getFileSizeMB } from '../config/helpers';

const idList = numberOfIDs => {
  const ids = [];
  for (let i = 0; i < numberOfIDs; i++) {
    ids.push(`askVA_upload_${i}`);
  }
  return ids;
};

const FileUpload = props => {
  const {
    acceptFileTypes = '.pdf,.jpeg,.png,.jpg',
    buttonText = 'Upload file',
    label = 'Select optional files to upload',
    hint = 'You can upload a .pdf, .jpeg, or .png file that is less than 25 MB in size',
    // success = null,
  } = props;

  const first = 'askVA_upload_first';
  const errorMessage = 'File must be less than 25 MB';
  const uploadIDs = idList(10);
  const [attachments, setAttachments] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const route = useSelector(state => state.navigation.route.path);

  const clearError = fileID => {
    if (fileErrors) {
      const filterIDs = fileErrors.filter(id => fileID !== id);
      setFileErrors(filterIDs);
    }
  };

  const deleteExistingFile = fileID => {
    const uploadedFiles = localStorage.getItem('askVAFiles');
    const parseFiles = JSON.parse(uploadedFiles);
    const removedFile = parseFiles.filter(file => file.fileID !== fileID);
    localStorage.askVAFiles = JSON.stringify(removedFile);
    setExistingFiles(existingFiles.filter(file => file.fileID !== fileID));
  };

  const onRemoveFile = fileToRemoveID => {
    if (fileErrors.includes(fileToRemoveID)) {
      clearError(fileToRemoveID);
    } else {
      const uploadedFiles = localStorage.getItem('askVAFiles');
      const parseFiles = JSON.parse(uploadedFiles);
      const removedFile = parseFiles.filter(
        file => file.fileID !== fileToRemoveID,
      );
      localStorage.askVAFiles = JSON.stringify(removedFile);
      setAttachments(
        attachments.filter(file => file.fileID !== fileToRemoveID),
      );
    }
  };
  /* eslint-disable consistent-return */
  const onAddFile = event => {
    const { files } = event.detail;
    const inputID = event.srcElement['data-testid'];

    if (getFileSizeMB(files[0]?.size) > 25) {
      return setFileErrors([...new Set([...fileErrors, inputID])]);
    }

    if (fileErrors) clearError(inputID);

    if (files.length) {
      const currentFile = files[0];
      const reader = new FileReader();
      const storedFile = localStorage.getItem('askVAFiles');

      reader.readAsDataURL(currentFile);
      reader.onload = () => {
        const base64Img = reader.result;
        const imgData = {
          fileName: files[0].name,
          fileSize: files[0].size,
          fileType: files[0].type,
          base64: base64Img,
          fileID: _.uniqueId(`${event.target['data-testid']}`),
        };

        const questionFiles = storedFile
          ? [...JSON.parse(storedFile), imgData]
          : [imgData];
        localStorage.askVAFiles = JSON.stringify(questionFiles);
        setAttachments([...attachments, imgData]);
      };
    } else {
      onRemoveFile(event.target['data-testid']);
    }
  };

  // const renderAlert = () => {
  //   if (success === true) {
  //     return (
  //       <div className="usa-alert usa-alert--success usa-alert--slim">
  //         <div className="usa-alert__body">
  //           <p className="usa-alert__text">File attached successfully</p>
  //         </div>
  //       </div>
  //     );
  //   }
  //   if (success === false) {
  //     return (
  //       <div className="usa-alert usa-alert--error usa-alert--slim">
  //         <div className="usa-alert__body">
  //           <p className="usa-alert__text">Issue uploading your file</p>
  //         </div>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  const getUploadedFiles = () => {
    const storedFile = localStorage.getItem('askVAFiles');
    if (storedFile?.length > 0) {
      const files = JSON.parse(storedFile);
      setExistingFiles(files);
    }
  };

  useEffect(() => {
    if (existingFiles.length === 0) {
      getUploadedFiles();
    }
  }, []);

  const fileInputs = () => {
    return attachments.map((attachment, i) => {
      return (
        <VaFileInput
          key={i}
          accept={acceptFileTypes}
          data-testid={uploadIDs[i]}
          error={fileErrors.includes(uploadIDs[i]) ? errorMessage : ''}
          aria-label={label}
          name="usa-file-input"
          onVaChange={onAddFile}
          uswds
        />
      );
    });
  };

  return (
    <div>
      <div className="usa-form-group">
        {route === '/your-question' && (
          <div className="vads-u-width--full vads-u-justify-content--space-between vads-u-align-items--center">
            <dl className="review vads-u-margin-top--0 vads-u-margin-bottom--0">
              <dl className="review-row vads-u-border-top--0 vads-u-margin-top--0 vads-u-margin-bottom--0">
                {existingFiles.map(file => (
                  <div
                    key={`${file.fileID}-${file.fileName}-edit`}
                    className="review-page-attachments"
                  >
                    <dt
                      className=" form-review-panel-page-header vads-u-margin-bottom--2 vads-u-color--link-default"
                      key={`${file.fileID}-${file.fileName}`}
                    >
                      <va-icon icon="attach_file" size={3} />
                      <DownloadLink
                        fileUrl={file.base64}
                        fileName={file.fileName}
                        fileSize={file.fileSize}
                      />
                    </dt>
                    <dd className="vads-u-margin-right--0">
                      <va-button-icon
                        button-type="delete"
                        onClick={() => deleteExistingFile(file.fileID)}
                      />
                    </dd>
                  </div>
                ))}
              </dl>
            </dl>
          </div>
        )}
        <VaFileInput
          className="vads-u-margin-y--neg1"
          accept={acceptFileTypes}
          multiple="multiple"
          button-text={buttonText}
          data-testid={first}
          error={fileErrors.includes(first) ? errorMessage : ''}
          hint={hint}
          label={label}
          name="usa-file-input"
          onVaChange={onAddFile}
          uswds
        />
        {fileInputs()}
      </div>
    </div>
  );
};

FileUpload.propTypes = {
  acceptFileTypes: PropTypes.string,
  buttonText: PropTypes.string,
  enableAnalytics: PropTypes.bool,
  error: PropTypes.string,
  header: PropTypes.string,
  hint: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  showDescription: PropTypes.bool,
  success: PropTypes.bool,
};

export default FileUpload;
