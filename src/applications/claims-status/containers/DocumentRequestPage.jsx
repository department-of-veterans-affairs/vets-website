/* eslint-disable no-shadow */
import React, { useEffect, useRef, useCallback } from 'react';
import { merge } from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Toggler } from '~/platform/utilities/feature-toggles';

import scrollTo from '@department-of-veterans-affairs/platform-utilities/scrollTo';
import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';
import { Element } from 'platform/utilities/scroll';

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
  getClaimType,
  isAutomated5103Notice,
  setPageTitle,
} from '../utils/helpers';
import { setUpPage, setPageFocus } from '../utils/page';
import withRouter from '../utils/withRouter';
import Default5103EvidenceNotice from '../components/claim-document-request-pages/Default5103EvidenceNotice';

const scrollToError = () => {
  const options = merge({}, window.VetsGov.scroll, { offset: -25 });
  scrollTo('uploadError', options);
};

const filesPath = '../files';
const statusPath = '../status';

const DocumentRequestPage = props => {
  const {
    resetUploads,
    trackedItem,
    loading,
    navigate,
    uploadComplete,
    getClaim,
    claim,
    message,
  } = props;

  useEffect(() => {
    resetUploads();
    setPageTitle(trackedItem);
    if (!loading) {
      setUpPage();
    } else {
      scrollToTop();
    }
    // intentionally empty dependency array to mimic componentDidMount
  }, []);

  useEffect(
    () => {
      if (!loading && !trackedItem) {
        navigate('../status', { replace: true });
      }
    },
    [loading, trackedItem, navigate],
  );

  useEffect(
    () => {
      if (uploadComplete) {
        getClaim(claim.id);
        navigate(filesPath);
      }
    },
    [uploadComplete, getClaim, claim?.id, navigate],
  );

  const prevMessage = useRef();
  useEffect(
    () => {
      if (message && !prevMessage.current) {
        document.querySelector('.claims-alert')?.focus();
        scrollToError();
      }
      prevMessage.current = message;
    },
    [message],
  );

  const prevLoading = useRef(loading);
  useEffect(
    () => {
      if (!loading && prevLoading.current) {
        setPageFocus();
        setPageTitle(trackedItem);
      }
      prevLoading.current = loading;
    },
    [loading, trackedItem],
  );

  const submit = useCallback(
    () => {
      const {
        submitFilesLighthouse: submitLighthouse,
        submitFiles: submitRegular,
        documentsUseLighthouse,
        files,
      } = props;
      const { id } = claim;
      const item = trackedItem;
      if (documentsUseLighthouse) {
        submitLighthouse(id, item, files);
      } else {
        submitRegular(id, item, files);
      }
    },
    [props, claim, trackedItem],
  );

  const getDefaultPage = () => (
    <DefaultPage
      backUrl={props.lastPage ? `/${props.lastPage}` : filesPath}
      field={props.uploadField}
      files={props.files}
      item={trackedItem}
      onAddFile={props.addFile}
      onCancel={props.cancelUpload}
      onDirtyFields={props.setFieldsDirty}
      onFieldChange={props.updateField}
      onSubmit={submit}
      onRemoveFile={props.removeFile}
      progress={props.progress}
      uploading={props.uploading}
    />
  );

  let content;
  if (loading) {
    content = (
      <div>
        <va-loading-indicator
          set-focus
          message="Loading your claim information..."
        />
      </div>
    );
  } else {
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
              getDefaultPage()
            )}
          </Toggler.Enabled>
          <Toggler.Disabled>{getDefaultPage()}</Toggler.Disabled>
        </Toggler>
      </>
    );
  }

  const claimType = getClaimType(claim).toLowerCase();
  const previousPageIsFilesTab = () =>
    sessionStorage.getItem('previousPage') === 'files';

  const crumbs = [
    previousPageIsFilesTab()
      ? {
          href: filesPath,
          label: `Files for your ${claimType} claim`,
          isRouterLink: true,
        }
      : {
          href: statusPath,
          label: `Status of your ${claimType} claim`,
          isRouterLink: true,
        },
    {
      href: `../document-request/${props.params.trackedItemId}`,
      label: setDocumentRequestPageTitle(
        trackedItem?.friendlyName || trackedItem?.displayName,
      ),
      isRouterLink: true,
    },
  ];

  return (
    <div>
      <div name="topScrollElement" />
      <div className="row">
        <div className="usa-width-two-thirds medium-8 columns">
          <ClaimsBreadcrumbs crumbs={crumbs} />
          {content}
          <NeedHelp item={trackedItem} />
        </div>
      </div>
    </div>
  );
};
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
export { DocumentRequestPage };

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
