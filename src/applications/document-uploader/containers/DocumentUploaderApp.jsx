import React from 'react';
import environment from '../../../platform/utilities/environment';
import { connect } from 'react-redux';
import {
  setVeteran,
  setComments,
  setFiles,
  submitFiles,
  pollForStatus,
  setStatus,
} from '../actions';
import { DocumentUploader } from '../components/DocumentUploader.jsx';
import DocumentStatus from '../components/DocumentStatus.jsx';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

class DocumentUploaderApp extends React.Component {
  constructor(props) {
    super(props);
    this.showStatus = this.showStatus.bind(this);
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    if (params.get('id')) {
      const uploadsEndpoint = `${
        environment.API_URL
      }/services/vba_documents/v0/uploads/${params.get('id')}`;

      this.props.pollForStatus(uploadsEndpoint);
    } else {
      this.props.setStatus('ready');
    }
  }

  showStatus() {
    const pastUpload = ['recieved', 'processing', 'success', 'error'];
    return pastUpload.includes(this.props.status);
  }

  render() {
    let content;
    if (this.props.status === 'initial') {
      content = <LoadingIndicator message="Loading the passed in file" />;
    } else if (this.showStatus()) {
      content = <DocumentStatus status={this.props.status} />;
    } else {
      content = <DocumentUploader {...this.props} />;
    }

    return <div className="usa-grid document-uploader-app">{content}</div>;
  }
}

const mapStateToProps = state => ({
  ...state.documentUploader,
});

const mapDispatchToProps = {
  setVeteran,
  setComments,
  setFiles,
  setStatus,
  submitFiles,
  pollForStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentUploaderApp);

export { DocumentUploaderApp };
