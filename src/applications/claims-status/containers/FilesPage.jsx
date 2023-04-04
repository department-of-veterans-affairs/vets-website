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

const NEED_ITEMS_STATUS = 'NEEDED';
const FIRST_GATHERING_EVIDENCE_PHASE = 3;

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

    const { eventsTimeline, open, phase, waiverSubmitted } = claim.attributes;
    const isOpen = open;
    const showDecision =
      phase === FIRST_GATHERING_EVIDENCE_PHASE && !waiverSubmitted;
    const trackedItems = eventsTimeline.filter(event =>
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

  setTitle() {
    document.title = this.props.loading
      ? 'Files - Your claim'
      : `Files - Your ${getClaimType(this.props.claim)} claim`;
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
