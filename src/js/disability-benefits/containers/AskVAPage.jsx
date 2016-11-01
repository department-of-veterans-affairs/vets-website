import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router';
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
  componentDidMount() {
    document.title = 'Ask VA for a Claim Decision';
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
            <nav className="va-nav-breadcrumbs">
              <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
                <li><Link to="your-claims">Your claims</Link></li>
                <li><Link to={`your-claims/${this.props.params.id}`}>Your Compensation Claim</Link></li>
                <li className="active">Ask VA for a Claim Decision</li>
              </ul>
            </nav>
            <div>
              <h1>Ask VA for a Claim Decision</h1>
              <p className="first-of-type">You should have received a letter in the mail requesting additional evidence VA needs to support your claim.</p>
              <p>We will wait 30 days to receive your evidence but if you don't have anything more to submit, let us know and we will go ahead and prepare to make a decision on your claim.</p>
              <p>Taking the full 30 days won’t affect:</p>
              <ul>
                <li>Whether you get VA benefits</li>
                <li>The payment amount</li>
                <li>Whether you get help from VA to gather evidence to support your claim</li>
                <li>The date benefits will begin if VA approves your claim</li>
              </ul>
              <div className="usa-alert usa-alert-info claims-no-icon claims-alert">
                <ErrorableCheckbox
                    className="claims-alert-checkbox"
                    checked={this.state.submittedDocs}
                    onValueChange={(update) => this.setSubmittedDocs(update)}

                    label="I have submitted all evidence that will support my claim and I'm not going to turn in any more information. I would like VA to make a decision on my claim based on the information already provided."/>
              </div>
              <button
                  disabled={submitDisabled}
                  className={submitDisabled ? 'usa-button-primary usa-button-disabled' : 'usa-button-primary'}
                  onClick={() => this.props.submitRequest(this.props.params.id)}>
                {buttonMsg}
              </button>
              {!loadingDecisionRequest
                ? <a className="usa-button-outline request-decision-button" onClick={this.goToStatusPage}>Not yet, I still have more evidence to submit</a>
                : null}
            </div>
          </div>
          <div className="small-12 medium-8 columns">
            <AskVAQuestions/>
          </div>
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
