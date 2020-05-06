import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router';
import { submitRequest, getClaimDetail } from '../actions/index.jsx';
import { setUpPage } from '../utils/page';

import AskVAQuestions from '../components/AskVAQuestions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';

class AskVAPage extends React.Component {
  constructor() {
    super();
    this.goToStatusPage = this.goToStatusPage.bind(this);
    this.setSubmittedDocs = this.setSubmittedDocs.bind(this);
    this.state = { submittedDocs: false };
  }
  componentDidMount() {
    document.title = 'Ask for your Claim Decision';
    setUpPage();
  }
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(props) {
    if (props.decisionRequested) {
      props.getClaimDetail(this.props.params.id);
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
    const submitDisabled =
      !this.state.submittedDocs ||
      loadingDecisionRequest ||
      decisionRequestError;

    let buttonMsg = 'Submit';
    if (loadingDecisionRequest) {
      buttonMsg = 'Submitting...';
    } else if (decisionRequestError !== null) {
      buttonMsg = 'Something went wrong...';
    }
    return (
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12">
            <ClaimsBreadcrumbs>
              <Link to={`your-claims/${this.props.params.id}`}>
                Status details
              </Link>
              <Link to={`your-claims/${this.props.params.id}/ask-va-to-decide`}>
                Ask for your claim decision
              </Link>
            </ClaimsBreadcrumbs>
          </div>
        </div>
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <div>
              <h1>Ask for your claim decision</h1>
              <p className="first-of-type">
                We sent you a letter in the mail asking for more evidence to
                support your claim. We’ll wait 30 days for your evidence. If you
                don’t have anything more you want to submit, let us know and
                we’ll go ahead and make a decision on your claim.
              </p>
              <p>Taking the full 30 days won’t affect:</p>
              <ul>
                <li>Whether you get VA benefits</li>
                <li>The payment amount</li>
                <li>
                  Whether you get our help to gather evidence to support your
                  claim
                </li>
                <li>The date benefits will begin if we approve your claim</li>
              </ul>
              <div className="usa-alert usa-alert-info background-color-only claims-alert">
                <ErrorableCheckbox
                  className="claims-alert-checkbox"
                  checked={this.state.submittedDocs}
                  onValueChange={update => this.setSubmittedDocs(update)}
                  label="I have submitted all evidence that will support my claim and I’m not going to turn in any more information. I would like VA to make a decision on my claim based on the information already provided."
                />
              </div>
              <button
                disabled={submitDisabled}
                className={
                  submitDisabled
                    ? 'usa-button-primary usa-button-disabled'
                    : 'usa-button-primary'
                }
                onClick={() => this.props.submitRequest(this.props.params.id)}
              >
                {buttonMsg}
              </button>
              {!loadingDecisionRequest ? (
                <a
                  className="usa-button-secondary"
                  onClick={this.goToStatusPage}
                >
                  Not yet–I still have more evidence to submit
                </a>
              ) : null}
            </div>
          </div>
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 help-sidebar">
            <AskVAQuestions />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  return {
    loadingDecisionRequest: claimsState.claimAsk.loadingDecisionRequest,
    decisionRequested: claimsState.claimAsk.decisionRequested,
    decisionRequestError: claimsState.claimAsk.decisionRequestError,
  };
}

const mapDispatchToProps = {
  submitRequest,
  getClaimDetail,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AskVAPage),
);

export { AskVAPage };
