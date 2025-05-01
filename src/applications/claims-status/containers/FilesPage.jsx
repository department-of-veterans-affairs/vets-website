import React, { useEffect, useRef, useCallback } from 'react';
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

const FilesPage = ({
  claim,
  clearNotification: clearNotif,
  lastPage,
  loading,
  location,
  message,
}) => {
  /* --------------------- componentDidMount ----------------------------- */
  useEffect(() => {
    if (claimAvailable(claim)) setTabDocumentTitle(claim, 'Files');

    if (location?.hash === '') {
      const timer = setTimeout(() => {
        setPageFocus(lastPage, loading);
      });
      return () => clearTimeout(timer); // cleanup if unmounts early
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  /* --------------------- componentDidUpdate ---------------------------- */
  const prevLoadingRef = useRef(loading);

  useEffect(() => {
    const prevLoading = prevLoadingRef.current;

    if (!loading && prevLoading && !isTab(lastPage)) {
      setUpPage(false);
    }
    if (loading !== prevLoading) {
      setTabDocumentTitle(claim, 'Files');
    }

    prevLoadingRef.current = loading;
  }, [loading, lastPage, claim]);

  /* -------------------- componentWillUnmount --------------------------- */
  useEffect(() => () => clearNotif(), [clearNotif]);

  /* -------------------------- helpers ---------------------------------- */
  const getPageContent = useCallback(() => {
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
    const waiverSubmitted = evidenceWaiverSubmitted5103;

    const showDecision =
      claimPhaseDates.latestPhaseType === FIRST_GATHERING_EVIDENCE_PHASE &&
      !waiverSubmitted;

    const documentsTurnedIn = [
      ...trackedItems.filter(item => !item.status.startsWith(NEED_ITEMS_STATUS)),
      ...supportingDocuments,
    ].sort((a, b) => (a.date === b.date ? -1 : a.date > b.date ? -1 : 1));

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
  }, [claim]);

  /* --------------------------- render ---------------------------------- */
  const content = !loading && claim ? getPageContent() : null;

  return (
    <ClaimDetailLayout
      claim={claim}
      loading={loading}
      clearNotification={clearNotif}
      currentTab="Files"
      message={message}
    >
      {content}
    </ClaimDetailLayout>
  );
};

/* --------------------------- Redux wiring ------------------------------ */
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
  connect(mapStateToProps, mapDispatchToProps)(FilesPage),
);
export { FilesPage };
