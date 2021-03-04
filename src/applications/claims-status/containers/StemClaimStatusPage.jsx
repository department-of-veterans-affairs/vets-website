import React from 'react';
import { connect } from 'react-redux';
import StemClaimDetailLayout from '../components/StemClaimDetailLayout';
import { setUpPage } from '../utils/page';

class StemClaimStatusPage extends React.Component {
  componentDidMount() {
    this.setTitle();
    setUpPage();
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
    lastPage: claimsState.routing.lastPage,
    synced: claimsState.claimSync.synced,
    claim,
  };
}

export default connect(mapStateToProps)(StemClaimStatusPage);

export { StemClaimStatusPage };
