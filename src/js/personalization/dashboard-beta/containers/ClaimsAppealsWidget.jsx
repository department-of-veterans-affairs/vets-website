import '../../../../sass/claims-status.scss';

import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';
import React from 'react';

import LoadingIndicator from '../../../common/components/LoadingIndicator';
import { APPEAL_V2_TYPE } from '../../../claims-status/utils/appeals-v2-helpers';
import {
  getAppealsV2,
  getClaimsV2,
} from '../../../claims-status/actions/index.jsx';
import { scrollToTop, setUpPage } from '../../../claims-status/utils/page';
import ClaimsListItem from '../components/ClaimsListItem';
import AppealListItem from '../components/AppealsListItemV2';

class ClaimsAppealsWidget extends React.Component {
  componentDidMount() {
    if (this.props.canAccessClaims) {
      // this.props.getClaimsV2();
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
      claimsAppealsCount,
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
      } else if (bothRequestsLoaded) {
        content = <p>No recent activity on your claims or appeals</p>;
      }
    }

    // hide section if no open/closed claims or appeals
    if (claimsAppealsCount === 0) {
      return null;
    }

    return (
      <div>
        <h2>Claims and appeals</h2>
        <div>
          {content}
          <p><Link href="/track-claims">View all claims and appeals</Link></p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const claimsState = state.disability.status;
  const claimsRoot = claimsState.claims;
  const claimsV2Root = claimsState.claimsV2;
  const profileState = state.user.profile;
  const canAccessAppeals = profileState.services.includes('appeals-status');
  const canAccessClaims = profileState.services.includes('evss-claims');

  const claimsAppealsCount = claimsV2Root.appeals
    .concat(claimsV2Root.claims).length;

  const claimsAppealsList = claimsV2Root.appeals
    .concat(claimsV2Root.claims).filter(c => {
      return moment(c.attributes.updated).isAfter(moment().endOf('day').subtract(30, 'days'));
    });

  return {
    appealsAvailable: claimsV2Root.appealsAvailability,
    claimsAvailable: claimsV2Root.claimsAvailability,
    claimsLoading: claimsV2Root.claimsLoading,
    appealsLoading: claimsV2Root.appealsLoading,
    claimsAppealsCount,
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
