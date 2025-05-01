import React, { useEffect, useCallback, useRef } from 'react';
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
import Default5103EvidenceNotice from '../components/claim-document-request-pages/Default5103EvidenceNotice';

import {
  addFile,
  cancelUpload,
  clearNotification,
  getClaim as getClaimAction, // lighthouse migration
  removeFile,
  resetUploads,
  setFieldsDirty,
  submitFiles,
  submitFilesLighthouse, // lighthouse migration
  updateField,
} from '../actions';
import { benefitsDocumentsUseLighthouse } from '../selectors'; // lighthouse migration

import {
  setDocumentRequestPageTitle,
  getClaimType,
  isAutomated5103Notice,
  setPageTitle,
} from '../utils/helpers';
import { setUpPage, setPageFocus } from '../utils/page';
import withRouter from '../utils/withRouter';

const scrollToError = () => {
  const options = merge({}, window.VetsGov.scroll, { offset: -25 });
  scrollTo('uploadError', options);
};

const filesPath = '../files';
const statusPath = '../status';

const DocumentRequestPage = (props) => {
  const {
    addFile,
    cancelUpload,
    claim,
    documentsUseLighthouse,
    files,
    getClaim,
    lastPage,
    loading,
    message,
    navigate,
    params,
    progress,
    removeFile,
    resetUploads,
    setFieldsDirty,
    submitFiles,
    submitFilesLighthouse,
    trackedItem,
    updateField,
    uploadComplete,
    uploadField,
    uploading,
  } = props;

  /* ------------------------------------------------------------------------
   *  componentDidMount ---------------------------------------------------- */
  useEffect(() => {
    resetUploads();
    setPageTitle(trackedItem);

    if (!loading) {
      setUpPage();
    } else {
      scrollToTop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  /* ------------------------------------------------------------------------
   *  UNSAFE_componentWillReceiveProps equiv -------------------------------- */
  useEffect(() => {
    if (!loading && !trackedItem) {
      navigate('../status', { replace: true });
    }
    if (uploadComplete) {
      getClaim(claim.id);
      navigate(filesPath);
    }
  }, [loading, trackedItem, uploadComplete, navigate, claim, getClaim]);

  /* ------------------------------------------------------------------------
   *  componentDidUpdate equiv --------------------------------------------- */
  const prevMessageRef = useRef(message);
  const prevLoadingRef = useRef(loading);

  useEffect(() => {
    // message just appeared
    if (message && !prevMessageRef.current) {
      const alert = document.querySelector('.claims-alert');
      if (alert) alert.focus();
      scrollToError();
    }
    prevMessageRef.current = message;
  }, [message]);

  useEffect(() => {
    const wasLoading = prevLoadingRef.current;

    if (!loading && wasLoading) {
      setPageFocus();
      setPageTitle(trackedItem);
    }

    prevLoadingRef.current = loading;
  }, [loading, trackedItem]);

  /* ------------------------------------------------------------------------
   *  helpers -------------------------------------------------------------- */
  const handleSubmit = useCallback(() => {
    if (documentsUseLighthouse) {
      submitFilesLighthouse(claim.id, trackedItem, files);
    } else {
      submitFiles(claim.id, trackedItem, files);
    }
  }, [documentsUseLighthouse, submitFilesLighthouse, submitFiles, claim, trackedItem, files]);

  const getDefaultPage = useCallback(
    () => (
      <DefaultPage
        backUrl={lastPage ? `/${lastPage}` : filesPath}
        field={uploadField}
        files={files}
        item={trackedItem}
        onAddFile={addFile}
        onCancel={cancelUpload}
        onDirtyFields={setFieldsDirty}
        onFieldChange={updateField}
        onSubmit={handleSubmit}
        onRemoveFile={removeFile}
        progress={progress}
        uploading={uploading}
      />
    ),
    [
      lastPage,
      uploadField,
      files,
      trackedItem,
      addFile,
      cancelUpload,
      setFieldsDirty,
      updateField,
      handleSubmit,
      removeFile,
      progress,
      uploading,
    ],
  );

  /* ------------------------------------------------------------------------
   *  render content ------------------------------------------------------- */
  let mainContent;

  if (loading) {
    mainContent = (
      <div>
        <va-loading-indicator set-focus message="Loading your claim information..." />
      </div>
    );
  } else {
    mainContent = (
      <>
        {message && (
          <div>
            <Element name="uploadError" />
            <Notification title={message.title} body={message.body} type={message.type} />
          </div>
        )}

        <Toggler toggleName={Toggler.TOGGLE_NAMES.cst5103UpdateEnabled}>
          <Toggler.Enabled>
            {isAutomated5103Notice(trackedItem?.displayName) ? (
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

  /* ------------------------------------------------------------------------
   *  breadcrumbs ---------------------------------------------------------- */
  const claimType = getClaimType(claim).toLowerCase();

  const previousPageIsFilesTab = () =>
    sessionStorage.getItem('previousPage') === 'files';

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

  const crumbs = [
    previousPageIsFilesTab() ? filesBreadcrumb : statusBreadcrumb,
    {
      href: `../document-request/${params.trackedItemId}`,
      label: setDocumentRequestPageTitle(
        trackedItem?.friendlyName || trackedItem?.displayName,
      ),
      isRouterLink: true,
    },
  ];

  /* --------------------------------------------------------------------- */
  return (
    <div>
      <div name="topScrollElement" />
      <div className="row">
        <div className="usa-width-two-thirds medium-8 columns">
          <ClaimsBreadcrumbs crumbs={crumbs} />
          {mainContent}
          <NeedHelp item={trackedItem} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------- Redux ---------------------------------- */
function mapStateToProps(state, ownProps) {
  const claimsState = state.disability.status;
  const { claimDetail, uploads } = claimsState;

  let trackedItem = null;
  if (claimDetail.detail) {
    const { trackedItems } = claimDetail.detail.attributes;
    const { trackedItemId } = ownProps.params;
    [trackedItem] = trackedItems.filter(
      (item) => item.id === parseInt(trackedItemId, 10),
    );
  }

  return {
    claim: claimDetail.detail,
    documentsUseLighthouse: benefitsDocumentsUseLighthouse(state), // lighthouse
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
  submitFilesLighthouse, // lighthouse
  updateField,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentRequestPage),
);

/* ------------------------------- types ---------------------------------- */
DocumentRequestPage.propTypes = {
  addFile: PropTypes.func,
  cancelUpload: PropTypes.func,
  claim: PropTypes.object,
  clearNotification: PropTypes.func,
  documentsUseLighthouse: PropTypes.bool,
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
  submitFilesLighthouse: PropTypes.func,
  trackedItem: PropTypes.object,
  updateField: PropTypes.func,
  uploadComplete: PropTypes.bool,
  uploadField: PropTypes.object,
  uploading: PropTypes.bool,
};

export { DocumentRequestPage };
