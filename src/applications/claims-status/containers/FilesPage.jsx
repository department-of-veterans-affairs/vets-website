import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';

// START lighthouse_migration
import FilesPageContent from '../components/evss/FilesPageContent';
// END lighthouse_migration
import AdditionalEvidenceItem from '../components/AdditionalEvidenceItem';
import AskVAToDecide from '../components/AskVAToDecide';
// START lighthouse_migration
import ClaimDetailLayoutEVSS from '../components/evss/ClaimDetailLayout';
import ClaimDetailLayoutLighthouse from '../components/ClaimDetailLayout';
// END lighthouse_migration
import RequestedFilesInfo from '../components/RequestedFilesInfo';
import SubmittedTrackedItem from '../components/SubmittedTrackedItem';
import AdditionalEvidencePage from './AdditionalEvidencePage';
import ClaimFileHeader from '../components/ClaimFileHeader';

import { clearNotification } from '../actions';
import { cstUseLighthouse } from '../selectors';
import {
  buildDateFormatter,
  getClaimType,
  setDocumentTitle,
  getFilesNeeded,
  getFilesOptional,
} from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';
import { DATE_FORMATS } from '../constants';
import { Toggler } from '~/platform/utilities/feature-toggles';

// CONSTANTS
const NEED_ITEMS_STATUS = 'NEEDED_FROM_';
const FIRST_GATHERING_EVIDENCE_PHASE = 'GATHERING_OF_EVIDENCE';

// Using a Map instead of the typical Object because
// we want to guarantee that the key insertion order
// is maintained when converting to an array of keys
const getStatusMap = () => {
  const map = new Map();
  map.set('CLAIM_RECEIVED', 'CLAIM_RECEIVED');
  map.set('INITIAL_REVIEW', 'INITIAL_REVIEW');
  map.set(
    'EVIDENCE_GATHERING_REVIEW_DECISION',
    'EVIDENCE_GATHERING_REVIEW_DECISION',
  );
  map.set('PREPARATION_FOR_NOTIFICATION', 'PREPARATION_FOR_NOTIFICATION');
  map.set('COMPLETE', 'COMPLETE');
  return map;
};

const STATUSES = getStatusMap();

// START lighthouse_migration
const getClaimDate = claim => {
  const { claimDate, dateFiled } = claim.attributes;

  return claimDate || dateFiled || null;
};
// END lighthouse_migration

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
    const { claim, params, useLighthouse } = this.props;
    if (!useLighthouse) {
      return <FilesPageContent claim={claim} params={params} />;
    }

    const {
      closeDate,
      status,
      supportingDocuments,
      trackedItems,
    } = claim.attributes;
    const isOpen = status !== STATUSES.COMPLETE && closeDate === null;
    const waiverSubmitted = claim.attributes.evidenceWaiverSubmitted5103;
    const showDecision =
      claim.attributes.claimPhaseDates.latestPhaseType ===
        FIRST_GATHERING_EVIDENCE_PHASE && !waiverSubmitted;

    const filesNeeded = getFilesNeeded(trackedItems, useLighthouse);
    const optionalFiles = getFilesOptional(trackedItems, useLighthouse);
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
            {isOpen && (
              <>
                <ClaimFileHeader />
                <AdditionalEvidencePage />
                {showDecision && <AskVAToDecide id={params.id} />}
              </>
            )}
          </Toggler.Enabled>
        </Toggler>
      </div>
    );
  }

  setTitle() {
    const { claim } = this.props;

    if (claim) {
      const claimDate = formatDate(getClaimDate(claim));
      const claimType = getClaimType(claim);
      const title = `Files For ${claimDate} ${claimType} Claim`;
      setDocumentTitle(title);
    } else {
      setDocumentTitle('Files For Your Claim');
    }
  }

  render() {
    const { claim, loading, message, synced, useLighthouse } = this.props;

    let content = null;
    if (!loading && claim) {
      content = this.getPageContent();
    }

    // START lighthouse_migration
    const ClaimDetailLayout = useLighthouse
      ? ClaimDetailLayoutLighthouse
      : ClaimDetailLayoutEVSS;
    // END lighthouse_migration

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
    useLighthouse: cstUseLighthouse(state, 'show'),
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
