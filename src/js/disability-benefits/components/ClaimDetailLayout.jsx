import React from 'react';
import { Link } from 'react-router';
import TabNav from '../components/TabNav';
import AskVAQuestions from '../components/AskVAQuestions';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import AddingDetails from '../components/AddingDetails';
import Notification from '../components/Notification';
import { isPopulatedClaim, getClaimType } from '../utils/helpers';

const MAX_CONDITIONS = 3;

export default class ClaimDetailLayout extends React.Component {
  render() {
    const { claim, loading, message, clearNotification, currentTab } = this.props;

    let content;
    if (!loading) {
      content = (
        <div>
          <div className="row">
            <div className="medium-12 columns">
              <nav className="va-nav-breadcrumbs">
                <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
                  <li><Link to="your-claims">Your claims</Link></li>
                  <li className="active">Your Disability Compensation Claim</li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="row">
            <div className="medium-8 columns">
              <div className="claim-container">
                {message && <Notification title={message.title} body={message.body} type={message.type} onClose={clearNotification}/>}
                <h1 className="claim-title">Your {getClaimType(claim)} Claim</h1>
                <div className="claim-conditions">
                  <h6>Your Claimed Conditions:</h6>
                  <p className="list">
                    {claim.attributes.contentionList && claim.attributes.contentionList.length
                        ? claim.attributes.contentionList.slice(0, MAX_CONDITIONS).map(cond => cond.trim()).join(', ')
                      : 'Not available'}
                  </p>
                  {claim.attributes.contentionList && claim.attributes.contentionList.length > MAX_CONDITIONS
                      ? <span><br/><Link to={`your-claims/${claim.id}/details`}>See all your claimed conditions</Link>.</span>
                    : null}
                </div>
                <TabNav id={this.props.claim.id}/>
                <div className="va-tab-content db-tab-content" role="tabpanel" id={`tabPanel${currentTab}`} aria-labelledby={`tab${currentTab}`}>
                  {isPopulatedClaim(claim) || !claim.attributes.open ? null : <AddingDetails/>}
                  {this.props.children}
                </div>
              </div>
            </div>
            <div className="small-12 medium-4 columns">
              <AskVAQuestions/>
            </div>
          </div>
        </div>
      );
    } else {
      content = <LoadingIndicator setFocus message="Loading claim information"/>;
    }

    return (
      <div>
        <div name="topScrollElement"></div>
          {content}
      </div>
    );
  }
}

ClaimDetailLayout.propTypes = {
  claim: React.PropTypes.object,
  loading: React.PropTypes.bool,
  message: React.PropTypes.object,
  clearNotification: React.PropTypes.func
};
