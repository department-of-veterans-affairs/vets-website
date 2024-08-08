import React from 'react';
import Scroll from 'react-scroll';
import { merge } from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Toggler } from '~/platform/utilities/feature-toggles';

import scrollTo from '@department-of-veterans-affairs/platform-utilities/scrollTo';
import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';

import NeedHelp from '../components/NeedHelp';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import Notification from '../components/Notification';
import DefaultPage from '../components/claim-document-request-pages/DefaultPage';
import {
  addFile,
  cancelUpload,
  clearNotification,
  // START lighthouse_migration
  getClaim as getClaimAction,
  // END lighthouse_migration
  removeFile,
  resetUploads,
  setFieldsDirty,
  submitFiles,
  // START lighthouse_migration
  submitFilesLighthouse,
  // END lighthouse_migration
  updateField,
} from '../actions';
// START lighthouse_migration
import { benefitsDocumentsUseLighthouse } from '../selectors';
// END lighthouse_migration
import {
  setDocumentRequestPageTitle,
  setDocumentTitle,
  getClaimType,
  isAutomated5103Notice,
} from '../utils/helpers';
import { setPageFocus, setUpPage } from '../utils/page';
import withRouter from '../utils/withRouter';
import Default5103EvidenceNotice from '../components/claim-document-request-pages/Default5103EvidenceNotice';

const scrollToError = () => {
  const options = merge({}, window.VetsGov.scroll, { offset: -25 });
  scrollTo('uploadError', options);
};
const { Element } = Scroll;

const filesPath = '../files';
const statusPath = '../status';

class DocumentRequestPage extends React.Component {
  componentDidMount() {
    this.props.resetUploads();
    if (this.props.trackedItem) {
      const pageTitle = setDocumentRequestPageTitle(
        this.props.trackedItem.displayName,
      );
      setDocumentTitle(pageTitle);
    } else {
      setDocumentTitle('Document Request');
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
      this.props.navigate(`../status`, {
        replace: true,
      });
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
            // START lighthouse_migration
            if (this.props.documentsUseLighthouse) {
              this.props.submitFilesLighthouse(
                this.props.claim.id,
                this.props.trackedItem,
                this.props.files,
              );
            } else {
              this.props.submitFiles(
                this.props.claim.id,
                this.props.trackedItem,
                this.props.files,
              );
            }
            // END lighthouse_migration
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
    let content;

    if (this.props.loading) {
      content = (
        <va-loading-indicator
          set-focus
          message="Loading your claim information..."
        />
      );
    } else {
      const { message, trackedItem } = this.props;

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
        href: `../document-request/${params.trackedItemId}`,
        label: setDocumentRequestPageTitle(trackedItem?.displayName),
        isRouterLink: true,
      },
    ];

    return (
      <div>
        <div name="topScrollElement" />
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            <ClaimsBreadcrumbs crumbs={crumbs} />
            <div>{content}</div>
            <NeedHelp />
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
    // START lighthouse_migration
    documentsUseLighthouse: benefitsDocumentsUseLighthouse(state),
    // END lighthouse_migration
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
  // START lighthouse_migration
  submitFilesLighthouse,
  // END lighthouse_migration
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
  // START lighthouse_migration
  documentsUseLighthouse: PropTypes.bool,
  // END lighthouse_migration
  files: PropTypes.array,
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
  // START lighthouse_migration
  submitFilesLighthouse: PropTypes.func,
  // END lighthouse_migration
  trackedItem: PropTypes.object,
  updateField: PropTypes.func,
  uploadComplete: PropTypes.bool,
  uploadField: PropTypes.object,
  uploading: PropTypes.bool,
};

export { DocumentRequestPage };
