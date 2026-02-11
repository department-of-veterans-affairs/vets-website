import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AddFilesForm from './AddFilesForm';
import Notification from '../Notification';
import { DemoNotation } from '../../demo';

import { setPageFocus, focusNotificationAlert } from '../../utils/page';
import {
  submitFiles,
  cancelUpload,
  getClaim as getClaimAction,
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
  }

  componentWillUnmount() {
    if (!this.props.uploadComplete) {
      this.props.clearAdditionalEvidenceNotification();
    }
  }

  onSubmitFiles(claimId, files) {
    this.props.submitFiles(
      claimId,
      null,
      files,
      this.props.showDocumentUploadStatus,
      this.props.timezoneMitigationEnabled,
    );
  }

  goToFilesPage() {
    this.props.getClaim(this.props.claim.id);
    this.props.navigate(filesPath);
  }

  render() {
    const { claim } = this.props;

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
      const { message } = this.props;
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
            {this.props.additionalEvidenceTitle || 'Additional evidence'}
          </h3>
          {isOpen ? (
            <>
              <DemoNotation
                theme="removed"
                title="Individual request alerts"
                before="FilesNeeded and FilesOptional alerts displayed here (duplicated from Status tab)"
                after={
                  'Removed - users redirected via "Review your requests" alert to Status tab'
                }
              />
              <AddFilesForm
                fileTab
                progress={this.props.progress}
                uploading={this.props.uploading}
                onCancel={this.props.cancelUpload}
                onSubmit={files => this.onSubmitFiles(claim.id, files)}
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
    uploading: claimsState.uploads.uploading,
    progress: claimsState.uploads.progress,
    uploadError: claimsState.uploads.uploadError,
    uploadComplete: claimsState.uploads.uploadComplete,
    message: claimsState.notifications.additionalEvidenceMessage,
    filesNeeded: getFilesNeeded(trackedItems),
    filesOptional: getFilesOptional(trackedItems),
    showDocumentUploadStatus:
      state.featureToggles?.cst_show_document_upload_status || false,
    timezoneMitigationEnabled:
      state.featureToggles?.cst_timezone_discrepancy_mitigation || false,
  };
}

const mapDispatchToProps = {
  submitFiles,
  cancelUpload,
  getClaim: getClaimAction,
  resetUploads,
  clearAdditionalEvidenceNotification,
};

AdditionalEvidencePage.propTypes = {
  additionalEvidenceTitle: PropTypes.string,
  cancelUpload: PropTypes.func,
  claim: PropTypes.object,
  clearAdditionalEvidenceNotification: PropTypes.func,
  filesNeeded: PropTypes.array,
  filesOptional: PropTypes.array,
  getClaim: PropTypes.func,
  loading: PropTypes.bool,
  location: PropTypes.object,
  message: PropTypes.object,
  navigate: PropTypes.func,
  params: PropTypes.object,
  progress: PropTypes.number,
  resetUploads: PropTypes.func,
  showDocumentUploadStatus: PropTypes.bool,
  submitFiles: PropTypes.func,
  timezoneMitigationEnabled: PropTypes.bool,
  uploadComplete: PropTypes.bool,
  uploadError: PropTypes.bool,
  uploading: PropTypes.bool,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AdditionalEvidencePage),
);

export { AdditionalEvidencePage };
