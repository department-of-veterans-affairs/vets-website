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
} from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';
import { DATE_FORMATS } from '../constants';
import { Toggler } from '~/platform/utilities/feature-toggles';

// CONSTANTS
const NEED_ITEMS_STATUS = 'NEEDED_FROM_';
const FIRST_GATHERING_EVIDENCE_PHASE = 'GATHERING_OF_EVIDENCE';

const formatDate = buildDateFormatter(DATE_FORMATS.LONG_DATE);

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
    const { claim, params } = this.props;

    const {
      closeDate,
      status,
      supportingDocuments,
      trackedItems,
    } = claim.attributes;
    const isOpen = isClaimOpen(status, closeDate);
    const waiverSubmitted = claim.attributes.evidenceWaiverSubmitted5103;
    const showDecision =
      claim.attributes.claimPhaseDates.latestPhaseType ===
        FIRST_GATHERING_EVIDENCE_PHASE && !waiverSubmitted;

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
      <div>
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstUseClaimDetailsV2}>
          <Toggler.Disabled>
            {isOpen && (
              <RequestedFilesInfo
                id={claim.id}
                filesNeeded={filesNeeded}
                optionalFiles={optionalFiles}
              />
            )}
            {showDecision && <AskVAToDecide id={params.id} />}
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
            {showDecision && <AskVAToDecide id={params.id} />}
            <DocumentsFiled claim={claim} />
          </Toggler.Enabled>
        </Toggler>
      </div>
    );
  }

  setTitle() {
    const { claim } = this.props;

    if (claim) {
      const claimDate = formatDate(claim.attributes.claimDate);
      const claimType = getClaimType(claim);
      const title = `Files For ${claimDate} ${claimType} Claim`;
      setDocumentTitle(title);
    } else {
      setDocumentTitle('Files For Your Claim');
    }
  }

  render() {
    const { claim, loading, message, synced } = this.props;

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
        synced={synced}
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
    synced: claimsState.claimSync.synced,
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
    body: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
  }),
  params: PropTypes.object,
  synced: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilesPage);

export { FilesPage };
