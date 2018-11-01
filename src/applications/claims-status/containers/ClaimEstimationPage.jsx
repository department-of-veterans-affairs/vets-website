import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AskVAQuestions from '../components/AskVAQuestions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import { setUpPage } from '../utils/page';
import CallHelpDesk from '../../../platform/brand-consolidation/components/CallHelpDesk';

class ClaimEstimationPage extends React.Component {
  componentDidMount() {
    document.title = 'How We Come Up with Your Estimated Decision Date';
    setUpPage();
  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="medium-12 columns">
            <ClaimsBreadcrumbs>
              <Link to={`your-claims/${this.props.params.id}/status`}>
                Status Details
              </Link>
              <Link to={`your-claims/${this.props.params.id}/claim-estimate`}>
                Estimated Decision Date
              </Link>
            </ClaimsBreadcrumbs>
          </div>
        </div>
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            <div>
              <h1>How We Come Up with Your Estimated Decision Date</h1>
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
              If you have questions,{' '}
              <CallHelpDesk>
                call VA at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY:{' '}
                <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211;
                Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
              </CallHelpDesk>
            </p>
          </div>
          <div className="small-12 usa-width-one-third medium-4 columns help-sidebar">
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
