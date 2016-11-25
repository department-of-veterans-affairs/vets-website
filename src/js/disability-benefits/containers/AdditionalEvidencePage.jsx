import React from 'react';
import Scroll from 'react-scroll';
import { withRouter, Link } from 'react-router';
import { connect } from 'react-redux';
import AskVAQuestions from '../components/AskVAQuestions';
import AddFilesForm from '../components/AddFilesForm';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import Notification from '../components/Notification';
import EvidenceWarning from '../components/EvidenceWarning';
import { scrollToTop, setPageFocus, setUpPage } from '../utils/page';

import {
  addFile,
  removeFile,
  submitFiles,
  updateField,
  showMailOrFaxModal,
  cancelUpload,
  getClaimDetail,
  setFieldsDirty,
  resetUploads,
  clearNotification
} from '../actions';

const scrollToError = () => {
  Scroll.scroller.scrollTo('uploadError', {
    duration: 500,
    offset: -25,
    delay: 0,
    smooth: true
  });
};
const Element = Scroll.Element;

class AdditionalEvidencePage extends React.Component {
  componentDidMount() {
    this.props.resetUploads();
    document.title = 'Additional Evidence';
    if (!this.props.loading) {
      setUpPage();
    } else {
      scrollToTop();
    }
  }
  componentWillReceiveProps(props) {
    if (props.uploadComplete) {
      this.goToFilesPage();
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.message && !prevProps.message) {
      scrollToError();
    }
    if (!this.props.loading && prevProps.loading) {
      setPageFocus();
    }
  }
  componentWillUnmount() {
    if (!this.props.uploadComplete) {
      this.props.clearNotification();
    }
  }
  goToFilesPage() {
    this.props.getClaimDetail(this.props.claim.id);
    this.props.router.push(`your-claims/${this.props.claim.id}/files`);
  }
  render() {
    let content;

    if (this.props.loading) {
      content = <LoadingIndicator setFocus message="Loading claim information"/>;
    } else {
      const filesPath = `your-claims/${this.props.claim.id}/files`;
      const message = this.props.message;

      content = (
        <div>
          <div className="row">
            <div className="medium-12 columns">
              <nav className="va-nav-breadcrumbs">
                <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
                  <li><Link to="your-claims">Your claims</Link></li>
                  <li><Link to={filesPath}>Your Disability Compensation Claim</Link></li>
                  <li className="active">Additional Evidence</li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="row">
            <div className="medium-8 columns">
              <div className="claim-container">
                {message &&
                  <div>
                    <Element name="uploadError"/>
                    <Notification title={message.title} body={message.body} type={message.type}/>
                  </div>}
                <h1 className="claims-header">Additional Evidence</h1>
                <EvidenceWarning/>
                <AddFilesForm
                    field={this.props.uploadField}
                    progress={this.props.progress}
                    uploading={this.props.uploading}
                    files={this.props.files}
                    showMailOrFax={this.props.showMailOrFax}
                    backUrl={this.props.lastPage || filesPath}
                    onSubmit={() => this.props.submitFiles(
                      this.props.claim.id,
                      null,
                      this.props.files
                    )}
                    onAddFile={this.props.addFile}
                    onRemoveFile={this.props.removeFile}
                    onFieldChange={this.props.updateField}
                    onShowMailOrFax={this.props.showMailOrFaxModal}
                    onCancel={this.props.cancelUpload}
                    onDirtyFields={this.props.setFieldsDirty}/>
              </div>
            </div>
            <div className="small-12 medium-4 columns">
              <AskVAQuestions/>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div name="topScrollElement"></div>
          {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.claimDetail.loading,
    claim: state.claimDetail.detail,
    files: state.uploads.files,
    uploading: state.uploads.uploading,
    progress: state.uploads.progress,
    uploadError: state.uploads.uploadError,
    uploadComplete: state.uploads.uploadComplete,
    uploadField: state.uploads.uploadField,
    showMailOrFax: state.uploads.showMailOrFax,
    lastPage: state.routing.lastPage,
    message: state.notifications.message
  };
}

const mapDispatchToProps = {
  addFile,
  removeFile,
  submitFiles,
  updateField,
  showMailOrFaxModal,
  cancelUpload,
  getClaimDetail,
  setFieldsDirty,
  resetUploads,
  clearNotification
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdditionalEvidencePage));

export { AdditionalEvidencePage };
