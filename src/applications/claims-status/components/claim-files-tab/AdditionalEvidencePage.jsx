import React, { useEffect, useRef } from 'react';
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
  submitFilesLighthouse,
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

const scrollToError = () => {
  const options = getScrollOptions({ offset: -25 });

  setTimeout(() => {
    scrollTo('uploadError', options);
    setFocus('.usa-alert-error');
  });
};

const filesPath = `../files`;

const AdditionalEvidencePage = props => {
  const latestUploadCompleteRef = useRef(props.uploadComplete);
  const prevMessageRef = useRef(null);
  const prevLoadingRef = useRef(props.loading);
  const prevHashRef = useRef(props.location.hash);

  const scrollToSection = () => {
    if (props.location.hash === '#add-files') {
      setPageFocus('h3#add-files');
    }
  };

  const goToFilesPage = () => {
    props.getClaim(props.claim.id);
    props.navigate(filesPath);
  };

  const onSubmitFiles = claimId => {
    if (props.documentsUseLighthouse) {
      props.submitFilesLighthouse(claimId, null, props.files);
    } else {
      props.submitFiles(claimId, null, props.files);
    }
  };

  useEffect(() => {
    props.resetUploads();
    scrollToSection();
  }, []);

  useEffect(
    () => {
      latestUploadCompleteRef.current = props.uploadComplete;
    },
    [props.uploadComplete],
  );

  useEffect(
    () => () => {
      if (!latestUploadCompleteRef.current) {
        props.clearAdditionalEvidenceNotification();
      }
    },
    [],
  );

  useEffect(
    () => {
      if (props.uploadComplete) {
        goToFilesPage();
      }
    },
    [props.uploadComplete],
  );

  useEffect(
    () => {
      if (props.message && !prevMessageRef.current) {
        scrollToError();
      }
      if (!props.loading && prevLoadingRef.current) {
        setPageFocus();
      }
      if (props.location.hash !== prevHashRef.current) {
        scrollToSection();
      }

      prevMessageRef.current = props.message;
      prevLoadingRef.current = props.loading;
      prevHashRef.current = props.location.hash;
    },
    [props.message, props.loading, props.location.hash],
  );

  const { claim, lastPage } = props;

  let content;

  const isOpen = isClaimOpen(
    claim.attributes.status,
    claim.attributes.closeDate,
  );

  if (props.loading) {
    content = (
      <va-loading-indicator
        set-focus
        message="Loading your claim information..."
      />
    );
  } else {
    const { message, filesNeeded } = props;

    content = (
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
            {filesNeeded.map(item => (
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
            {props.filesOptional.map(item => (
              <FilesOptional key={item.id} id={claim.id} item={item} />
            ))}
            <AddFilesForm
              field={props.uploadField}
              progress={props.progress}
              uploading={props.uploading}
              files={props.files}
              backUrl={lastPage ? `/${lastPage}` : filesPath}
              onSubmit={() => {
                onSubmitFiles(claim.id);
              }}
              onAddFile={props.addFile}
              onRemoveFile={props.removeFile}
              onFieldChange={props.updateField}
              onCancel={props.cancelUpload}
              onDirtyFields={props.setFieldsDirty}
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
      {content}
    </>
  );
};

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
    documentsUseLighthouse: benefitsDocumentsUseLighthouse(state),
  };
}

const mapDispatchToProps = {
  addFile,
  removeFile,
  submitFiles,
  updateField,
  cancelUpload,
  getClaim: getClaimAction,
  submitFilesLighthouse,
  setFieldsDirty,
  resetUploads,
  clearAdditionalEvidenceNotification,
};

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
  params: PropTypes.object,
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AdditionalEvidencePage),
);

export { AdditionalEvidencePage };
