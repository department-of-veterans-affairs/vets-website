import React from 'react';
import { connect } from 'react-redux';
import TabNav from '../components/TabNav';
import AskVAQuestions from '../components/AskVAQuestions';
import NeedFilesFromYou from '../components/NeedFilesFromYou';
import ClaimsDecision from '../components/ClaimsDecision';
import AskVAToDecide from '../components/AskVAToDecide';
import AddingDetails from '../components/AddingDetails';
import Loading from '../components/Loading';
import ClaimsTimeline from '../components/ClaimsTimeline';

import { getClaimDetail } from '../actions';

class StatusPage extends React.Component {
  componentDidMount() {
    this.props.getClaimDetail(this.props.params.id);
  }
  render() {
    const { claim, loading } = this.props;

    let content;
    if (!loading) {
      const phase = claim.attributes.phase;
      content = (
        <div className="claim-conditions">
          <h1>Your {"Compensation"} Claim</h1>
          <h6>Your Claimed Conditions:</h6>
          <p className="list">
            {claim.attributes.contentionList
              ? claim.attributes.contentionList.join(', ')
              : null}
          </p>
          <TabNav id={this.props.params.id}/>
          <div className="va-tab-content">
            {phase === null ? <AddingDetails/> : null}
            {claim.attributes.documentsNeeded && !claim.attributes.decisionLetterSent
              ? <NeedFilesFromYou events={claim.attributes.eventsTimeline}/>
              : null}
            <AskVAToDecide/>
            {claim.attributes.decisionLetterSent ? <ClaimsDecision/> : null}
            {phase !== null
              ? <ClaimsTimeline
                  id={claim.id}
                  estimatedDate={claim.attributes.maxEstDate}
                  phase={phase}
                  events={claim.attributes.eventsTimeline}/>
              : null}
          </div>
        </div>
      );
    } else {
      content = <Loading/>;
    }

    return (
      <div className="row">
        <div className="small-12 medium-8 columns usa-content">
          {content}
          <div name="topScrollElement"></div>
        </div>
        <AskVAQuestions/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.claimDetail.loading,
    claim: state.claimDetail.detail
  };
}

const mapDispatchToProps = {
  getClaimDetail
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusPage);

export { StatusPage };
