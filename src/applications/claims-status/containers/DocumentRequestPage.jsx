import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { scrollToTop } from 'platform/utilities/scroll';

import NeedHelp from '../components/NeedHelp';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import Notification from '../components/Notification';
import FirstPartyRequestPage from '../components/claim-document-request-pages/FirstPartyRequestPage';
import ThirdPartyRequestPage from '../components/claim-document-request-pages/ThirdPartyRequestPage';
import {
  cancelUpload,
  clearNotification,
  getClaim as getClaimAction,
  resetUploads,
  submitFiles,
} from '../actions';
import { getClaimType } from '../utils/helpers';
import * as TrackedItem from '../utils/trackedItemContent';
import { setUpPage, setPageFocus, focusNotificationAlert } from '../utils/page';
import withRouter from '../utils/withRouter';
import Default5103EvidenceNotice from '../components/claim-document-request-pages/Default5103EvidenceNotice';

const filesPath = '../files';
const statusPath = '../status';

class DocumentRequestPage extends React.Component {
  componentDidMount() {
    this.props.resetUploads();
    TrackedItem.setPageTitle(this.props.trackedItem);
    if (!this.props.loading) {
      setUpPage(true, 'h1');
    } else {
      scrollToTop({ behavior: 'instant' });
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(props) {
    if (!props.loading && !props.trackedItem) {
      this.props.navigate(`../status`, {
        replace: true,
      });
    }
    if (props.uploadComplete) {
      this.handleUploadComplete();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading && prevProps.loading) {
      setPageFocus('h1');
      TrackedItem.setPageTitle(this.props.trackedItem);
    }
  }

  handleUploadComplete() {
    this.props.getClaim(this.props.claim.id);
    const redirectPath = this.props.showDocumentUploadStatus
      ? statusPath
      : filesPath;
    this.props.navigate(redirectPath);
  }

  getRequestPage() {
    const {
      message,
      type1UnknownErrors,
      timezoneMitigationEnabled,
      showDocumentUploadStatus,
    } = this.props;

    const pageProps = {
      item: this.props.trackedItem,
      message: showDocumentUploadStatus ? message : null,
      onCancel: this.props.cancelUpload,
      onSubmit: files =>
        this.props.submitFiles(
          this.props.claim.id,
          this.props.trackedItem,
          files,
          showDocumentUploadStatus,
          timezoneMitigationEnabled,
        ),
      progress: this.props.progress,
      type1UnknownErrors: showDocumentUploadStatus ? type1UnknownErrors : null,
      uploading: this.props.uploading,
    };

    if (this.props.trackedItem?.status === 'NEEDED_FROM_YOU') {
      return <FirstPartyRequestPage {...pageProps} />;
    }

    return <ThirdPartyRequestPage {...pageProps} />;
  }

  render() {
    const { claim, params, trackedItem } = this.props;
    const claimType = getClaimType(claim).toLowerCase();

    const previousPageIsFilesTab = () => {
      const previousPage = sessionStorage.getItem('previousPage');
      return previousPage === 'files';
    };

    const filesBreadcrumb = {
      href: filesPath,
      label: `Files for your ${claimType} claim`,
      isRouterLink: true,
    };
    const statusBreadcrumb = {
      href: statusPath,
      label: `Status of your ${claimType} claim`,
      isRouterLink: true,
    };

    const previousPageBreadcrumb = previousPageIsFilesTab()
      ? filesBreadcrumb
      : statusBreadcrumb;

    const crumbs = [
      previousPageBreadcrumb,
      {
        href: `../${
          trackedItem?.status === 'NEEDED_FROM_YOU'
            ? 'needed-from-you'
            : 'needed-from-others'
        }/${params.trackedItemId}`,
        label: TrackedItem.setDocumentRequestPageTitle(
          TrackedItem.getLabel(trackedItem),
        ),
        isRouterLink: true,
      },
    ];

    let content;
    if (this.props.loading) {
      content = (
        <div>
          <va-loading-indicator
            set-focus
            message="Loading your claim information..."
          />
        </div>
      );
    } else {
      const { message, showDocumentUploadStatus } = this.props;
      content = (
        <>
          {/* Show errors here when the feature flag is OFF. When the feature flag is ON, errors are shown in DefaultPage. */}
          {!showDocumentUploadStatus &&
            message && (
              <div>
                <Notification
                  title={message.title}
                  body={message.body}
                  type={message.type}
                  maskTitle={message.type === 'error'}
                  onSetFocus={focusNotificationAlert}
                />
              </div>
            )}
          {TrackedItem.isAutomated5103Notice(trackedItem.displayName) ? (
            <Default5103EvidenceNotice item={trackedItem} />
          ) : (
            <>{this.getRequestPage()}</>
          )}
        </>
      );
    }
    return (
      <div>
        <div name="topScrollElement" />
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            <ClaimsBreadcrumbs crumbs={crumbs} />
            <div>{content}</div>
            <NeedHelp item={trackedItem} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const claimsState = state.disability.status;
  const { claimDetail, uploads } = claimsState;

  let trackedItem = null;
  if (claimDetail.detail) {
    const { trackedItems } = claimDetail.detail.attributes;
    const { trackedItemId } = ownProps.params;
    [trackedItem] = trackedItems.filter(
      item => item.id === parseInt(trackedItemId, 10),
    );
  }

  return {
    claim: claimDetail.detail,
    loading: claimDetail.loading,
    message: claimsState.notifications.additionalEvidenceMessage,
    progress: uploads.progress,
    showDocumentUploadStatus:
      state.featureToggles?.cst_show_document_upload_status || false,
    trackedItem,
    type1UnknownErrors: claimsState.notifications.type1UnknownErrors,
    uploadComplete: uploads.uploadComplete,
    uploadError: uploads.uploadError,
    uploading: uploads.uploading,
    timezoneMitigationEnabled:
      state.featureToggles?.cst_timezone_discrepancy_mitigation || false,
  };
}

const mapDispatchToProps = {
  cancelUpload,
  clearNotification,
  getClaim: getClaimAction,
  resetUploads,
  submitFiles,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(DocumentRequestPage),
);

DocumentRequestPage.propTypes = {
  cancelUpload: PropTypes.func,
  claim: PropTypes.object,
  clearNotification: PropTypes.func,
  getClaim: PropTypes.func,
  loading: PropTypes.bool,
  message: PropTypes.object,
  navigate: PropTypes.func,
  params: PropTypes.object,
  progress: PropTypes.number,
  resetUploads: PropTypes.func,
  showDocumentUploadStatus: PropTypes.bool,
  submitFiles: PropTypes.func,
  timezoneMitigationEnabled: PropTypes.bool,
  trackedItem: PropTypes.object,
  type1UnknownErrors: PropTypes.array,
  uploadComplete: PropTypes.bool,
  uploading: PropTypes.bool,
};

export { DocumentRequestPage };
