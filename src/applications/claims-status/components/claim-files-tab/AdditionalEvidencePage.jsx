import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getScrollOptions } from '@department-of-veterans-affairs/platform-utilities/ui';
import scrollTo from '@department-of-veterans-affairs/platform-utilities/scrollTo';
import { Element } from 'platform/utilities/scroll';

import AddFilesForm from './AddFilesForm';
import Notification from '../Notification';
import FilesOptional from './FilesOptional';
import FilesNeeded from './FilesNeeded';

import { benefitsDocumentsUseLighthouse } from '../../selectors';
import { setFocus, setPageFocus } from '../../utils/page';
import {
  addFile,
  removeFile,
  submitFiles,
  submitFilesLighthouse, // lighthouse
  updateField,
  cancelUpload,
  getClaim as getClaimAction,
  setFieldsDirty,
  resetUploads,
  clearAdditionalEvidenceNotification,
} from '../../actions';

import {
  getFilesNeeded,
  getFilesOptional,
  isClaimOpen,
} from '../../utils/helpers';
import withRouter from '../../utils/withRouter';

const filesPath = '../files';
const scrollToError = () => {
  const options = getScrollOptions({ offset: -25 });
  setTimeout(() => {
    scrollTo('uploadError', options);
    setFocus('.usa-alert-error');
  });
};

const AdditionalEvidencePage = (props) => {
  const {
    addFile,
    cancelUpload,
    claim,
    clearAdditionalEvidenceNotification: clearNotif,
    documentsUseLighthouse,
    files,
    filesNeeded,
    filesOptional,
    getClaim,
    lastPage,
    loading,
    location,
    message,
    navigate,
    progress,
    removeFile,
    resetUploads,
    setFieldsDirty,
    submitFiles,
    submitFilesLighthouse,
    trackedItem, // from mapState (not explicitly typed but available)
    updateField,
    uploadComplete,
    uploadField,
    uploading,
  } = props;

  /* --------------------------- componentDidMount ------------------------ */
  useEffect(() => {
    resetUploads();
    scrollToSection();              // initial hash check
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --------------------- UNSAFE_componentWillReceiveProps --------------- */
  useEffect(() => {
    if (uploadComplete) {
      getClaim(claim.id);
      navigate(filesPath);
    }
  }, [uploadComplete, getClaim, claim, navigate]);

  /* --------------------------- componentDidUpdate ----------------------- */
  const prevMessageRef = useRef(message);
  const prevLoadingRef = useRef(loading);
  const prevHashRef = useRef(location.hash);

  useEffect(() => {
    if (message && !prevMessageRef.current) {
      scrollToError();
    }
    prevMessageRef.current = message;
  }, [message]);

  useEffect(() => {
    if (!loading && prevLoadingRef.current) {
      setPageFocus();
    }
    prevLoadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    if (location.hash !== prevHashRef.current) {
      scrollToSection();
    }
    prevHashRef.current = location.hash;
  }, [location.hash]);

  /* ------------------------- componentWillUnmount ----------------------- */
  useEffect(() => {
    return () => {
      if (!uploadComplete) clearNotif();
    };
  }, [uploadComplete, clearNotif]);

  /* ------------------------------ helpers ------------------------------- */
  const onSubmitFiles = useCallback(() => {
    if (documentsUseLighthouse) {
      submitFilesLighthouse(claim.id, null, files);
    } else {
      submitFiles(claim.id, null, files);
    }
  }, [documentsUseLighthouse, submitFilesLighthouse, submitFiles, claim, files]);

  function scrollToSection() {
    if (location.hash === '#add-files') {
      setPageFocus('h3#add-files');
    }
  }

  /* ------------------------------ render -------------------------------- */
  const isOpen = isClaimOpen(
    claim.attributes.status,
    claim.attributes.closeDate,
  );

  let mainContent;
  if (loading) {
    mainContent = (
      <va-loading-indicator
        set-focus
        message="Loading your claim information..."
      />
    );
  } else {
    mainContent = (
      <div className="additional-evidence-container">
        {message && (
          <>
            <Element name="uploadError" />
            <Notification
              title={message.title}
              body={message.body}
              type={message.type}
            />
          </>
        )}

        <h3 id="add-files" className="vads-u-margin-bottom--3">
          Additional evidence
        </h3>

        {isOpen ? (
          <>
            {filesNeeded.map((item) => (
              <FilesNeeded
                key={item.id}
                id={claim.id}
                item={item}
                evidenceWaiverSubmitted5103={
                  claim.attributes.evidenceWaiverSubmitted5103
                }
                previousPage="files"
              />
            ))}

            {filesOptional.map((item) => (
              <FilesOptional key={item.id} id={claim.id} item={item} />
            ))}

            <AddFilesForm
              field={uploadField}
              progress={progress}
              uploading={uploading}
              files={files}
              backUrl={lastPage ? `/${lastPage}` : filesPath}
              onSubmit={onSubmitFiles}
              onAddFile={addFile}
              onRemoveFile={removeFile}
              onFieldChange={updateField}
              onCancel={cancelUpload}
              onDirtyFields={setFieldsDirty}
            />
          </>
        ) : (
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--4">
            The claim is closed so you can no longer submit any additional
            evidence.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div name="topScrollElement" />
      {mainContent}
    </>
  );
};

/* --------------------------- Redux wiring ------------------------------ */
function mapStateToProps(state) {
  const claimsState = state.disability.status;
  const claim = claimsState.claimDetail.detail;
  const { trackedItems } = claim.attributes;

  return {
    loading: claimsState.claimDetail.loading,
    claim,
    files: claimsState.uploads.files,
    uploading: claimsState.uploads.uploading,
    progress: claimsState.uploads.progress,
    uploadError: claimsState.uploads.uploadError,
    uploadComplete: claimsState.uploads.uploadComplete,
    uploadField: claimsState.uploads.uploadField,
    lastPage: claimsState.routing.lastPage,
    message: claimsState.notifications.additionalEvidenceMessage,
    filesNeeded: getFilesNeeded(trackedItems),
    filesOptional: getFilesOptional(trackedItems),
    documentsUseLighthouse: benefitsDocumentsUseLighthouse(state), // lighthouse
  };
}

const mapDispatchToProps = {
  addFile,
  removeFile,
  submitFiles,
  submitFilesLighthouse, // lighthouse
  updateField,
  cancelUpload,
  getClaim: getClaimAction,
  setFieldsDirty,
  resetUploads,
  clearAdditionalEvidenceNotification,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdditionalEvidencePage),
);

/* ------------------------------ types ---------------------------------- */
AdditionalEvidencePage.propTypes = {
  addFile: PropTypes.func,
  cancelUpload: PropTypes.func,
  claim: PropTypes.object,
  clearAdditionalEvidenceNotification: PropTypes.func,
  documentsUseLighthouse: PropTypes.bool,
  files: PropTypes.array,
  filesNeeded: PropTypes.array,
  filesOptional: PropTypes.array,
  getClaim: PropTypes.func,
  lastPage: PropTypes.string,
  loading: PropTypes.bool,
  location: PropTypes.object,
  message: PropTypes.object,
  navigate: PropTypes.func,
  progress: PropTypes.number,
  removeFile: PropTypes.func,
  resetUploads: PropTypes.func,
  setFieldsDirty: PropTypes.func,
  submitFiles: PropTypes.func,
  submitFilesLighthouse: PropTypes.func,
  updateField: PropTypes.func,
  uploadComplete: PropTypes.bool,
  uploadField: PropTypes.object,
  uploading: PropTypes.bool,
};

export { AdditionalEvidencePage };
