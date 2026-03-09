import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Navigate } from 'react-router-dom-v5-compat';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import useSetPageTitle from '../../../hooks/useSetPageTitle';
import useSetFocus from '../../../hooks/useSetFocus';
import DocumentUpload from './DocumentUpload';
import TravelPayButtonPair from '../../shared/TravelPayButtonPair';
import { uploadProofOfAttendance } from '../../../redux/actions';
import {
  selectAppointment,
  selectProofOfAttendanceState,
} from '../../../redux/selectors';
import { toBase64 } from './ExpensePage';

const ProofOfAttendancePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { apptId, claimId } = useParams();

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const isCommunityCareEnabled = useToggleValue(
    TOGGLE_NAMES.travelPayEnableCommunityCare,
  );

  const { data: appointment } = useSelector(selectAppointment);
  const { isLoading: isUploading } = useSelector(selectProofOfAttendanceState);

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [uploadError, setUploadError] = useState(false);

  const title = 'Proof of attendance';
  useSetPageTitle(title);
  useSetFocus();

  // Only show this page for community care appointments with the flag enabled
  const isCCAppt = appointment?.isCC;
  if (!isCommunityCareEnabled || !isCCAppt) {
    return (
      <Navigate
        to={`/file-new-claim/${apptId}/${claimId}/choose-expense`}
        replace
      />
    );
  }

  const handleDocumentChange = event => {
    const selectedFile = event?.detail?.files?.[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }
    const extension = selectedFile.name.split('.').pop();
    const renamedFile = new File(
      [selectedFile],
      `proof-of-attendance.${extension}`,
      { type: selectedFile.type },
    );
    setFile(renamedFile);
    setFileError(null);
  };

  const handleFileInputError = event => {
    const errorMessage = event?.detail?.error;
    if (errorMessage) {
      setFileError(errorMessage);
      setFile(null);
    }
  };

  const handleContinue = async () => {
    if (!file) {
      setFileError('Please upload your proof of attendance to continue.');
      return;
    }

    setUploadError(false);
    try {
      const fileData = await toBase64(file);
      await dispatch(
        uploadProofOfAttendance(claimId, {
          contentType: file.type,
          fileName: file.name,
          length: file.size,
          fileData,
        }),
      );
      navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
    } catch {
      setUploadError(true);
    }
  };

  const handleBack = () => {
    navigate(`/file-new-claim/${apptId}`, { state: { skipRedirect: true } });
  };

  return (
    <div data-testid="proof-of-attendance-page">
      <h1>{title}</h1>
      {uploadError && (
        <va-alert
          close-btn-aria-label="Close notification"
          status="error"
          visible
        >
          <h2 slot="headline">Something went wrong on our end</h2>
          <p className="vads-u-margin-y--0">
            We’re sorry. We couldn’t add this file. Refresh this page or try
            again later.
          </p>
        </va-alert>
      )}
      <p>
        To request travel pay for a community care appointment, you’ll need to
        submit proof that you attended the appointment.
      </p>
      <p className="vads-u-margin-bottom--0">
        Proof of attendance can include these documents:
      </p>
      <ul className="vads-u-margin-top--0">
        <li>A work or school release note from the community provider</li>
        <li>
          A document on the community provider letterhead showing the date your
          appointment was completed
        </li>
      </ul>
      <DocumentUpload
        currentDocument={file}
        error={fileError}
        handleDocumentChange={handleDocumentChange}
        onVaFileInputError={handleFileInputError}
        label="Upload your proof of attendance"
        additionalHint
      />
      <TravelPayButtonPair
        continueText="Continue"
        backText="Back"
        onContinue={handleContinue}
        onBack={handleBack}
        loading={isUploading}
        className="vads-u-margin-top--7"
      />
    </div>
  );
};

export default ProofOfAttendancePage;
