import React from 'react';
import TabNav from '../components/TabNav';
import AskVAQuestions from '../components/AskVAQuestions';


class FilesPage extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="medium-8 columns">
            <div className="claim-conditions">
              <h1>Your {"Compensation"} Claim</h1>
              <h6>Your Claimed Conditions:</h6>
              <p className="list">{"Tinnitus, Arthritis, PTSD"}</p>
              <TabNav/>
            </div>
            <div className="file-request-list">
              <h4 className="hightlight claim-file-border">File Requests</h4>

              <div className="file-request-list-item">
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

              <div className="file-request-list-item">
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

              <div className="file-request-list-item">
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
                <h4 className="hightlight claim-file-border">Submit Additional Evidence</h4>
                <p>Do you have additional evidence to submit in order to support your claim? Upload it here now.</p>
                <div className="button-container">
                  <button className="usa-button-outline">View Details</button>
                </div>
                <div className="clearfix"></div>
              </div>
              <div className="submitted-files-list">
                <h4 className="hightlight claim-file-border">Submitted Files</h4>
                <div className="submitted-file-list-item">
                  <p className="submission-file-type">DD214</p>
                  <p>dd214-l-webber.pdf</p>
                  <h6>Submitted</h6>
                  <p className="submission-date">Jul 17, 2016 {' (pending)'}</p>
                </div>
                <div className="submitted-file-list-item">
                  <p className="submission-file-type">Accrued wages from last employer</p>
                  <p>{"wage-statement-2016.pdf"}</p>
                  <h6 className="reviewed-file"><i className="fa fa-check-circle"></i>Reviewed by VA</h6>
                  <p className="submission-date reviewed-file">Jul 17, 2016 {' (pending)'}</p>
                </div>
              </div>
            </div>
          </div>
          <AskVAQuestions/>

        </div>
      </div>
    );
  }
}

export default FilesPage;
