import React from 'react';
import { Link } from 'react-router';
import { orderBy } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { appealTypes } from '../utils/appeals-v2-helpers';
import { getClaimType } from '../utils/helpers';

// HELPERS
const isAppeal = claim => appealTypes.includes(claim.type);
const isBenefitsClaimOrAppeal = claim =>
  claim.type !== 'education_benefits_claims';

// START lighthouse_migration
const isEVSSClaim = claim => claim.type === 'evss_claims';
// END lighthouse_migration

const getRecentlyClosedClaims = claims => {
  return claims
    .filter(isBenefitsClaimOrAppeal)
    .filter(claim => {
      // Check if this is an appeal, if so we want to filter it out
      // if it was closed more than 60 days ago
      if (isAppeal(claim)) {
        const sixtyDaysAgo = moment()
          .add(-60, 'days')
          .startOf('day');
        const events = orderBy(
          claim.attributes.events,
          [e => moment(e.date).unix()],
          ['desc'],
        );
        const lastEvent = events[0];

        return (
          !claim.attributes.active &&
          moment(lastEvent.date)
            .startOf('day')
            .isAfter(sixtyDaysAgo)
        );
      }

      // START lighthouse_migration
      const { closeDate, open, phaseChangeDate } = claim.attributes;

      const isClosed = isEVSSClaim(claim) ? !open : Boolean(closeDate);
      const dateClosed = isEVSSClaim(claim) ? phaseChangeDate : closeDate;
      // END lighthouse_migration

      // If the claim is not an appeal, we want to filter it out
      // if it was closed more than 30 days ago
      return (
        isClosed &&
        moment(dateClosed || null)
          .startOf('day')
          .isAfter(
            moment()
              .add(-30, 'days')
              .startOf('day'),
          )
      );
    })
    .map(c => {
      if (isAppeal(c)) {
        const events = orderBy(
          c.attributes.events,
          [e => moment(e.date).unix()],
          ['desc'],
        );
        return {
          ...c,
          attributes: {
            ...c.attributes,
            claimDate: events[events.length - 1].date,
            closeDate: c.attributes.prior_decision_date || events[0].date,
          },
        };
      }

      return c;
    });
};

// START ligthouse_migration
const getCloseDate = claim => {
  const { closeDate, phaseChangeDate } = claim.attributes;

  return isEVSSClaim(claim) ? phaseChangeDate : closeDate;
};

const getClaimDate = claim => {
  const { claimDate, dateFiled } = claim.attributes;

  return isEVSSClaim(claim) ? dateFiled : claimDate;
};
// END lighthouse_migration

const formatDate = date => moment(date || null).format('MMMM D, YYYY');

const getLinkText = claim => {
  const claimType = isAppeal(claim)
    ? 'Compensation Appeal'
    : getClaimType(claim);
  return `Your ${claimType} Received ${formatDate(getClaimDate(claim))}`;
};

export default function ClosedClaimMessage({ claims, onClose }) {
  const closedClaims = getRecentlyClosedClaims(claims);

  if (!closedClaims.length) {
    return null;
  }

  return (
    <div
      className="usa-alert usa-alert-warning claims-alert claims-list-alert"
      role="alert"
    >
      <button
        className="va-alert-close notification-close"
        onClick={onClose}
        aria-label="Close notification"
        type="button"
      >
        <i
          className="fas fa-times-circle va-alert-close-icon"
          aria-hidden="true"
        />
      </button>
      <div className="usa-alert-body">
        <h4 className="usa-alert-heading">Recently closed:</h4>
        {closedClaims.map(claim => (
          <p className="usa-alert-text claims-closed-text" key={claim.id}>
            <Link
              to={
                isAppeal(claim)
                  ? `appeals/${claim.id}/status`
                  : `your-claims/${claim.id}/status`
              }
              onClick={() => {
                recordEvent({ event: 'claims-closed-alert-clicked' });
              }}
            >
              {getLinkText(claim)}
            </Link>{' '}
            has been closed as of {formatDate(getCloseDate(claim))}
          </p>
        ))}
      </div>
    </div>
  );
}

ClosedClaimMessage.propTypes = {
  claims: PropTypes.array,
  onClose: PropTypes.func,
};
