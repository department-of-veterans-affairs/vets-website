/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { loadPrescriptions } from '../actions/prescriptions';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { recordDashboardClick } from '../helpers';
import PrescriptionCard from '../components/PrescriptionCard';
import CallVBACenter from 'platform/static-data/CallVBACenter';
import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';

class PrescriptionsWidget extends React.Component {
  componentDidMount() {
    if (this.props.canAccessRx) {
      this.props.loadPrescriptions({
        active: true,
        sort: '-refill_submit_date',
      });
    }
  }

  render() {
    const { canAccessRx, authenticatedWithSSOe } = this.props;
    if (!canAccessRx) {
      return null;
    }
    let content;

    if (this.props.loading) {
      content = <LoadingIndicator message="Loading your prescriptions..." />;
    } else if (this.props.prescriptions) {
      content = this.props.prescriptions.map(p => (
        <PrescriptionCard key={p.id} prescription={p} />
      ));
    } else {
      content = (
        <p className="rx-tab-explainer rx-loading-error">
          We couldn’t retrieve your prescriptions. Please refresh this page or
          try again later. If you keep having trouble, please <CallVBACenter />
        </p>
      );
    }

    if (this.props.prescriptions && this.props.prescriptions.length === 0) {
      content = (
        <>
          <p>
            You don’t have any prescriptions being refilled. If you’ve refilled
            a prescription within the last 30 days, it may be out for delivery
            and not showing up here.
          </p>

          <p>
            To view and track all of your prescriptions, please go to
            MyHealtheVet.
          </p>
        </>
      );
    }

    return (
      <div id="rx-widget">
        <h3>Refill prescriptions</h3>
        <div>{content}</div>
        <p>
          <a
            href={mhvUrl(
              authenticatedWithSSOe,
              'web/myhealthevet/refill-prescriptions',
            )}
            onClick={recordDashboardClick('view-all-prescriptions')}
            rel="noopener noreferrer"
            target="_blank"
          >
            View all your prescriptions
          </a>
        </p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const rxState = state.health.rx;
  const profileState = state.user.profile;
  const canAccessRx = profileState.services.includes('rx');

  let prescriptions = rxState.prescriptions.items;

  if (prescriptions) {
    const thirtyDaysAgo = moment()
      .endOf('day')
      .subtract(30, 'days');
    const statuses = new Set(['refillinprocess', 'submitted']);

    prescriptions = prescriptions
      // Filter by status
      .filter(p => statuses.has(p.attributes.refillStatus))
      // Filter by date
      .filter(
        p =>
          moment(p.attributes.refillSubmitDate).isAfter(thirtyDaysAgo) ||
          moment(p.attributes.refillDate).isAfter(thirtyDaysAgo),
      );
  }

  return {
    ...rxState.prescriptions.active,
    prescriptions,
    canAccessRx,
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  };
};

const mapDispatchToProps = {
  loadPrescriptions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrescriptionsWidget);
export { PrescriptionsWidget };
