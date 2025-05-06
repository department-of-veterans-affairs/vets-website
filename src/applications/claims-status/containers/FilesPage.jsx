import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Toggler } from '~/platform/utilities/feature-toggles';

import { clearNotification } from '../actions';

import AskVAToDecide from '../components/AskVAToDecide';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import AdditionalEvidencePage from '../components/claim-files-tab/AdditionalEvidencePage';
import ClaimFileHeader from '../components/claim-files-tab/ClaimFileHeader';
import DocumentsFiled from '../components/claim-files-tab/DocumentsFiled';
import withRouter from '../utils/withRouter';

import {
  claimAvailable,
  isClaimOpen,
  setPageFocus,
  setTabDocumentTitle,
} from '../utils/helpers';
import { setUpPage, isTab } from '../utils/page';

// CONSTANTS
const NEED_ITEMS_STATUS = 'NEEDED_FROM_';
const FIRST_GATHERING_EVIDENCE_PHASE = 'GATHERING_OF_EVIDENCE';

const FilesPage = props => {
  const {
    claim,
    clearNotification: clearNotificationProp,
    lastPage,
    loading,
    location,
    message,
  } = props;

  const prevLoading = useRef(loading);

  useEffect(() => {
    // Only set the document title at mount-time if the claim is already available.
    if (claimAvailable(claim)) setTabDocumentTitle(claim, 'Files');

    if (location?.hash === '') {
      setTimeout(() => setPageFocus(lastPage, loading));
    }
  }, []);

  useEffect(
    () => {
      if (!loading && prevLoading.current && !isTab(lastPage)) {
        setUpPage(false);
      }
      // Set the document title when loading completes.
      //   If loading was successful it will display a title specific to the claim.
      //   Otherwise it will display a default title of "Files for Your Claim".
      if (loading !== prevLoading.current) {
        setTabDocumentTitle(claim, 'Files');
      }
      prevLoading.current = loading;
    },
    [loading, lastPage, claim],
  );

  useEffect(
    () => () => {
      clearNotificationProp();
    },
    [clearNotificationProp],
  );

  const getPageContent = () => {
    // Return null if the claim/ claim.attributes dont exist
    if (!claimAvailable(claim)) return null;

    const {
      closeDate,
      status,
      supportingDocuments,
      trackedItems,
      evidenceWaiverSubmitted5103,
      claimPhaseDates,
    } = claim.attributes;

    const isOpen = isClaimOpen(status, closeDate);
    const showDecision =
      claimPhaseDates.latestPhaseType === FIRST_GATHERING_EVIDENCE_PHASE &&
      !evidenceWaiverSubmitted5103;

    const documentsTurnedIn = [
      ...trackedItems.filter(i => !i.status.startsWith(NEED_ITEMS_STATUS)),
      ...supportingDocuments,
    ].sort((a, b) => {
      if (a.date === b.date) return -1;
      if (a.date > b.date) return -1;
      return 1;
    });

    return (
      <div className="claim-files">
        <ClaimFileHeader isOpen={isOpen} />
        <AdditionalEvidencePage />
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cst5103UpdateEnabled}>
          <Toggler.Disabled>
            {showDecision && <AskVAToDecide />}
          </Toggler.Disabled>
        </Toggler>
        <DocumentsFiled claim={claim} documents={documentsTurnedIn} />
      </div>
    );
  };

  return (
    <ClaimDetailLayout
      claim={claim}
      loading={loading}
      clearNotification={clearNotificationProp}
      currentTab="Files"
      message={message}
    >
      {!loading && claim && getPageContent()}
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
  };
}

const mapDispatchToProps = { clearNotification };

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
