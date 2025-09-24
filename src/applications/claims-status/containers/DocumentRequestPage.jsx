import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { scrollToTop } from 'platform/utilities/scroll';

import NeedHelp from '../components/NeedHelp';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import Notification from '../components/Notification';
import DefaultPage from '../components/claim-document-request-pages/DefaultPage';
import {
  cancelUpload,
  clearNotification,
  getClaim as getClaimAction,
  resetUploads,
  submitFiles,
} from '../actions';
import {
  setDocumentRequestPageTitle,
  getClaimType,
  isAutomated5103Notice,
  setPageTitle,
  getLabel,
} from '../utils/helpers';
import { setUpPage, setPageFocus, focusNotificationAlert } from '../utils/page';
import withRouter from '../utils/withRouter';
import Default5103EvidenceNotice from '../components/claim-document-request-pages/Default5103EvidenceNotice';

const filesPath = '../files';
const statusPath = '../status';

class DocumentRequestPage extends React.Component {
  componentDidMount() {
    this.props.resetUploads();
    setPageTitle(this.props.trackedItem);
    if (!this.props.loading) {
      setUpPage(true, 'h1');
    } else {
      scrollToTop();
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
      this.goToFilesPage();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading && prevProps.loading) {
      setPageFocus('h1');
      setPageTitle(this.props.trackedItem);
    }
  }

  getDefaultPage() {
    return (
      <>
        <DefaultPage
          item={this.props.trackedItem}
          onCancel={this.props.cancelUpload}
          onSubmit={files =>
            this.props.submitFiles(
              this.props.claim.id,
              this.props.trackedItem,
              files,
            )
          }
          progress={this.props.progress}
          uploading={this.props.uploading}
        />
      </>
    );
  }

  goToFilesPage() {
    this.props.getClaim(this.props.claim.id);
    this.props.navigate(filesPath);
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
        label: setDocumentRequestPageTitle(getLabel(trackedItem)),
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
      const { message } = this.props;

      content = (
        <>
          {message && (
            <div>
              <Notification
                title={message.title}
                body={message.body}
                type={message.type}
                onSetFocus={focusNotificationAlert}
              />
            </div>
          )}
          {/* Demo notification for documentation */}
          <div className="alert-demo-text">
            <span>
              Document Request Page Notification
              <br />
              Triggered by: Evidence waiver submission or claim decision request
            </span>
          </div>
          <div>
            <Notification
              title="We received your evidence waiver"
              body="Thank you. We'll move your claim to the next step as soon as possible."
              type="success"
              onSetFocus={focusNotificationAlert}
            />
          </div>

          {isAutomated5103Notice(trackedItem.displayName) ? (
            <Default5103EvidenceNotice item={trackedItem} />
          ) : (
            <>{this.getDefaultPage()}</>
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
    trackedItem,
    uploadComplete: uploads.uploadComplete,
    uploadError: uploads.uploadError,
    uploading: uploads.uploading,
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
  submitFiles: PropTypes.func,
  trackedItem: PropTypes.object,
  uploadComplete: PropTypes.bool,
  uploading: PropTypes.bool,
};

export { DocumentRequestPage };
