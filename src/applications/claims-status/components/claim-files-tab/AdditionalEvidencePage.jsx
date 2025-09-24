import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AddFilesForm from './AddFilesForm';
import Notification from '../Notification';
import FilesOptional from './FilesOptional';
import FilesNeeded from './FilesNeeded';

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

  onSubmitFiles(claimId, files) {
    this.props.submitFiles(claimId, null, files);
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
          <div className="alert-demo-text">
            Additional Evidence Page - Success Notification <br />
            Triggered by: All files upload successfully (but user would be
            redirected to Files tab)
          </div>
          <Notification
            title="Success"
            body="If your uploaded file doesn't appear in the Documents Filed section on this page, please try refreshing the page."
            type="success"
            onSetFocus={focusNotificationAlert}
          />
          <div className="alert-demo-text">
            Additional Evidence Page - Error Notification <br />
            Triggered by: File upload fails (duplicate, invalid claimant, or
            other error)
          </div>
          <Notification
            title="You've already uploaded example-file.pdf"
            body={
              <>
                It can take up to 2 days for the file to show up in{' '}
                <va-link
                  text="your list of documents filed"
                  href={`/track-claims/your-claims/${claim.id}/files`}
                />
                . Try checking back later before uploading again.
              </>
            }
            type="error"
            onSetFocus={focusNotificationAlert}
          />
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
  submitFiles: PropTypes.func,
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
