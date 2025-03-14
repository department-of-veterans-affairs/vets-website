import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  isLOA3,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { DownloadLink, getFileSizeMB } from '../config/helpers';
import { askVAAttachmentStorage } from '../utils/StorageAdapter';

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
  } = props;

  const firstInputID = useMemo(() => {
    const uuid = nanoid();
    return `askVA_upload_${uuid}`;
  }, []);
  const uploadIDs = idList(10);
  const [attachments, setAttachments] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [indexDBError, setIndexDBError] = useState([]);
  const route = useSelector(state => state.navigation.route.path);

  const getErrorMessage = fileID => {
    if (indexDBError.length > 0 && indexDBError.includes(fileID)) {
      return 'Could not upload your file';
    }
    if (fileErrors.length > 0 && fileErrors.includes(fileID)) {
      return 'File must be less than 25 MB';
    }
    return null;
  };

  const clearError = fileID => {
    if (indexDBError) {
      const filterIDs = indexDBError.filter(id => fileID !== id);
      setIndexDBError(filterIDs);
    }
    if (fileErrors) {
      const filterIDs = fileErrors.filter(id => fileID !== id);
      setFileErrors(filterIDs);
    }
  };

  const deleteExistingFile = async fileID => {
    const uploadedFiles = await askVAAttachmentStorage.get('attachments');
    const removedFile = uploadedFiles.filter(file => file.fileID !== fileID);
    await askVAAttachmentStorage.set('attachments', removedFile);
    setExistingFiles(existingFiles.filter(file => file.fileID !== fileID));
  };

  const onRemoveFile = async fileToRemoveID => {
    if (
      fileErrors.includes(fileToRemoveID) ||
      indexDBError.includes(fileToRemoveID)
    ) {
      clearError(fileToRemoveID);
    } else {
      const uploadedFiles = await askVAAttachmentStorage.get('attachments');
      const removedFile = uploadedFiles.filter(
        file => file.fileID !== fileToRemoveID,
      );
      await askVAAttachmentStorage.set('attachments', removedFile);
      setAttachments(
        attachments.filter(file => file.fileID !== fileToRemoveID),
      );
    }
  };

  const setIndexData = async (newData, fileID) => {
    try {
      // Update IndexedDB
      await askVAAttachmentStorage.set('attachments', newData);
    } catch (error) {
      setIndexDBError([...new Set([...indexDBError, fileID])]);
    }
  };

  /* eslint-disable consistent-return */
  const onAddFile = async event => {
    const { files } = event.detail;
    const inputID = event.srcElement['data-testid'];

    if (getFileSizeMB(files[0]?.size) > 25) {
      return setFileErrors([...new Set([...fileErrors, inputID])]);
    }

    if (fileErrors) clearError(inputID);

    if (files.length) {
      const currentFile = files[0];
      const reader = new FileReader();
      const storedFiles = await askVAAttachmentStorage.get('attachments');
      reader.readAsDataURL(currentFile);
      reader.onload = () => {
        const base64Img = reader.result;
        const imgData = {
          fileName: files[0].name,
          fileSize: files[0].size,
          fileType: files[0].type,
          base64: base64Img,
          fileID: inputID,
        };

        const questionFiles = storedFiles
          ? [...storedFiles, imgData]
          : [imgData];
        setIndexData(questionFiles, imgData.fileID);
        setAttachments([...attachments, imgData]);
      };
    } else {
      onRemoveFile(event.target['data-testid']);
    }
  };

  const getUploadedFiles = async () => {
    const storedFiles = await askVAAttachmentStorage.get('attachments');
    if (storedFiles?.length > 0) {
      setExistingFiles(storedFiles);
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
          error={getErrorMessage(uploadIDs[i])}
          aria-label={label}
          name="usa-file-input"
          onVaChange={onAddFile}
          uswds
        />
      );
    });
  };

  return isLoggedIn && isLOA3 ? (
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
          data-testid={firstInputID}
          error={getErrorMessage(firstInputID)}
          hint={hint}
          label={label}
          name="usa-file-input"
          onVaChange={onAddFile}
          uswds
        />
        {fileInputs()}
      </div>
    </div>
  ) : null;
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
