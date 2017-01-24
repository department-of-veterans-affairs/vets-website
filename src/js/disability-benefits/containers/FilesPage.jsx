import React from 'react';
import { connect } from 'react-redux';

import ClaimDetailLayout from '../components/ClaimDetailLayout';
import AdditionalEvidenceItem from '../components/AdditionalEvidenceItem';
import SubmittedTrackedItem from '../components/SubmittedTrackedItem';
import RequestedFilesInfo from '../components/RequestedFilesInfo';

import { clearNotification } from '../actions';
import { getClaimType } from '../utils/helpers';
import { scrollToTop, setUpPage, isTab, setFocus } from '../utils/page';

const NEED_ITEMS_STATUS = 'NEEDED';

class FilesPage extends React.Component {
  componentDidMount() {
    document.title = `Files - Your ${getClaimType(this.props.claim)} Claim`;
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
    if (!this.props.loading && prevProps.loading && !isTab(this.props.lastPage)) {
      setUpPage(false);
    }
  }
  componentWillUnmount() {
    this.props.clearNotification();
  }
  render() {
    const { claim, loading, message } = this.props;

    let content = null;
    if (!loading) {
      const trackedItems = claim.attributes.eventsTimeline.filter(event => event.type.endsWith('_list'));
      const filesNeeded = trackedItems
        .filter(event => event.status === NEED_ITEMS_STATUS && event.type === 'still_need_from_you_list');
      const optionalFiles = trackedItems
        .filter(event => event.status === NEED_ITEMS_STATUS && event.type === 'still_need_from_others_list');
      const documentsTurnedIn = trackedItems
        .filter(event => event.status !== NEED_ITEMS_STATUS || !event.type.startsWith('still_need_from'));

      content = (
        <div>
          {claim.attributes.open &&
            <RequestedFilesInfo
                id={claim.id}
                filesNeeded={filesNeeded}
                optionalFiles={optionalFiles}/>}
          <div className="submitted-files-list">
            <h2 className="hightlight claim-file-border claim-h2">Documents filed</h2>
            {documentsTurnedIn.length === 0
              ? <div className="no-documents-turned-in"><p>You haven't turned in any documents to VA.</p></div>
              : null}

              {documentsTurnedIn
                .map((item, itemIndex) => (
                  item.trackedItemId
                    ? <SubmittedTrackedItem item={item} key={itemIndex}/>
                    : <AdditionalEvidenceItem item={item} key={itemIndex}/>))}
          </div>
        </div>
      );
    }

    return (
      <ClaimDetailLayout
          claim={claim}
          loading={loading}
          clearNotification={this.props.clearNotification}
          currentTab="Files"
          message={message}>
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
    lastPage: claimsState.routing.lastPage
  };
}

const mapDispatchToProps = {
  clearNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesPage);

export { FilesPage };
