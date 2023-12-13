import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash';
import { withRouter, Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollTo from 'platform/utilities/ui/scrollTo';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

import DocumentRequestPageContent from '../components/evss/DocumentRequestPageContent';
import AddFilesForm from '../components/AddFilesForm';
import AskVAQuestions from '../components/AskVAQuestions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import DueDate from '../components/DueDate';
import Notification from '../components/Notification';
import {
  addFile,
  removeFile,
  submitFiles,
  // START lighthouse_migration
  submitFilesLighthouse,
  // END lighthouse_migration
  resetUploads,
  updateField,
  cancelUpload,
  // START lighthouse_migration
  getClaim as getClaimAction,
  getClaimDetail as getClaimEVSSAction,
  // END lighthouse_migration
  setFieldsDirty,
  clearNotification,
} from '../actions';
import { scrubDescription } from '../utils/helpers';
import { setPageFocus, setUpPage } from '../utils/page';
// START lighthouse_migration
import { cstUseLighthouse, benefitsDocumentsUseLighthouse } from '../selectors';
// END lighthouse_migration

const scrollToError = () => {
  const options = _.merge({}, window.VetsGov.scroll, { offset: -25 });
  scrollTo('uploadError', options);
};
const { Element } = Scroll;

class DocumentRequestPage extends React.Component {
  componentDidMount() {
    this.props.resetUploads();
    if (this.props.trackedItem) {
      document.title = `Request for ${this.props.trackedItem.displayName}`;
    } else {
      document.title = 'Document Request';
    }
    if (!this.props.loading) {
      setUpPage();
    } else {
      scrollToTop();
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(props) {
    if (!props.loading && !props.trackedItem) {
      this.props.router.replace(`/your-claims/${this.props.params.id}/status`);
    }
    if (props.uploadComplete) {
      this.goToFilesPage();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.message && !prevProps.message) {
      document.querySelector('.claims-alert').focus();
      scrollToError();
    }
    if (!this.props.loading && prevProps.loading) {
      setPageFocus();
    }
  }

  componentWillUnmount() {
    if (!this.props.uploadComplete) {
      this.props.clearNotification();
    }
  }

  getPageContent() {
    const { trackedItem, useLighthouse } = this.props;
    if (!useLighthouse) {
      return <DocumentRequestPageContent trackedItem={trackedItem} />;
    }

    return (
      <>
        <h1 className="claims-header">{trackedItem.displayName}</h1>
        {trackedItem.status === 'NEEDED_FROM_YOU' ? (
          <DueDate date={trackedItem.suspenseDate} />
        ) : null}
        {trackedItem.status === 'NEEDED_FROM_OTHERS' ? (
          <div className="optional-upload">
            <p>
              <strong>Optional</strong> - We’ve asked others to send this to us,
              but you may upload it if you have it.
            </p>
          </div>
        ) : null}
        <p>{scrubDescription(trackedItem.description)}</p>
      </>
    );
  }

  goToFilesPage() {
    // START lighthouse_migration
    if (this.props.useLighthouse) {
      this.props.getClaimLighthouse(this.props.claim.id);
    } else {
      this.props.getClaimEVSS(this.props.claim.id);
    }
    // END lighthouse_migration
    this.props.router.push(`your-claims/${this.props.claim.id}/files`);
  }

  render() {
    let content;
    const filesPath = `your-claims/${this.props.params.id}/files`;
    const { trackedItem } = this.props;

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
        <>
          {message && (
            <div>
              <Element name="uploadError" />
              <Notification
                title={message.title}
                body={message.body}
                type={message.type}
              />
            </div>
          )}
          {this.getPageContent()}
          <AddFilesForm
            field={this.props.uploadField}
            progress={this.props.progress}
            uploading={this.props.uploading}
            files={this.props.files}
            backUrl={this.props.lastPage || filesPath}
            onSubmit={() => {
              // START lighthouse_migration
              if (this.props.documentsUseLighthouse) {
                this.props.submitFilesLighthouse(
                  this.props.claim.id,
                  trackedItem,
                  this.props.files,
                );
              } else {
                this.props.submitFiles(
                  this.props.claim.id,
                  trackedItem,
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
        </>
      );
    }

    const docRequest = this.props.loading ? (
      <span>Document request</span>
    ) : (
      <Link
        to={`your-claims/${this.props.params.id}/document-request/${
          trackedItem.id
        }`}
      >
        Document request
      </Link>
    );

    return (
      <div>
        <div name="topScrollElement" />
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12">
              <ClaimsBreadcrumbs>
                <Link to={filesPath}>Status details</Link>
                {docRequest}
              </ClaimsBreadcrumbs>
            </div>
          </div>
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
              {content}
            </div>
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 help-sidebar">
              <AskVAQuestions />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const claimsState = state.disability.status;
  const { claimDetail, uploads } = claimsState;
  const useLighthouse = cstUseLighthouse(state, 'show');

  let trackedItems = [];
  let trackedItem = null;
  if (claimDetail.detail) {
    const { attributes } = claimDetail.detail;
    const { trackedItemId } = ownProps.params;
    if (useLighthouse) {
      trackedItems = attributes.trackedItems;
      [trackedItem] = trackedItems.filter(
        event => event.id === parseInt(trackedItemId, 10),
      );
    } else {
      trackedItems = attributes.eventsTimeline;
      [trackedItem] = trackedItems.filter(
        event => event.trackedItemId === parseInt(trackedItemId, 10),
      );
    }
  }

  return {
    loading: claimDetail.loading,
    claim: claimDetail.detail,
    trackedItem,
    files: uploads.files,
    uploading: uploads.uploading,
    progress: uploads.progress,
    uploadError: uploads.uploadError,
    uploadComplete: uploads.uploadComplete,
    uploadField: uploads.uploadField,
    lastPage: claimsState.routing.lastPage,
    message: claimsState.notifications.message,
    // START lighthouse_migration
    useLighthouse,
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
  // START lighthouse_migration
  getClaimEVSS: getClaimEVSSAction,
  getClaimLighthouse: getClaimAction,
  submitFilesLighthouse,
  // END lighthouse_migration
  setFieldsDirty,
  resetUploads,
  clearNotification,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(DocumentRequestPage),
);

DocumentRequestPage.propTypes = {
  addFile: PropTypes.func,
  cancelUpload: PropTypes.func,
  claim: PropTypes.object,
  clearNotification: PropTypes.func,
  // START lighthouse_migration
  documentsUseLighthouse: PropTypes.bool,
  // END lighthouse_migration
  files: PropTypes.array,
  // START lighthouse_migration
  getClaimEVSS: PropTypes.func,
  getClaimLighthouse: PropTypes.func,
  // END lighthouse_migration
  lastPage: PropTypes.string,
  loading: PropTypes.bool,
  message: PropTypes.object,
  params: PropTypes.object,
  removeFile: PropTypes.func,
  resetUploads: PropTypes.func,
  router: PropTypes.object,
  setFieldsDirty: PropTypes.func,
  submitFiles: PropTypes.func,
  // START lighthouse_migration
  submitFilesLighthouse: PropTypes.func,
  // END lighthouse_migration
  trackedItem: PropTypes.object,
  updateField: PropTypes.func,
  uploadComplete: PropTypes.bool,
  uploading: PropTypes.bool,
  // START lighthouse_migration
  useLighthouse: PropTypes.bool,
  // END lighthouse_migration
};

export { DocumentRequestPage };
