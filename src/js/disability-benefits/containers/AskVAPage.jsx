import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { submitRequest } from '../actions';

import AskVAQuestions from '../components/AskVAQuestions';
import ErrorableCheckbox from '../../common/components/form-elements/ErrorableCheckbox';

class AskVAPage extends React.Component {
  constructor() {
    super();
    this.goToStatusPage = this.goToStatusPage.bind(this);
    this.setSubmittedDocs = this.setSubmittedDocs.bind(this);
    this.state = { submittedDocs: false };
  }
  componentWillReceiveProps(props) {
    if (props.decisionRequested) {
      this.goToStatusPage();
    }
  }
  setSubmittedDocs(val) {
    this.setState({ submittedDocs: val });
  }
  goToStatusPage() {
    this.props.router.push(`your-claims/${this.props.params.id}`);
  }
  render() {
    const { loadingDecisionRequest, decisionRequestError } = this.props;
    const submitDisabled = !this.state.submittedDocs || loadingDecisionRequest || decisionRequestError;

    let buttonMsg = 'Submit';
    if (loadingDecisionRequest) {
      buttonMsg = 'Submitting...';
    } else if (decisionRequestError !== null) {
      buttonMsg = 'Something went wrong...';
    }
    return (
      <div>
        <div className="row">
          <div className="medium-8 columns">
            <div className="va-claim-form">
              <h1>Ask VA to Decide Your Claim</h1>
              <p className="first-of-type">Have you submitted all of your evidence in support of this claim? If so, you can request that VA decide your claim as soon as possible.</p>
              <p>We provide a notice to you about the evidence and information VA needs to support your claim for benefits. At this time, you may choose to indicate whether you intend to submit additional information or evidence that would help support your claim.</p>
              <p>By checking the box below and submitting, you are letting us know you want to decide your claim without waiting 30 days. If you select “Cancel”, you are advising us to give you more time to provide us with information or evidence.</p>
              <p>Your selection will not affect:</p>
              <ul>
                <li>Whether or not you are entitled to VA benefits;</li>
                <li>The amount of benefits to which you may be entitled;</li>
                <li>The assistance VA will provide you in obtaining evidence to support your claims; or</li>
                <li>The date any benefits will begin if your claim is granted.</li>
              </ul>
              <div className="usa-alert usa-alert-info claims-no-icon claims-alert">
                <ErrorableCheckbox
                    className="claims-alert-checkbox"
                    checked={this.state.submittedDocs}
                    onValueChange={(update) => this.setSubmittedDocs(update)}

                    label="I have submitted all information or evidence that will support my claim to include identifying records from Federal treating facilities, or I have no other information or evidence to give VA to support my claim. Please decide my claim as soon as possible."/>
              </div>
              <button
                  disabled={submitDisabled}
                  className={submitDisabled ? 'usa-button-primary usa-button-disabled' : 'usa-button-primary'}
                  onClick={() => this.props.submitRequest(this.props.params.id)}>
                {buttonMsg}
              </button>
              {!loadingDecisionRequest
                ? <button className="usa-button-outline request-decision-button" onClick={this.goToStatusPage}>Cancel</button>
                : null}
            </div>
          </div>
          <AskVAQuestions/>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    loadingDecisionRequest: state.claimAsk.loadingDecisionRequest,
    decisionRequested: state.claimAsk.decisionRequested,
    decisionRequestError: state.claimAsk.decisionRequestError
  };
}

const mapDispatchToProps = {
  submitRequest
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AskVAPage));

export { AskVAPage };
