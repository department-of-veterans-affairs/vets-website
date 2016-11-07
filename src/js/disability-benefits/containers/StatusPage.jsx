import React from 'react';
import { connect } from 'react-redux';
import NeedFilesFromYou from '../components/NeedFilesFromYou';
import ClaimsDecision from '../components/ClaimsDecision';
import AskVAToDecide from '../components/AskVAToDecide';
import ClaimsTimeline from '../components/ClaimsTimeline';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import { setUpPage, isTab, scrollToTop, setFocus } from '../utils/page';

import { clearNotification } from '../actions';

const FIRST_GATHERING_EVIDENCE_PHASE = 3;

class StatusPage extends React.Component {
  componentDidMount() {
    document.title = 'Status - Your Disability Compensation Claim';
    if (!isTab(this.props.lastPage)) {
      if (!this.props.loading) {
        setUpPage();
      } else {
        scrollToTop();
      }
    } else {
      setFocus('.va-tab-trigger--current');
    }
  }
  componentDidUpdate(prevProps) {
    if (!this.props.loading && prevProps.loading && !isTab(this.props.lastPage)) {
      setUpPage(false);
    }
  }
  componentWillUnmount() {
    this.props.clearNotification();
  }
  render() {
    const { claim, loading, message } = this.props;

    let content = null;
    if (!loading) {
      const phase = claim.attributes.phase;
      const showDecision = phase === FIRST_GATHERING_EVIDENCE_PHASE
        && !claim.attributes.waiverSubmitted;

      content = (
        <div>
          {claim.attributes.documentsNeeded && !claim.attributes.decisionLetterSent
            ? <NeedFilesFromYou claimId={claim.id} events={claim.attributes.eventsTimeline}/>
            : null}
          {showDecision
            ? <AskVAToDecide id={this.props.params.id}/>
            : null}
          {claim.attributes.decisionLetterSent ? <ClaimsDecision/> : null}
          {phase !== null
            ? <ClaimsTimeline
                id={claim.id}
                estimatedDate={claim.attributes.maxEstDate}
                phase={phase}
                events={claim.attributes.eventsTimeline}/>
            : null}
        </div>
      );
    }

    return (
      <ClaimDetailLayout
          claim={claim}
          loading={loading}
          clearNotification={this.props.clearNotification}
          message={message}>
        {content}
      </ClaimDetailLayout>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.claimDetail.loading,
    claim: state.claimDetail.detail,
    message: state.notifications.message,
    lastPage: state.routing.lastPage
  };
}

const mapDispatchToProps = {
  clearNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusPage);

export { StatusPage };

