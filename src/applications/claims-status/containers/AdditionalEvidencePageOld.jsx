import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { getScrollOptions } from '@department-of-veterans-affairs/platform-utilities/ui';
import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';
import scrollTo from '@department-of-veterans-affairs/platform-utilities/scrollTo';
import AddFilesFormOld from '../components/AddFilesFormOld';
import Notification from '../components/Notification';
import EvidenceWarning from '../components/EvidenceWarning';
import { benefitsDocumentsUseLighthouse } from '../selectors';
import { setFocus, setPageFocus, setUpPage } from '../utils/page';
import withRouter from '../utils/withRouter';

import {
  addFile,
  removeFile,
  submitFiles,
  // START lighthouse_migration
  submitFilesLighthouse,
  // END lighthouse_migration
  updateField,
  cancelUpload,
  getClaim as getClaimAction,
  setFieldsDirty,
  resetUploads,
  clearAdditionalEvidenceNotification,
} from '../actions';

const scrollToError = () => {
  const options = getScrollOptions({ offset: -25 });

  setTimeout(() => {
    scrollTo('uploadError', options);
    setFocus('.usa-alert-error');
  });
};

const { Element } = Scroll;

const filesPath = '../files';

class AdditionalEvidencePageOld extends React.Component {
  componentDidMount() {
    this.props.resetUploads();
    if (!this.props.loading) {
      setUpPage();
    } else {
      scrollToTop();
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(props) {
    if (props.uploadComplete) {
      this.goToFilesPage();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.message && !prevProps.message) {
      scrollToError();
    }
    if (!this.props.loading && prevProps.loading) {
      setPageFocus();
    }
  }

  componentWillUnmount() {
    if (!this.props.uploadComplete) {
      this.props.clearAdditionalEvidenceNotification();
    }
  }

  goToFilesPage() {
    this.props.getClaim(this.props.claim.id);
    this.props.navigate(filesPath);
  }

  render() {
    let content;

    if (this.props.loading) {
      content = (
        <va-loading-indicator
          set-focus
          message="Loading your claim information..."
        />
      );
    } else {
      const { lastPage, message } = this.props;

      content = (
        <div className="claim-container">
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
          <EvidenceWarning />
          <AddFilesFormOld
            field={this.props.uploadField}
            progress={this.props.progress}
            uploading={this.props.uploading}
            files={this.props.files}
            backUrl={lastPage ? `/${lastPage}` : filesPath}
            onSubmit={() => {
              // START lighthouse_migration
              if (this.props.documentsUseLighthouse) {
                this.props.submitFilesLighthouse(
                  this.props.claim.id,
                  null,
                  this.props.files,
                );
              } else {
                this.props.submitFiles(
                  this.props.claim.id,
                  null,
                  this.props.files,
                );
              }
              // END lighthouse_migration
            }}
            onAddFile={this.props.addFile}
            onRemoveFile={this.props.removeFile}
            onFieldChange={this.props.updateField}
            onCancel={this.props.cancelUpload}
            onDirtyFields={this.props.setFieldsDirty}
          />
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
  return {
    loading: claimsState.claimDetail.loading,
    claim: claimsState.claimDetail.detail,
    files: claimsState.uploads.files,
    uploading: claimsState.uploads.uploading,
    progress: claimsState.uploads.progress,
    uploadError: claimsState.uploads.uploadError,
    uploadComplete: claimsState.uploads.uploadComplete,
    uploadField: claimsState.uploads.uploadField,
    lastPage: claimsState.routing.lastPage,
    message: claimsState.notifications.additionalEvidenceMessage,
    // START lighthouse_migration
    documentsUseLighthouse: benefitsDocumentsUseLighthouse(state),
    // END lighthouse_migration
  };
}

const mapDispatchToProps = {
  addFile,
  removeFile,
  submitFiles,
  updateField,
  cancelUpload,
  getClaim: getClaimAction,
  // START lighthouse_migration
  submitFilesLighthouse,
  // END lighthouse_migration
  setFieldsDirty,
  resetUploads,
  clearAdditionalEvidenceNotification,
};

AdditionalEvidencePageOld.propTypes = {
  addFile: PropTypes.func,
  cancelUpload: PropTypes.func,
  claim: PropTypes.object,
  clearAdditionalEvidenceNotification: PropTypes.func,
  // START lighthouse_migration
  documentsUseLighthouse: PropTypes.bool,
  // END lighthouse_migration
  files: PropTypes.array,
  getClaim: PropTypes.func,
  lastPage: PropTypes.string,
  loading: PropTypes.bool,
  message: PropTypes.object,
  navigate: PropTypes.func,
  progress: PropTypes.number,
  removeFile: PropTypes.func,
  resetUploads: PropTypes.func,
  setFieldsDirty: PropTypes.func,
  submitFiles: PropTypes.func,
  // START lighthouse_migration
  submitFilesLighthouse: PropTypes.func,
  // END lighthouse_migration
  updateField: PropTypes.func,
  uploadComplete: PropTypes.bool,
  uploadField: PropTypes.object,
  uploading: PropTypes.bool,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AdditionalEvidencePageOld),
);

export { AdditionalEvidencePageOld };
