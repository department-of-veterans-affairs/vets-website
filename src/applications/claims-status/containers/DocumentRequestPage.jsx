import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Toggler } from '~/platform/utilities/feature-toggles';

import { scrollToTop } from 'platform/utilities/scroll';

import NeedHelp from '../components/NeedHelp';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import Notification from '../components/Notification';
import DefaultPage from '../components/claim-document-request-pages/DefaultPage';
import {
  addFile,
  cancelUpload,
  clearNotification,
  getClaim as getClaimAction,
  removeFile,
  resetUploads,
  setFieldsDirty,
  submitFiles,
  updateField,
} from '../actions';
import { cstFriendlyEvidenceRequests } from '../selectors';
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
    setPageTitle(this.props.trackedItem, this.props.friendlyEvidenceRequests);
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
      setPageTitle(this.props.trackedItem, this.props.friendlyEvidenceRequests);
    }
  }

  getDefaultPage() {
    return (
      <>
        <DefaultPage
          backUrl={this.props.lastPage ? `/${this.props.lastPage}` : filesPath}
          field={this.props.uploadField}
          files={this.props.files}
          item={this.props.trackedItem}
          onAddFile={this.props.addFile}
          onCancel={this.props.cancelUpload}
          onDirtyFields={this.props.setFieldsDirty}
          onFieldChange={this.props.updateField}
          onSubmit={() => {
            // Always use Lighthouse endpoint (no more feature flag checks)
            this.props.submitFiles(
              this.props.claim.id,
              this.props.trackedItem,
              this.props.files,
            );
          }}
          onRemoveFile={this.props.removeFile}
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

    return (
      <Toggler.Hoc
        toggleName={Toggler.TOGGLE_NAMES.cstFriendlyEvidenceRequests}
      >
        {toggleValue => {
          const crumbs = [
            previousPageBreadcrumb,
            {
              href: toggleValue
                ? `../${
                    trackedItem?.status === 'NEEDED_FROM_YOU'
                      ? 'needed-from-you'
                      : 'needed-from-others'
                  }/${params.trackedItemId}`
                : `../document-request/${params.trackedItemId}`,
              label: setDocumentRequestPageTitle(
                getLabel(toggleValue, trackedItem),
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
                <Toggler toggleName={Toggler.TOGGLE_NAMES.cst5103UpdateEnabled}>
                  <Toggler.Enabled>
                    {isAutomated5103Notice(trackedItem.displayName) ? (
                      <Default5103EvidenceNotice item={trackedItem} />
                    ) : (
                      <>{this.getDefaultPage()}</>
                    )}
                  </Toggler.Enabled>
                  <Toggler.Disabled>
                    <>{this.getDefaultPage()}</>
                  </Toggler.Disabled>
                </Toggler>
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
        }}
      </Toggler.Hoc>
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
    files: uploads.files,
    lastPage: claimsState.routing.lastPage,
    loading: claimDetail.loading,
    message: claimsState.notifications.additionalEvidenceMessage,
    progress: uploads.progress,
    trackedItem,
    uploadComplete: uploads.uploadComplete,
    uploadError: uploads.uploadError,
    uploadField: uploads.uploadField,
    uploading: uploads.uploading,
    friendlyEvidenceRequests: cstFriendlyEvidenceRequests(state),
  };
}

const mapDispatchToProps = {
  addFile,
  cancelUpload,
  clearNotification,
  getClaim: getClaimAction,
  removeFile,
  resetUploads,
  setFieldsDirty,
  submitFiles,
  updateField,
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
  files: PropTypes.array,
  friendlyEvidenceRequests: PropTypes.bool,
  getClaim: PropTypes.func,
  lastPage: PropTypes.string,
  loading: PropTypes.bool,
  message: PropTypes.object,
  navigate: PropTypes.func,
  params: PropTypes.object,
  progress: PropTypes.number,
  removeFile: PropTypes.func,
  resetUploads: PropTypes.func,
  setFieldsDirty: PropTypes.func,
  submitFiles: PropTypes.func,
  trackedItem: PropTypes.object,
  updateField: PropTypes.func,
  uploadComplete: PropTypes.bool,
  uploadField: PropTypes.object,
  uploading: PropTypes.bool,
};

export { DocumentRequestPage };
