import React, { useState } from 'react';

import {
  VaButtonPair,
  VaFileInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getFormNumber, uploadScannedForm } from '../helpers';
import FormPage from './FormPage';

const UploadPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [file, setFile] = useState({});
  const [fileInputError, setFileInputError] = useState('');

  const location = useLocation();
  const formNumber = getFormNumber(location);

  const onClickContinue = () => {
    if (Object.keys(file).length === 0) {
      setFileInputError(`Upload a completed form ${formNumber}`);
    } else {
      history.push(`/${formNumber}/review`, { file });
    }
  };
  const onFileUploaded = uploadedFile => {
    if (uploadedFile.confirmationCode) {
      setFileInputError('');
      setFile(uploadedFile);
    }
  };
  const onVaChange = e =>
    dispatch(uploadScannedForm(formNumber, e.detail.files[0], onFileUploaded));

  return (
    <FormPage currentLocation={1} pageTitle="Upload your file">
      <p className="vads-u-margin-top--0">
        You’ll need to scan your document onto the device you’re using to submit
        this application, such as your computer, tablet, or mobile phone. You
        can upload your document from there.
      </p>
      <div>
        <p>Guidelines for uploading a file:</p>
        <ul>
          <li>You can upload a .pdf, .jpeg, or .png file</li>
          <li>Your file should be no larger than 25MB</li>
        </ul>
      </div>
      <VaFileInput
        accept=".pdf,.jpeg,.png"
        error={fileInputError}
        hint={null}
        label={`Upload VA Form ${formNumber}`}
        name="form-upload-file-input"
        onVaChange={onVaChange}
        className="vads-u-margin-bottom--5"
        required
        uswds
      />
      <VaButtonPair
        class="vads-u-margin-top--0"
        data-testid="upload-button-pair"
        continue
        onPrimaryClick={onClickContinue}
        onSecondaryClick={history.goBack}
        uswds
      />
    </FormPage>
  );
};

export default UploadPage;
