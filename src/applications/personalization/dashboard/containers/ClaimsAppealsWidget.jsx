import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';
import React from 'react';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import backendServices from 'platform/user/profile/constants/backendServices';
import {
  APPEAL_TYPES,
  claimsAvailability,
  appealsAvailability,
} from 'applications/claims-status/utils/appeals-v2-helpers';

import {
  getAppealsV2,
  getClaimsV2,
} from 'applications/claims-status/actions/index.jsx';

import AppealListItem from 'applications/claims-status/components/appeals-v2/AppealListItemV2';
import ClaimsUnavailable from 'applications/claims-status/components/ClaimsUnavailable';
import AppealsUnavailable from 'applications/claims-status/components/AppealsUnavailable';
import ClaimsAppealsUnavailable from 'applications/claims-status/components/ClaimsAppealsUnavailable';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import { recordDashboardClick } from '../helpers';
import ClaimsListItem from '../components/ClaimsListItem';

const appealTypes = Object.values(APPEAL_TYPES);

class ClaimsAppealsWidget extends React.Component {
  componentDidMount() {
    if (this.props.canAccessClaims) {
      this.props.getClaimsV2();
    }

    if (this.props.canAccessAppeals) {
      this.props.getAppealsV2();
    }
  }

  renderListItem(claim) {
    if (appealTypes.includes(claim.type)) {
      return (
        <AppealListItem
          key={claim.id}
          appeal={claim}
          name={this.props.fullName}
          external
        />
      );
    }

    return <ClaimsListItem claim={claim} key={claim.id} />;
  }

  renderErrorMessages() {
    const {
      claimsLoading,
      appealsLoading,
      appealsAvailable,
      canAccessAppeals,
      canAccessClaims,
      claimsAvailable,
    } = this.props;

    if (claimsLoading || appealsLoading) {
      return null;
    }

    if (canAccessAppeals && canAccessClaims) {
      if (
        claimsAvailable !== claimsAvailability.AVAILABLE &&
        appealsAvailable !== appealsAvailability.AVAILABLE
      ) {
        return <ClaimsAppealsUnavailable />;
      }
    }

    if (canAccessClaims && claimsAvailable !== claimsAvailability.AVAILABLE) {
      return <ClaimsUnavailable />;
    }

    if (
      canAccessAppeals &&
      appealsAvailable !== appealsAvailability.AVAILABLE
    ) {
      return <AppealsUnavailable />;
    }

    return null;
  }

  renderWidgetDowntimeNotification = appName => (downtime, children) => {
    if (downtime.status === 'down') {
      return (
        <div>
          <AlertBox
            content={
              <div>
                <h4 className="usa-alert-heading">
                  {appName} is down for maintenance
                </h4>
                <p>
                  We’re making some updates to our {appName.toLowerCase()} tool.
                  We’re sorry it’s not working right now and hope to be finished
                  by {downtime.startTime.format('MMMM Do')},{' '}
                  {downtime.endTime.format('LT')}. Please check back soon.
                </p>
              </div>
            }
            isVisible
            status="warning"
          />
        </div>
      );
    }
    return children;
  };

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
      content = (
        <LoadingIndicator message="Loading your claims and appeals..." />
      );
    } else if (!emptyList) {
      content = (
        <div>
          <div className="claim-list">
            {atLeastOneRequestLoading && (
              <LoadingIndicator message="Loading your claims and appeals..." />
            )}
            {claimsAppealsList.map(claim => this.renderListItem(claim))}
          </div>
        </div>
      );
    } else if (bothRequestsLoaded) {
      content = <p>We don’t have any new updates for you right now.</p>;
    }

    // hide section if no open/closed claims or appeals
    if (claimsAppealsCount === 0) {
      return null;
    }

    return (
      <div id="claims-widget">
        <h2>Track claims</h2>
        <div>
          <DowntimeNotification
            appTitle="claims"
            dependencies={[externalServices.mhv]}
            render={this.renderWidgetDowntimeNotification('Claims tracking')}
          >
            <div />
          </DowntimeNotification>
          <DowntimeNotification
            appTitle="appeals"
            dependencies={[externalServices.appeals]}
            render={this.renderWidgetDowntimeNotification('Appeals tracking')}
          >
            <div />
          </DowntimeNotification>
          {this.renderErrorMessages()}
          {content}
          <p>
            <Link
              href="/track-claims"
              onClick={recordDashboardClick('view-all-claims')}
            >
              View all your claims and appeals
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const claimsState = state.disability.status;
  const claimsRoot = claimsState.claims;
  const claimsV2Root = claimsState.claimsV2;
  const profileState = state.user.profile;
  const canAccessAppeals = profileState.services.includes(
    backendServices.APPEALS_STATUS,
  );
  const canAccessClaims = profileState.services.includes(
    backendServices.EVSS_CLAIMS,
  );

  const claimsAppealsCount = claimsV2Root.appeals.concat(claimsV2Root.claims)
    .length;

  const claimsAppealsList = claimsV2Root.appeals
    .concat(claimsV2Root.claims)
    .filter(c => {
      let updateDate;
      if (c.type === 'evss_claims') {
        const evssPhaseChangeDate = c.attributes.phaseChangeDate;
        const evssDateFiled = c.attributes.dateFiled;
        if (evssPhaseChangeDate && evssDateFiled) {
          updateDate = moment(evssPhaseChangeDate).isAfter(
            moment(evssDateFiled),
          )
            ? evssPhaseChangeDate
            : evssDateFiled;
        } else {
          updateDate = evssPhaseChangeDate || evssDateFiled;
        }
      } else {
        updateDate = c.attributes.updated;
      }

      return (
        updateDate &&
        moment(updateDate).isAfter(
          moment()
            .endOf('day')
            .subtract(30, 'days'),
        )
      );
    });

  return {
    appealsAvailable: claimsV2Root.v2Availability,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimsAppealsWidget);
export { ClaimsAppealsWidget };
