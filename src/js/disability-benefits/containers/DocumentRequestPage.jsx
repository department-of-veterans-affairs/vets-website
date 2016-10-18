import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import AskVAQuestions from '../components/AskVAQuestions';
import AddFilesForm from '../components/AddFilesForm';
import Loading from '../components/Loading';

import { addFile, removeFile, submitFiles, getTrackedItem } from '../actions';

class DocumentRequestPage extends React.Component {
  componentWillReceiveProps(props) {
    if (props.uploadComplete) {
      this.goToFilesPage();
    }
  }
  goToFilesPage() {
    this.props.router.push(`your-claims/${this.props.claim.id}/files`);
  }
  render() {
    let content;

    if (this.props.loading) {
      content = <Loading/>;
    } else {
      content = (
        <div>
          {this.props.uploadError
            ? <div className="upload-error usa-alert usa-alert-error">
              <div className="usa-alert-body">
                <h3 className="usa-alert-heading">Error uploading Files</h3>
                <p className="usa-alert-text">{"There was an error uploading your files. Please try again"}</p>
              </div>
            </div>
            : null}
          <h1>{this.props.trackedItem.displayName}</h1>
          <div className="optional-upload">
            <p><strong>Optional</strong> - we've requested this from others, but you may upload it if you have it.</p>
          </div>
          <div className="mail-or-fax-files">
            <p><a href="/">Need to mail or fax your files?</a></p>
          </div>
          <AddFilesForm
              progress={this.props.progress}
              uploading={this.props.uploading}
              files={this.props.files}
              onSubmit={() => this.props.submitFiles(
                this.props.claim.id,
                this.props.trackedItem.trackedItemId,
                this.props.files
              )}
              onAddFile={this.props.addFile}
              onRemoveFile={this.props.removeFile}/>
        </div>
      );
    }

    return (
      <div className="row">
        <div className="small-12 medium-8 columns usa-content">
          <div name="topScrollElement"></div>
          {content}
        </div>
        <AskVAQuestions/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  let trackedItem = null;
  if (state.claimDetail.detail) {
    trackedItem = state.claimDetail.detail.attributes.eventsTimeline
      .filter(event => event.trackedItemId === parseInt(ownProps.params.trackedItemId, 10))[0];
  }
  return {
    loading: state.claimDetail.loading,
    claim: state.claimDetail.detail,
    trackedItem,
    files: state.trackedItem.uploads.files,
    uploading: state.trackedItem.uploads.uploading,
    progress: state.trackedItem.uploads.progress,
    uploadError: state.trackedItem.uploads.uploadError,
    uploadComplete: state.trackedItem.uploads.uploadComplete
  };
}

const mapDispatchToProps = {
  addFile,
  removeFile,
  submitFiles,
  getTrackedItem
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DocumentRequestPage));

export { DocumentRequestPage };
