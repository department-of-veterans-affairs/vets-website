import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  // START ligthouse_migration
  submit5103 as submit5103Action,
  submitRequest as submitRequestAction,
  getClaim as getClaimAction,
  getClaimDetail as getClaimEVSSAction,
  // END lighthouse_migration
} from '../actions';
import AskVAQuestions from '../components/AskVAQuestions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
// START lighthouse_migration
import { cstUseLighthouse } from '../selectors';
// END lighthouse_migration
import { setUpPage } from '../utils/page';

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
      // START lighthouse_migration
      if (this.props.useLighthouseShow) {
        props.getClaimLighthouse(this.props.params.id);
      } else {
        props.getClaimEVSS(this.props.params.id);
      }
      // END lighthouse_migration
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
    const {
      loadingDecisionRequest,
      decisionRequestError,
      submit5103,
      submitRequest,
      useLighthouse5103,
    } = this.props;

    const submitFunc = useLighthouse5103 ? submit5103 : submitRequest;
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
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0  vads-u-margin-bottom--7">
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
                <VaCheckbox
                  className="claims-alert-checkbox"
                  uswds="false"
                  checked={this.state.submittedDocs}
                  label="I have submitted all evidence that will support my claim and I’m not going to turn in any more information. I would like VA to make a decision on my claim based on the information already provided."
                  onVaChange={e => this.setSubmittedDocs(e.detail.checked)}
                />
              </div>
              <button
                disabled={submitDisabled}
                type="button"
                className={
                  submitDisabled
                    ? 'usa-button-primary usa-button-disabled'
                    : 'usa-button-primary'
                }
                onClick={() => submitFunc(this.props.params.id)}
              >
                {buttonMsg}
              </button>
              {!loadingDecisionRequest ? (
                <button
                  className="usa-button-secondary"
                  onClick={this.goToStatusPage}
                  type="button"
                >
                  Not yet–I still have more evidence to submit
                </button>
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
    // START lighthouse_migration
    useLighthouse5103: cstUseLighthouse(state, '5103'),
    useLighthouseShow: cstUseLighthouse(state, 'show'),
    // END lighthouse_migration
  };
}

const mapDispatchToProps = {
  // START lighthouse_migration
  submit5103: submit5103Action,
  submitRequest: submitRequestAction,
  getClaimEVSS: getClaimEVSSAction,
  getClaimLighthouse: getClaimAction,
  // END lighthouse_migration
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AskVAPage),
);

AskVAPage.propTypes = {
  decisionRequestError: PropTypes.string,
  decisionRequested: PropTypes.bool,
  // START lighthouse_migration
  getClaimEVSS: PropTypes.func,
  getClaimLighthouse: PropTypes.func,
  // END lighthouse_migration
  loadingDecisionRequest: PropTypes.bool,
  params: PropTypes.object,
  router: PropTypes.object,
  // START lighthouse_migration
  submit5103: PropTypes.func,
  submitRequest: PropTypes.func,
  useLighthouse5103: PropTypes.bool,
  useLighthouseShow: PropTypes.bool,
  // END lighthouse_migration
};

export { AskVAPage };
