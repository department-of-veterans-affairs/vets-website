import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Toggler } from 'platform/utilities/feature-toggles';

import { clearNotification } from '../actions';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import AdditionalEvidencePage from '../components/claim-files-tab/AdditionalEvidencePage';
import ClaimFileHeader from '../components/claim-files-tab/ClaimFileHeader';
import DocumentsFiled from '../components/claim-files-tab/DocumentsFiled';
import OtherWaysToSendYourDocuments from '../components/claim-files-tab-v2/OtherWaysToSendYourDocuments';
import FileSubmissionsInProgress from '../components/claim-files-tab-v2/FileSubmissionsInProgress';
import FilesReceived from '../components/claim-files-tab-v2/FilesReceived';
import FilesWeCouldntReceiveEntryPoint from '../components/claim-files-tab-v2/FilesWeCouldntReceiveEntryPoint';
import UploadType2ErrorAlert from '../components/UploadType2ErrorAlert';
import withRouter from '../utils/withRouter';

import {
  claimAvailable,
  getFailedSubmissionsWithinLast30Days,
  isClaimOpen,
  setPageFocus,
  setTabDocumentTitle,
} from '../utils/helpers';
import { setUpPage, isTab } from '../utils/page';

// CONSTANTS
const NEED_ITEMS_STATUS = 'NEEDED_FROM_';

class FilesPage extends React.Component {
  componentDidMount() {
    const { claim, location } = this.props;
    // Only set the document title at mount-time if the claim is already available.
    if (claimAvailable(claim)) setTabDocumentTitle(claim, 'Files');

    if (location?.hash === '') {
      setTimeout(() => {
        const { lastPage, loading } = this.props;
        setPageFocus(lastPage, loading);
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { claim, lastPage, loading } = this.props;

    if (!loading && prevProps.loading && !isTab(lastPage)) {
      setUpPage(false);
    }
    // Set the document title when loading completes.
    //   If loading was successful it will display a title specific to the claim.
    //   Otherwise it will display a default title of "Files for Your Claim".
    if (loading !== prevProps.loading) {
      setTabDocumentTitle(claim, 'Files');
    }
  }

  componentWillUnmount() {
    this.props.clearNotification();
  }

  getPageContent() {
    const { claim } = this.props;

    // Return null if the claim/ claim.attributes dont exist
    if (!claimAvailable(claim)) {
      return null;
    }

    const {
      closeDate,
      status,
      supportingDocuments,
      trackedItems,
      evidenceSubmissions,
    } = claim.attributes;
    const isOpen = isClaimOpen(status, closeDate);

    const documentsTurnedIn = trackedItems.filter(
      item => !item.status.startsWith(NEED_ITEMS_STATUS),
    );
    const failedSubmissionsWithinLast30Days = getFailedSubmissionsWithinLast30Days(
      evidenceSubmissions,
    );

    documentsTurnedIn.push(...supportingDocuments);
    documentsTurnedIn.sort((a, b) => {
      if (a.date === b.date) return -1;
      return a.date > b.date ? -1 : 1;
    });

    return (
      <div className="claim-files">
        <ClaimFileHeader isOpen={isOpen} />
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstShowDocumentUploadStatus}>
          <Toggler.Enabled>
            <UploadType2ErrorAlert
              failedSubmissions={failedSubmissionsWithinLast30Days}
            />
            <AdditionalEvidencePage additionalEvidenceTitle="Upload additional evidence" />
            <div className="vads-u-margin-y--6 vads-u-border--1px vads-u-border-color--gray-light" />
            <FileSubmissionsInProgress claim={claim} />
            <div className="vads-u-margin-y--6 vads-u-border--1px vads-u-border-color--gray-light" />
            <FilesReceived claim={claim} />
            <div className="vads-u-margin-y--6 vads-u-border--1px vads-u-border-color--gray-light" />
            <FilesWeCouldntReceiveEntryPoint
              evidenceSubmissions={evidenceSubmissions}
            />
            <OtherWaysToSendYourDocuments />
          </Toggler.Enabled>
          <Toggler.Disabled>
            <AdditionalEvidencePage />
            <DocumentsFiled claim={claim} />
          </Toggler.Disabled>
        </Toggler>
      </div>
    );
  }

  render() {
    const { claim, loading, message } = this.props;

    let content = null;
    if (!loading && claim) {
      content = this.getPageContent();
    }

    return (
      <ClaimDetailLayout
        claim={claim}
        loading={loading}
        clearNotification={this.props.clearNotification}
        currentTab="Files"
        message={message}
      >
        {content}
      </ClaimDetailLayout>
    );
  }
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;

  return {
    loading: claimsState.claimDetail.loading,
    claim: claimsState.claimDetail.detail,
    message: claimsState.notifications.message,
    lastPage: claimsState.routing.lastPage,
  };
}

const mapDispatchToProps = {
  clearNotification,
};

FilesPage.propTypes = {
  claim: PropTypes.object,
  clearNotification: PropTypes.func,
  lastPage: PropTypes.string,
  loading: PropTypes.bool,
  location: PropTypes.object,
  message: PropTypes.shape({
    body: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    title: PropTypes.string,
    type: PropTypes.string,
  }),
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(FilesPage),
);

export { FilesPage };
