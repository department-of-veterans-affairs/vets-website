import React from 'react';
import Scroll from 'react-scroll';
import { withRouter, Link } from 'react-router';
import { connect } from 'react-redux';
import AskVAQuestions from '../components/AskVAQuestions';
import AddFilesForm from '../components/AddFilesForm';
import Loading from '../components/Loading';
import UploadError from '../components/UploadError';
import EvidenceWarning from '../components/EvidenceWarning';

import {
  addFile,
  removeFile,
  submitFiles,
  updateField,
  showMailOrFaxModal,
  cancelUpload,
  getClaimDetail,
  setFieldsDirty,
  resetUploads
} from '../actions';

const scrollToError = () => {
  Scroll.scroller.scrollTo('uploadError', {
    duration: 500,
    offset: -25,
    delay: 0,
    smooth: true
  });
};

class TurnInEvidencePage extends React.Component {
  componentDidMount() {
    this.props.resetUploads();
    document.title = 'Turn in More Evidence';
  }
  componentWillReceiveProps(props) {
    if (props.uploadComplete) {
      this.goToFilesPage();
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.uploadError && !prevProps.uploadError) {
      scrollToError();
    }
  }
  goToFilesPage() {
    this.props.getClaimDetail(this.props.claim.id);
    this.props.router.push(`your-claims/${this.props.claim.id}/files`);
  }
  render() {
    let content;

    if (this.props.loading) {
      content = <Loading/>;
    } else {
      content = (
        <div className="claim-container">
          <nav className="va-nav-breadcrumbs">
            <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
              <li><Link to="your-claims">Your claims</Link></li>
              <li><Link to={`your-claims/${this.props.claim.id}`}>Your Compensation Claim</Link></li>
              <li className="active">Turn in More Evidence</li>
            </ul>
          </nav>
          {this.props.uploadError
            ? <UploadError/>
            : null}
          <h1 className="claims-header">Turn in More Evidence</h1>
          <EvidenceWarning/>
          <AddFilesForm
              field={this.props.uploadField}
              progress={this.props.progress}
              uploading={this.props.uploading}
              files={this.props.files}
              showMailOrFax={this.props.showMailOrFax}
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
    showMailOrFax: state.uploads.showMailOrFax
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
  resetUploads
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TurnInEvidencePage));

export { TurnInEvidencePage };
