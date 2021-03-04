import React from 'react';
import { connect } from 'react-redux';
import StemClaimDetailLayout from '../components/StemClaimDetailLayout';
import { setUpPage, isTab, scrollToTop, setFocus } from '../utils/page';

class StemClaimStatusPage extends React.Component {
  componentDidMount() {
    this.setTitle();

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
    if (
      !this.props.loading &&
      prevProps.loading &&
      !isTab(this.props.lastPage)
    ) {
      setUpPage(false);
    }
    if (this.props.loading !== prevProps.loading) {
      this.setTitle();
    }
  }
  componentWillUnmount() {
    this.props.clearNotification();
  }
  setTitle() {
    document.title =
      'Status - Your Your Edith Nourse Rogers STEM Scholarship Application Claim';
  }

  render() {
    const { claim, loading } = this.props;

    return (
      <StemClaimDetailLayout
        id={this.props.params.id}
        claim={claim}
        loading={loading}
        // stemClaim={claim}
      />
    );
  }
}

function mapStateToProps(state, props) {
  const claimsState = state.disability.status;
  const claim = claimsState.claimsV2.stemClaims.filter(
    stemClaim => stemClaim.id === props.params.id,
  )[0];
  return {
    loading: claimsState.claimsV2.stemClaimsLoading,
    // claim: claimsState.claimDetail.detail,
    lastPage: claimsState.routing.lastPage,
    synced: claimsState.claimSync.synced,
    claim,
    // stemClaims: claimsState.claimsV2.stemClaims,
  };
}

export default connect(mapStateToProps)(StemClaimStatusPage);

export { StemClaimStatusPage };
