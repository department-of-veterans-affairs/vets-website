import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom-v5-compat';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import AskVAToDecide from '../components/AskVAToDecide';
import AdditionalEvidenceItem from '../components/AdditionalEvidenceItem';
import SubmittedTrackedItem from '../components/SubmittedTrackedItem';
import RequestedFilesInfo from '../components/RequestedFilesInfo';

import { clearNotification as clearNotificationAction } from '../actions';
import { getClaimType } from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';

const NEED_ITEMS_STATUS = 'NEEDED';
const FIRST_GATHERING_EVIDENCE_PHASE = 3;

const setTitle = (claim, loading) => {
  document.title = loading
    ? 'Files - Your claim'
    : `Files - Your ${getClaimType(claim)} claim`;
};

const FilesPage = ({
  claim,
  clearNotification,
  lastPage,
  loading,
  message,
  synced,
}) => {
  const params = useParams();
  useEffect(() => {
    setTitle();

    if (!isTab(lastPage)) {
      if (!loading) {
        setUpPage();
      } else {
        scrollToTop();
      }
    } else {
      setFocus('.va-tab-trigger--current');
    }

    return () => clearNotification();
  }, []);

  useEffect(
    () => {
      if (!loading && !isTab(lastPage)) {
        setUpPage(false);
        setTitle();
      }
    },
    [lastPage, loading],
  );

  let content = null;
  if (!loading && claim) {
    const showDecision =
      claim.attributes.phase === FIRST_GATHERING_EVIDENCE_PHASE &&
      !claim.attributes.waiverSubmitted;
    const trackedItems = claim.attributes.eventsTimeline.filter(event =>
      event.type.endsWith('_list'),
    );
    const filesNeeded = trackedItems.filter(
      event =>
        event.status === NEED_ITEMS_STATUS &&
        event.type === 'still_need_from_you_list',
    );
    const optionalFiles = trackedItems.filter(
      event =>
        event.status === NEED_ITEMS_STATUS &&
        event.type === 'still_need_from_others_list',
    );
    const documentsTurnedIn = trackedItems.filter(
      event =>
        event.status !== NEED_ITEMS_STATUS ||
        !event.type.startsWith('still_need_from'),
    );

    content = (
      <div>
        {claim.attributes.open && (
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
              item.trackedItemId ? (
                <SubmittedTrackedItem item={item} key={itemIndex} />
              ) : (
                <AdditionalEvidenceItem item={item} key={itemIndex} />
              ),
          )}
        </div>
      </div>
    );
  }

  return (
    <ClaimDetailLayout
      claim={claim}
      loading={loading}
      clearNotification={clearNotification}
      currentTab="Files"
      message={message}
      synced={synced}
    >
      {content}
    </ClaimDetailLayout>
  );
};

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
  clearNotification: clearNotificationAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilesPage);

export { FilesPage };
