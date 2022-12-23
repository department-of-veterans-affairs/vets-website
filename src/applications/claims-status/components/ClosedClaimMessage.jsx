import React from 'react';
import { Link } from 'react-router';
import { orderBy } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { appealTypes } from '../utils/appeals-v2-helpers';
import { getClaimType } from '../utils/helpers';

const getClosedClaims = claims => {
  return claims
    .filter(claim => {
      if (claim.type === 'education_benefits_claims') {
        return false;
      }

      // Check if this is an appeal, if so we want to filter it out
      // if it was closed more than 60 days ago
      if (appealTypes.includes(claim.type)) {
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
      const isClosed = claim.attributes
        ? !claim.attributes.open
        : Boolean(claim.closeDate);
      const closeDate = claim.attributes
        ? claim.attributes.phaseChangeDate
        : claim.closeDate;
      // END lighthouse_migration

      // If the claim is not an appeal, we want to filter it out
      // if it was closed more than 30 days ago
      return (
        isClosed &&
        moment(closeDate)
          .startOf('day')
          .isAfter(
            moment()
              .add(-30, 'days')
              .startOf('day'),
          )
      );
    })
    .map(c => {
      if (appealTypes.includes(c.type)) {
        const events = orderBy(
          c.attributes.events,
          [e => moment(e.date).unix()],
          ['desc'],
        );
        return {
          ...c,
          attributes: {
            ...c.attributes,
            dateFiled: events[events.length - 1].date,
            phaseChangeDate: c.attributes.prior_decision_date || events[0].date,
          },
        };
      }

      return c;
    });
};

const getClaimCloseDate = claim =>
  claim.attributes ? claim.attributes.phaseChangeDate : claim.closeDate;

const getClaimFileDate = claim =>
  claim.attributes ? claim.attributes.dateFiled : claim.claimDate;

const formatDate = date => moment(date).format('MMMM D, YYYY');

export default function ClosedClaimMessage({ claims, onClose }) {
  const closedClaims = getClosedClaims(claims);

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
          <p
            className="usa-alert-text claims-closed-text"
            key={claim.id || claim.claimId}
          >
            <Link
              to={
                appealTypes.includes(claim.type)
                  ? `appeals/${claim.id}/status`
                  : `your-claims/${claim.id}/status`
              }
              onClick={() => {
                recordEvent({ event: 'claims-closed-alert-clicked' });
              }}
            >
              Your{' '}
              {appealTypes.includes(claim.type)
                ? 'Compensation Appeal'
                : getClaimType(claim)}{' '}
              – Received {formatDate(getClaimFileDate(claim))}
            </Link>{' '}
            has been closed as of {formatDate(getClaimCloseDate(claim))}
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
