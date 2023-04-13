import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';

import FilesPageContent from '../components/evss/FilesPageContent';
import AdditionalEvidenceItem from '../components/AdditionalEvidenceItem';
import AskVAToDecide from '../components/AskVAToDecide';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import RequestedFilesInfo from '../components/RequestedFilesInfo';
import SubmittedTrackedItem from '../components/SubmittedTrackedItem';

import { clearNotification } from '../actions';
import { cstUseLighthouse } from '../selectors';
import { getClaimType } from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';

const NEED_ITEMS_STATUS = 'NEEDED_FROM_';
const FIRST_GATHERING_EVIDENCE_PHASE = 'EVIDENCE_GATHERING';

// Using a Map instead of the typical Object because
// we want to guarantee that the key insertion order
// is maintained when converting to an array of keys
const getStatusMap = () => {
  const map = new Map();
  map.set('CLAIM RECEIVED', 'CLAIM_RECEIVED');
  map.set('INITIAL REVIEW', 'INITIAL REVIEW');
  map.set(
    'EVIDENCE_GATHERING_REVIEW_DECISION',
    'EVIDENCE_GATHERING_REVIEW_DECISION',
  );
  map.set('PREPARATION_FOR_NOTIFICATION');
  map.set('COMPLETE');
  return map;
};

const STATUSES = getStatusMap();

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
      setFocus('.va-tab-trigger--current');
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
    const { claim, params, useLighthouse } = this.props;
    if (!useLighthouse) {
      return <FilesPageContent claim={claim} params={params} />;
    }

    const { status, supportingDocuments, trackedItems } = claim.attributes;
    const isOpen = status !== STATUSES.COMPLETE;
    const waiverSubmitted = claim.attributes.evidenceWaiverSubmitted5103;
    const showDecision =
      claim.attributes.claimPhaseDates.latestPhaseType ===
        FIRST_GATHERING_EVIDENCE_PHASE && !waiverSubmitted;
    const filesNeeded = trackedItems.filter(
      item => item.status === 'NEEDED_FROM_YOU',
    );
    const optionalFiles = trackedItems.filter(
      item => item.status === 'NEEDED_FROM_OTHERS',
    );
    const documentsTurnedIn = trackedItems.filter(
      item => !item.status.startsWith(NEED_ITEMS_STATUS),
    );

    documentsTurnedIn.push(...supportingDocuments);

    return (
      <div>
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
              item.status && item.trackedItemId ? (
                <SubmittedTrackedItem item={item} key={itemIndex} />
              ) : (
                <AdditionalEvidenceItem item={item} key={itemIndex} />
              ),
          )}
        </div>
      </div>
    );
  }

  setTitle() {
    document.title = this.props.loading
      ? 'Files - Your claim'
      : `Files - Your ${getClaimType(this.props.claim)} claim`;
  }

  render() {
    const { claim, loading, message, synced, useLighthouse } = this.props;

    let content = null;
    if (!loading && claim) {
      content = this.getPageContent();
    }

    const ClaimDetailLayout = useLighthouse ? ClaimDetailLayoutLighthouse : ClaimDetailLayoutEVSS;

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
    useLighthouse: cstUseLighthouse(state),
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
  useLighthouse: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilesPage);

export { FilesPage };
