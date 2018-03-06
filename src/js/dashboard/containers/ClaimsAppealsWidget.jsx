import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '../../common/components/LoadingIndicator';
import {
  getAppealsV2,
  getClaimsV2,
} from '../../claims-status/actions/index.jsx';
import { APPEAL_V2_TYPE } from '../../claims-status/utils/appeals-v2-helpers';
import { scrollToTop, setUpPage } from '../../claims-status/utils/page';
import ClaimsListItem from '../../claims-status/components/ClaimsListItemV2';
import AppealListItem from '../../claims-status/components/appeals-v2/AppealListItemV2';

class ClaimsAppealsWidget extends React.Component {
  componentDidMount() {
    if (this.props.canAccessClaims) {
      this.props.getClaimsV2();
    }

    if (this.props.canAccessAppeals) {
      this.props.getAppealsV2();
    }

    if (this.props.claimsLoading && this.props.appealsLoading) {
      scrollToTop();
    } else {
      setUpPage();
    }
  }

  renderListItem(claim) {
    if (claim.type === APPEAL_V2_TYPE) {
      return <AppealListItem key={claim.id} appeal={claim} name={this.props.fullName}/>;
    }

    return <ClaimsListItem claim={claim} key={claim.id}/>;
  }

  render() {
    const {
      claimsAppealsList,
      claimsLoading,
      appealsLoading,
    } = this.props;

    let content;
    const bothRequestsLoaded = !claimsLoading && !appealsLoading;
    const bothRequestsLoading = claimsLoading && appealsLoading;
    const atLeastOneRequestLoading = claimsLoading || appealsLoading;
    const emptyList = !claimsAppealsList || !claimsAppealsList.length;


    if (bothRequestsLoading || (atLeastOneRequestLoading && emptyList)) {
      content = <LoadingIndicator message="Loading your claims and appeals..." setFocus/>;
    } else {
      if (!emptyList) {
        content = (<div>
          <div className="claim-list">
            {atLeastOneRequestLoading && <LoadingIndicator message="Loading your claims and appeals..."/>}
            {claimsAppealsList.map(claim => this.renderListItem(claim))}
          </div>
        </div>);
      } else if (!this.props.canAccessClaims && bothRequestsLoaded) {
        content = <p>No recent claims or appeals</p>;
      }
    }

    return (
      <div>
        <h2>Claims and appeals</h2>
        <div>
          {content}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const claimsState = state.disability.status;
  const claimsRoot = claimsState.claims;
  const claimsV2Root = claimsState.claimsV2; // this is where all the meat is for v2
  const profileState = state.user.profile;
  const canAccessAppeals = profileState.services.includes('appeals-status');
  const canAccessClaims = profileState.services.includes('evss-claims');

  const claimsAppealsList = claimsV2Root.appeals
    .concat(claimsV2Root.claims);

  return {
    appealsAvailable: claimsV2Root.appealsAvailability,
    claimsAvailable: claimsV2Root.claimsAvailability,
    claimsLoading: claimsV2Root.claimsLoading,
    appealsLoading: claimsV2Root.appealsLoading,
    claimsAppealsList,
    consolidatedModal: claimsRoot.consolidatedModal,
    show30DayNotice: claimsRoot.show30DayNotice,
    synced: claimsState.claimSync.synced,
    canAccessAppeals,
    canAccessClaims,
  };
};

const mapDispatchToProps = {
  getAppealsV2,
  getClaimsV2,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClaimsAppealsWidget);
export { ClaimsAppealsWidget };
