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
  // END lighthouse_migration
  setFieldsDirty,
  clearNotification,
} from '../actions';
// START lighthouse_migration
import { benefitsDocumentsUseLighthouse } from '../selectors';
// END lighthouse_migration
import { setDocumentTitle, getClaimType } from '../utils/helpers';
import { setPageFocus, setUpPage } from '../utils/page';
import withRouter from '../utils/withRouter';
import Automated5103Notice from '../components/claim-document-request-pages/Automated5103Notice';

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
      setDocumentTitle(`Request for ${this.props.trackedItem.displayName}`);
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

  componentWillUnmount() {
    if (!this.props.uploadComplete) {
      this.props.clearNotification();
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
      const is5103Notice =
        trackedItem.displayName === 'Automated 5103 Notice Response';

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
              {is5103Notice ? (
                <Automated5103Notice item={trackedItem} />
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

    const { claim } = this.props;
    const claimType = getClaimType(claim).toLowerCase();

    const previousPageIsFilesTab = () => {
      const previousPage = sessionStorage.getItem('previousPage');
      if (previousPage === 'files') {
        return true;
      }
      return false;
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
        href: `../document-request/${this.props.params.trackedItemId}`,
        label: 'Document request',
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
