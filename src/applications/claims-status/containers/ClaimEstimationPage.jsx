import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import CallVBACenter from '@department-of-veterans-affairs/platform-static-data/CallVBACenter';
import AskVAQuestions from '../components/AskVAQuestions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import { setUpPage } from '../utils/page';

class ClaimEstimationPage extends React.Component {
  componentDidMount() {
    document.title = 'How We Come Up with Your Estimated Decision Date';
    setUpPage();
  }

  render() {
    return (
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12">
            <ClaimsBreadcrumbs>
              <Link to={`your-claims/${this.props.params.id}/status`}>
                Status details
              </Link>
              <Link to={`your-claims/${this.props.params.id}/claim-estimate`}>
                Estimated decision date
              </Link>
            </ClaimsBreadcrumbs>
          </div>
        </div>
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <div>
              <h1>How we come up with your estimated decision date</h1>
              <p className="first-of-type">
                We look at every claim carefully before making a decision.
                Sometimes we can decide quickly, but more complex claims take
                longer to review.
              </p>
              <h2 className="claims-paragraph-header">
                We base your estimated decision date on:
              </h2>
              <ul>
                <li>The type of claim you submitted</li>
                <li>The number of claims you submitted</li>
                <li>Whether there were any unusual circumstances</li>
                <li>How long it took us to decide other claims like yours</li>
                <li>How long it takes us to get supporting documents</li>
              </ul>
              <h2 className="claims-paragraph-header">
                Estimated dates may change when:
              </h2>
              <ul>
                <li>You upload optional evidence that we need to process</li>
                <li>
                  You filed a second claim that we combined with an existing
                  claim
                </li>
                <li>
                  We decide we need more evidence that supports your claim
                </li>
                <li>
                  We have a high volume of claims that we weren’t expecting
                </li>
              </ul>
              <h2 className="claims-paragraph-header">
                When we don’t meet the estimated decision date:
              </h2>
              <p>
                The above reasons sometimes result in your claim needing
                additional time that exceeds the estimated completion date. We
                are working to process your claim as quickly as possible.
              </p>
              <h2 className="claims-paragraph-header">
                When we don’t give you an estimated decision date:
              </h2>
              <p>
                Sometimes we can’t estimate the decision date because we don’t
                have enough information. We can give you an estimated decision
                date after we have gathered all the information we need.
              </p>
            </div>
            <p>
              You can help speed up the process by promptly and electronically
              uploading the documents requested by VA.
            </p>
            <p>
              If you have questions, <CallVBACenter />
            </p>
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
    loading: claimsState.claimDetail.loading,
    claim: claimsState.claimDetail.detail,
  };
}

export default connect(mapStateToProps)(ClaimEstimationPage);
