import React from 'react';
import { Link } from 'react-router';
import TabNav from '../components/TabNav';
import AskVAQuestions from '../components/AskVAQuestions';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import AddingDetails from '../components/AddingDetails';

import { isCompleteClaim } from '../utils/helpers';

export default class ClaimDetailLayout extends React.Component {
  render() {
    const { claim, loading, message } = this.props;

    let content;
    if (!loading) {
      content = (
        <div className="claim-container">
          <nav className="va-nav-breadcrumbs">
            <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
              <li><Link to="your-claims">Your claims</Link></li>
              <li className="active">Your Disability Compensation Claim</li>
            </ul>
          </nav>
          {message}
          <h1 className="claim-title">Your Disability Compensation Claim</h1>
          <div className="claim-conditions">
            <h6>Your Claimed Conditions:</h6>
            <p className="list">
              {claim.attributes.contentionList
                ? claim.attributes.contentionList.join(', ')
                : null}
            </p>
          </div>
          <TabNav id={this.props.claim.id}/>
          <div className="va-tab-content">
            {isCompleteClaim(claim) ? null : <AddingDetails/>}
            {this.props.children}
          </div>
        </div>
      );
    } else {
      content = <LoadingIndicator/>;
    }

    return (
      <div className="row">
        <div className="small-12 medium-8 columns usa-content">
          <div name="topScrollElement"></div>
          {content}
        </div>
        <div className="small-12 medium-4 columns">
          <AskVAQuestions/>
        </div>
      </div>
    );
  }
}

ClaimDetailLayout.propTypes = {
  claim: React.PropTypes.object,
  loading: React.PropTypes.bool,
  message: React.PropTypes.node
};

