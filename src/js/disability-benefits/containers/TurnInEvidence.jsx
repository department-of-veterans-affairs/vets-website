import React from 'react';
import AskVAQuestions from '../components/AskVAQuestions';
import AddFilesForm from '../components/AddFilesForm';

class TurnInEvidence extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="medium-8 columns">
            <div className="upload-error usa-alert usa-alert-error">
              <div className="usa-alert-body">
                <h3 className="usa-alert-heading">Error uploading Files</h3>
                <p className="usa-alert-text">{"There was an error uploading your files. Please try again"}</p>
              </div>
            </div>
            <h1>{'Turn in More Evidence'}</h1>
            <div className="optional-upload">
              <p>Optional - we've requested this from others, but you may upload it if you have it.</p>
            </div>
            <div className="turn-in-evidence-warning usa-alert usa-alert-warning">
              <div className="usa-alert-body">
                <h3 className="usa-alert-heading">Warning</h3>
                <p className="usa-alert-text">It takes time for us to review any new evidence you file, so please upload only the documents that support your claim.</p>
              </div>
            </div>
            <div className="mail-or-fax-files">
              <p><a href="/">Need to mail or fax your files?</a></p>
            </div>
            <AddFilesForm/>
          </div>
          <AskVAQuestions/>
        </div>
      </div>
    );
  }
}

export default TurnInEvidence;
