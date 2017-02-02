import React from 'react';
import { Link } from 'react-router';
import TabNav from '../components/TabNav';
import ClaimSyncWarning from '../components/ClaimSyncWarning';
import AskVAQuestions from '../components/AskVAQuestions';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import AddingDetails from '../components/AddingDetails';
import Notification from '../components/Notification';
import { isPopulatedClaim, getClaimType } from '../utils/helpers';

const MAX_CONTENTIONS = 3;

export default class ClaimDetailLayout extends React.Component {
  render() {
    const { claim, loading, message, clearNotification, currentTab, synced } = this.props;

    let content;
    if (!loading) {
      const claimsPath = `your-claims${claim.attributes.open ? '' : '/closed'}`;
      content = (
        <div>
          <div className="row">
            <div className="medium-12 columns">
              <nav className="va-nav-breadcrumbs">
                <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
                  <li><Link to={claimsPath}>Your claims</Link></li>
                  <li className="active">Your {getClaimType(claim)} Claim</li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="row">
            <div className="medium-12 columns">
              {message && <Notification title={message.title} body={message.body} type={message.type} onClose={clearNotification}/>}
              <h1 className="claim-title">Your {getClaimType(claim)} Claim</h1>
              {!synced && <ClaimSyncWarning olderVersion={!synced}/>}
            </div>
          </div>
          <div className="row">
            <div className="medium-8 columns">
              <div className="claim-container">
                <div className="claim-contentions">
                  <h6>What you've claimed:</h6>
                  <p className="list">
                    {claim.attributes.contentionList && claim.attributes.contentionList.length
                        ? claim.attributes.contentionList.slice(0, MAX_CONTENTIONS).map(cond => cond.trim()).join(', ')
                      : 'Not available'}
                  </p>
                  {claim.attributes.contentionList && claim.attributes.contentionList.length > MAX_CONTENTIONS
                      ? <span><br/><Link to={`your-claims/${claim.id}/details`}>See all your claimed contentions</Link>.</span>
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
  clearNotification: React.PropTypes.func,
  synced: React.PropTypes.bool
};
