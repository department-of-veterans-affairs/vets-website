import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AddFilesForm from './AddFilesForm';
import Notification from '../Notification';
import FilesOptional from './FilesOptional';
import FilesNeeded from './FilesNeeded';

import { setPageFocus, focusNotificationAlert } from '../../utils/page';
import {
  addFile,
  removeFile,
  submitFiles,
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

const filesPath = `../files`;

class AdditionalEvidencePage extends React.Component {
  componentDidMount() {
    this.props.resetUploads();
    this.scrollToSection();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(props) {
    if (props.uploadComplete) {
      this.goToFilesPage();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading && prevProps.loading) {
      setPageFocus();
    }
    if (this.props.location.hash !== prevProps.location.hash) {
      this.scrollToSection();
    }
  }

  componentWillUnmount() {
    if (!this.props.uploadComplete) {
      this.props.clearAdditionalEvidenceNotification();
    }
  }

  onSubmitFiles(claimId) {
    // Always use Lighthouse endpoint (no more feature flag checks)
    this.props.submitFiles(claimId, null, this.props.files);
  }

  scrollToSection = () => {
    if (this.props.location.hash === '#add-files') {
      setPageFocus('h3#add-files');
    }
  };

  goToFilesPage() {
    this.props.getClaim(this.props.claim.id);
    this.props.navigate(filesPath);
  }

  render() {
    const { claim, lastPage } = this.props;

    let content;

    const isOpen = isClaimOpen(
      claim.attributes.status,
      claim.attributes.closeDate,
    );

    if (this.props.loading) {
      content = (
        <va-loading-indicator
          set-focus
          message="Loading your claim information..."
        />
      );
    } else {
      const { message, filesNeeded } = this.props;
      content = (
        <div className="additional-evidence-container">
          {message && (
            <>
              <Notification
                title={message.title}
                body={message.body}
                type={message.type}
                onSetFocus={focusNotificationAlert}
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
              {this.props.filesOptional.map(item => (
                <FilesOptional key={item.id} id={claim.id} item={item} />
              ))}
              <AddFilesForm
                field={this.props.uploadField}
                progress={this.props.progress}
                uploading={this.props.uploading}
                files={this.props.files}
                backUrl={lastPage ? `/${lastPage}` : filesPath}
                onSubmit={() => {
                  this.onSubmitFiles(claim.id);
                }}
                onAddFile={this.props.addFile}
                onRemoveFile={this.props.removeFile}
                onFieldChange={this.props.updateField}
                onCancel={this.props.cancelUpload}
                onDirtyFields={this.props.setFieldsDirty}
                fileTab
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
  }
}

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
  };
}

const mapDispatchToProps = {
  addFile,
  removeFile,
  submitFiles,
  updateField,
  cancelUpload,
  getClaim: getClaimAction,
  setFieldsDirty,
  resetUploads,
  clearAdditionalEvidenceNotification,
};

AdditionalEvidencePage.propTypes = {
  addFile: PropTypes.func,
  cancelUpload: PropTypes.func,
  claim: PropTypes.object,
  clearAdditionalEvidenceNotification: PropTypes.func,
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
