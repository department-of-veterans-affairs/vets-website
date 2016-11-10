import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import ClaimDetailLayout from '../components/ClaimDetailLayout';
import DueDate from '../components/DueDate';
import AdditionalEvidenceItem from '../components/AdditionalEvidenceItem';
import SubmittedTrackedItem from '../components/SubmittedTrackedItem';

import { clearNotification } from '../actions';
import { truncateDescription } from '../utils/helpers';
import { scrollToTop, setUpPage, isTab, setFocus } from '../utils/page';

const NEED_ITEMS_STATUS = 'NEEDED';

class FilesPage extends React.Component {
  componentDidMount() {
    document.title = 'Files - Your Disability Compensation Claim';
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
        .filter(event => event.status !== NEED_ITEMS_STATUS || event.type.startsWith('received_from'));

      content = (
        <div>
          <div className="file-request-list">
            <h4 className="hightlight claim-file-border">File requests</h4>

            {filesNeeded.length + optionalFiles.length === 0
              ? <div className="no-documents"><p>You don't need to turn in any documents to VA.</p></div>
              : null}

            {filesNeeded.map(item => (
              <div className="file-request-list-item usa-alert usa-alert-warning claims-no-icon" key={item.trackedItemId}>
                <div className="item-container">
                  <h5 className="file-request-title">{item.displayName}</h5>
                  <p>{truncateDescription(item.description)}</p>
                  <DueDate date={item.suspenseDate}/>
                </div>
                <Link aria-label={`View Details for ${item.displayName}`} title={`View Details for ${item.displayName}`} className="usa-button usa-button-outline view-details-button" to={`your-claims/${claim.id}/document-request/${item.trackedItemId}`}>View Details</Link>
                <div className="clearfix"></div>
              </div>
            ))}

            {optionalFiles.map(item => (
              <div className="file-request-list-item usa-alert usa-alert-warning claims-no-icon" key={item.trackedItemId}>
                <div className="item-container">
                  <h5 className="file-request-title">{item.displayName}</h5>
                  <p>{truncateDescription(item.description)}</p>
                  <div className="claims-optional-desc"><h6>Optional</h6> - we requested this from others, but you may upload it if you have it.</div>
                </div>
                <Link aria-label={`View Details for ${item.displayName}`} title={`View Details for ${item.displayName}`} className="usa-button usa-button-outline view-details-button" to={`your-claims/${claim.id}/document-request/${item.trackedItemId}`}>View Details</Link>
                <div className="clearfix"></div>
              </div>
            ))}
          </div>

          <div className="submit-file-container">
            <div className="submit-additional-evidence">
              <h4 className="hightlight claim-file-border">Turn in more evidence</h4>
              {claim.attributes.waiverSubmitted
                ?
                <div className="va-to-make-decision">
                  <p>You asked VA to make a decision on your claims based on the evidence you filed. You don't have to do anything else.</p>
                </div>
                :
                <div className="usa-alert additional-evidence-alert">
                  <div className="item-container">
                    <p>Do you have additional evidence to submit in order to support your claim? Upload it here now.</p>
                  </div>
                  <Link aria-label="View details for additional evidence" title="View details for additional evidence" className="usa-button usa-button-outline view-details-button" to={`your-claims/${claim.id}/turn-in-evidence`}>View Details</Link>
                  <div className="clearfix"></div>
                </div>
              }
            </div>

            <div className="submitted-files-list">
              <h4 className="hightlight claim-file-border">Documents filed</h4>
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
  return {
    loading: state.claimDetail.loading,
    claim: state.claimDetail.detail,
    message: state.notifications.message,
    lastPage: state.routing.lastPage
  };
}

const mapDispatchToProps = {
  clearNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesPage);

export { FilesPage };
