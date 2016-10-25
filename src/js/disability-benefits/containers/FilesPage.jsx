import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';

import EvidenceSubmitted from '../components/EvidenceSubmitted';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import DueDate from '../components/DueDate';

import { clearUploadedItem } from '../actions';
import { hasBeenReviewed } from '../utils/helpers';

class FilesPage extends React.Component {
  constructor() {
    super();
    this.closeAlert = this.closeAlert.bind(this);
  }
  closeAlert() {
    this.props.clearUploadedItem();
  }
  render() {
    const { claim, loading, uploadedItem } = this.props;

    const message = uploadedItem
      ? <EvidenceSubmitted item={uploadedItem} onClose={this.closeAlert}/>
      : null;

    let content = null;
    if (!loading) {
      const filesNeeded = claim.attributes.eventsTimeline.filter(event => event.type === 'still_need_from_you_list');
      const optionalFiles = claim.attributes.eventsTimeline.filter(event => event.type === 'still_need_from_others_list');
      const documentsTurnedIn = claim.attributes.eventsTimeline.filter(event => event.type.startsWith('received_from'));

      content = (
        <div>
          <div className="file-request-list">
            <h4 className="hightlight claim-file-border">File requests</h4>

            {filesNeeded.length === 0
              ? <div className="no-documents"><p>You don't need to turn in any documents to VA.</p></div>
              : null}

            {filesNeeded.map(item => (
              <div className="file-request-list-item usa-alert usa-alert-warning claims-no-icon" key={item.trackedItemId}>
                <div className="item-container">
                  <h5>{item.displayName}</h5>
                  <DueDate date={item.suspenseDate}/>
                </div>
                <div className="button-container">
                  <Link className="usa-button usa-button-outline" to={`your-claims/${claim.id}/document-request/${item.trackedItemId}`}>View Details</Link>
                </div>
                <div className="clearfix"></div>
              </div>
            ))}

            {optionalFiles.map(item => (
              <div className="file-request-list-item usa-alert usa-alert-warning claims-no-icon" key={item.trackedItemId}>
                <div className="item-container">
                  <h5>{item.displayName}</h5>
                  <h6>Optional</h6>
                  <p>- we requested this from others, but you may upload it if you have it.</p>
                </div>
                <div className="button-container">
                  <Link className="usa-button usa-button-outline" to={`your-claims/${claim.id}/document-request/${item.trackedItemId}`}>View Details</Link>
                </div>
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
                <div className="usa-alert">
                  <p>Do you have additional evidence to submit in order to support your claim? Upload it here now.</p>
                  <div className="button-container">
                    <Link className="usa-button usa-button-outline" to={`your-claims/${claim.id}/turn-in-evidence`}>View Details</Link>
                  </div>
                  <div className="clearfix"></div>
                </div>
              }
            </div>

            <div className="submitted-files-list">
              <h4 className="hightlight claim-file-border">Documents filed</h4>
              {documentsTurnedIn.length === 0
                ? <div className="no-documents-turned-in"><p>You haven't turned in any documents to VA.</p></div>
                : null}

              {documentsTurnedIn.map(item => (
                <div className="submitted-file-list-item" key={item.trackedItemId}>
                  <p className="submission-file-type">{item.displayName}</p>
                  {item.documents
                    ? item.documents.map((doc, index) =>
                      <p key={index} className="submission-item">{doc.filename}</p>)
                    : null}
                  {hasBeenReviewed(item)
                    ?
                    <div>
                      <h6 className="reviewed-file"><i className="fa fa-check-circle"></i>Reviewed by VA</h6>
                      <p className="submission-date reviewed-file">{moment(item.receivedDate).format('MMM D, YYYY')}</p>
                    </div>
                    :
                    <div>
                      <h6>Submitted</h6>
                      <p className="submission-date">{moment(item.receivedDate).format('MMM D, YYYY')}{' (pending)'}</p>
                    </div>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <ClaimDetailLayout
          claim={claim}
          loading={loading}
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
    uploadedItem: state.uploads.uploadedItem
  };
}

const mapDispatchToProps = {
  clearUploadedItem
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesPage);

export { FilesPage };
