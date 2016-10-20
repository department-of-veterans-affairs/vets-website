import React from 'react';
import { connect } from 'react-redux';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import EvidenceSubmitted from '../components/EvidenceSubmitted';
import { clearUploadedItem } from '../actions';

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

    return (
      <div>
        <ClaimDetailLayout
            claim={claim}
            loading={loading}
            message={message}>
          <div className="file-request-list">
            <h4 className="hightlight claim-file-border">File Requests</h4>
            <div className="no-documents">
              <p>You don't need to turn in any documents to VA.</p>
            </div>
            <div className="file-request-list-item usa-alert usa-alert-warning claims-no-icon">
              <div className="item-container">
                <h5>DD214</h5>
                <h6 className="past-due"><i className="fa fa-exclamation-triangle"></i>Needed from you</h6>
                <p className="past-due"> - due 3 days ago</p>
              </div>
              <div className="button-container">
                <button className="usa-button-outline">View Details</button>
              </div>
              <div className="clearfix"></div>
            </div>

            <div className="file-request-list-item usa-alert usa-alert-warning claims-no-icon">
              <div className="item-container">
                <h5>PTSD questionnaire</h5>
                <h6 className="due-file"><i className="fa fa-exclamation-triangle"></i>Needed from you</h6>
                <p className="due-file"> - due in 11 days</p>
              </div>
              <div className="button-container">
                <button className="usa-button-outline">View Details</button>
              </div>
              <div className="clearfix"></div>
            </div>

            <div className="file-request-list-item usa-alert">
              <div className="item-container">
                <h5>Military personnel record</h5>
                <h6>Optional</h6>
                <p>- we requested this from others, but you may upload it if you have it.</p>
              </div>
              <div className="button-container">
                <button className="usa-button-outline">View Details</button>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
          <div className="submit-file-container">
            <div className="submit-additional-evidence">
              <h4 className="hightlight claim-file-border">Turn in more evidence</h4>
              <div className="va-to-make-decision">
                <p>You asked VA to make a decision on your claims based on the evidence you filed. You don't have to do anything else.</p>
              </div>
              <div className="usa-alert">
                <p>Do you have additional evidence to submit in order to support your claim? Upload it here now.</p>
                <div className="button-container">
                  <button className="usa-button-outline">View Details</button>
                </div>
                <div className="clearfix"></div>
              </div>
            </div>
            <div className="submitted-files-list">
              <h4 className="hightlight claim-file-border">Documents Filed</h4>
              <div className="no-documents-turned-in">
                <p>You haven't turned in any documents to VA.</p>
              </div>
              <div className="submitted-file-list-item">
                <p className="submission-file-type">DD214</p>
                <p className="submission-item">dd214-l-webber.pdf</p>
                <h6>Submitted</h6>
                <p className="submission-date">Jul 17, 2016 {' (pending)'}</p>
              </div>
              <div className="submitted-file-list-item">
                <p className="submission-file-type">Accrued wages from last employer</p>
                <p className="submission-item">{"wage-statement-2016.pdf"}</p>
                <h6 className="reviewed-file"><i className="fa fa-check-circle"></i>Reviewed by VA</h6>
                <p className="submission-date reviewed-file">Jul 17, 2016 {' (pending)'}</p>
              </div>
            </div>
          </div>
        </ClaimDetailLayout>
      </div>
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
