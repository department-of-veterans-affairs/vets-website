import React from 'react';
import { connect } from 'react-redux';
import { setVeteran, setComments, setFiles, submitFiles } from '../actions';
import { DocumentUploader } from '../components/DocumentUploader.jsx';

class DocumentUploaderApp extends React.Component {
  render() {
    return (
      <div className="usa-grid">
        <DocumentUploader {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.documentUploader,
});

const mapDispatchToProps = {
  setVeteran,
  setComments,
  setFiles,
  submitFiles,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentUploaderApp);

export { DocumentUploaderApp };
