import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';

import { clearNotification } from '../actions';
import FilesPageContent from '../components/evss/FilesPageContent';
import AdditionalEvidenceItem from '../components/AdditionalEvidenceItem';
import AskVAToDecide from '../components/AskVAToDecide';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import SubmittedTrackedItem from '../components/SubmittedTrackedItem';
import RequestedFilesInfo from '../components/RequestedFilesInfo';

import { getClaimType } from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';
import { cstUseLighthouse } from '../selectors';

const NEED_ITEMS_STATUS = 'NEEDED';

const isEVSSClaim = claim => claim.type === 'evss_claims';

const isAssociatedWithAnyTrackedItem = doc => doc.trackedItemId !== null;

const isAssociatedWithTrackedItem = itemId => doc =>
  doc.trackedItemId === itemId;

const getDocsAssociatedWithTrackedItems = docs =>
  docs.filter(isAssociatedWithAnyTrackedItem);

const getDocsAssociatedWithTrackedItem = (item, docs) => {
  const predicate = isAssociatedWithTrackedItem(item.trackedItemId);
  return docs.filter(predicate);
};

// const filterAssociatedDocs = docs =>
//   docs.filter(!isAssociatedWithAnyTrackedItem);

const associateDocsWithTrackedItems = (items, docs) => {
  return items.map(item => {
    const newItem = { ...item };
    const associatedDocs = getDocsAssociatedWithTrackedItem(newItem, docs);
    newItem.documents = associatedDocs;
    return newItem;
  });
};

const getTrackedItems = claim => {
  const {
    eventsTimeline,
    supportingDocuments,
    trackedItems,
  } = claim.attributes;

  if (isEVSSClaim(claim)) {
    return eventsTimeline.filter(event => event.type.endsWith('_list'));
  }

  const associatedDocuments = getDocsAssociatedWithTrackedItems(
    supportingDocuments,
  );

  return associateDocsWithTrackedItems(trackedItems, associatedDocuments);
};

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

  setTitle() {
    document.title = this.props.loading
      ? 'Files - Your claim'
      : `Files - Your ${getClaimType(this.props.claim)} claim`;
  }

  getPageContent() {
    const { claim, params, useLighthouse } = this.props;
    if (!useLighthouse) {
      return <FilesPageContent claim={claim} params={params} />;
    }

    const {
      claimPhaseDates,
      closeDate,
      evidenceWaiverSubmitted5103,
      supportingDocuments,
    } = claim.attributes;

    const isOpen = closeDate === null;

    const waiverSubmitted = evidenceWaiverSubmitted5103;
    const showDecision =
      claimPhaseDates.latestPhaseType === 'Gathering of evidence' &&
      !waiverSubmitted;
    const trackedItems = getTrackedItems(claim);
    const filesNeeded = trackedItems.filter(
      event =>
        event.trackedItemStatus === NEED_ITEMS_STATUS &&
        event.neededFrom === 'YOU',
    );
    const optionalFiles = trackedItems.filter(
      event =>
        event.trackedItemStatus === NEED_ITEMS_STATUS &&
        event.neededFrom === 'OTHERS',
    );
    const documentsTurnedIn = trackedItems.filter(event => {
      return event.trackedItemStatus !== NEED_ITEMS_STATUS;
    });
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
              (item.status || item.trackedItemStatus) && item.trackedItemId ? (
                <SubmittedTrackedItem item={item} key={itemIndex} />
              ) : (
                <AdditionalEvidenceItem item={item} key={itemIndex} />
              ),
          )}
        </div>
      </div>
    );
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
    useLighthouse: cstUseLighthouse(state),
  };
}

const mapDispatchToProps = {
  clearNotification,
};

FilesPage.propTypes = {
  clearNotification: PropTypes.func,
  loading: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilesPage);

export { FilesPage };

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
