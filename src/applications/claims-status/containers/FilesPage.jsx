import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';

import AdditionalEvidenceItem from '../components/AdditionalEvidenceItem';
import AskVAToDecide from '../components/AskVAToDecide';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import RequestedFilesInfo from '../components/RequestedFilesInfo';
import SubmittedTrackedItem from '../components/SubmittedTrackedItem';
import AdditionalEvidencePage from '../components/claim-files-tab/AdditionalEvidencePage';
import ClaimFileHeader from '../components/claim-files-tab/ClaimFileHeader';
import DocumentsFiled from '../components/claim-files-tab/DocumentsFiled';

import { clearNotification } from '../actions';
import {
  buildDateFormatter,
  getClaimType,
  setDocumentTitle,
  getFilesNeeded,
  getFilesOptional,
  isClaimOpen,
  claimAvailable,
} from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';
import { Toggler } from '~/platform/utilities/feature-toggles';

// CONSTANTS
const NEED_ITEMS_STATUS = 'NEEDED_FROM_';
const FIRST_GATHERING_EVIDENCE_PHASE = 'GATHERING_OF_EVIDENCE';

class FilesPage extends React.Component {
  componentDidMount() {
    this.setTitle();
    if (!isTab(this.props.lastPage)) {
      if (!this.props.loading) {
        setUpPage();
      } else {
        scrollToTop();
      }
    } else {
      setFocus('#tabPanelFiles');
    }
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.loading &&
      prevProps.loading &&
      !isTab(this.props.lastPage)
    ) {
      setUpPage(false);
    }
    if (this.props.loading !== prevProps.loading) {
      this.setTitle();
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
      evidenceWaiverSubmitted5103,
      claimPhaseDates,
    } = claim.attributes;
    const isOpen = isClaimOpen(status, closeDate);
    const waiverSubmitted = evidenceWaiverSubmitted5103;
    const showDecision =
      claimPhaseDates.latestPhaseType === FIRST_GATHERING_EVIDENCE_PHASE &&
      !waiverSubmitted;

    const filesNeeded = getFilesNeeded(trackedItems, true);
    const optionalFiles = getFilesOptional(trackedItems, true);
    const documentsTurnedIn = trackedItems.filter(
      item => !item.status.startsWith(NEED_ITEMS_STATUS),
    );

    documentsTurnedIn.push(...supportingDocuments);
    documentsTurnedIn.sort((a, b) => {
      if (a.date === b.date) return -1;
      return a.date > b.date ? -1 : 1;
    });

    return (
      <div className="claim-files">
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstUseClaimDetailsV2}>
          <Toggler.Disabled>
            {isOpen && (
              <RequestedFilesInfo
                id={claim.id}
                filesNeeded={filesNeeded}
                optionalFiles={optionalFiles}
              />
            )}
            {showDecision && <AskVAToDecide />}
            <div className="submitted-files-list">
              <h2 className="claim-file-border">Documents filed</h2>
              {documentsTurnedIn.length === 0 ? (
                <div>
                  <p>You haven’t turned in any documents to VA.</p>
                </div>
              ) : null}

              {documentsTurnedIn.map(
                (item, itemIndex) =>
                  item.status && item.id ? (
                    <SubmittedTrackedItem item={item} key={itemIndex} />
                  ) : (
                    <AdditionalEvidenceItem item={item} key={itemIndex} />
                  ),
              )}
            </div>
          </Toggler.Disabled>
          <Toggler.Enabled>
            <ClaimFileHeader isOpen={isOpen} />
            <AdditionalEvidencePage />
            {showDecision && <AskVAToDecide />}
            <DocumentsFiled claim={claim} />
          </Toggler.Enabled>
        </Toggler>
      </div>
    );
  }

  setTitle() {
    const { claim } = this.props;

    if (claimAvailable(claim)) {
      const claimDate = buildDateFormatter()(claim.attributes.claimDate);
      const claimType = getClaimType(claim);
      const title = `Files For ${claimDate} ${claimType} Claim`;
      setDocumentTitle(title);
    } else {
      setDocumentTitle('Files For Your Claim');
    }
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
  message: PropTypes.shape({
    body: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    title: PropTypes.string,
    type: PropTypes.string,
  }),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilesPage);

export { FilesPage };
