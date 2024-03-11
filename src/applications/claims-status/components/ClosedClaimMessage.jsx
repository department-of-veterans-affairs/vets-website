import React from 'react';
import { Link } from 'react-router';
import { getUnixTime, isAfter, parseISO, startOfDay, subDays } from 'date-fns';
import { orderBy } from 'lodash';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';

import { DATE_FORMATS } from '../constants';
import { appealTypes } from '../utils/appeals-v2-helpers';
import {
  buildDateFormatter,
  getClaimType,
  isClaimOpen,
} from '../utils/helpers';

// HELPERS
const isAppeal = claim => appealTypes.includes(claim.type);
const isBenefitsClaimOrAppeal = claim =>
  claim.type !== 'education_benefits_claims';

const getRecentlyClosedClaims = claims => {
  return claims
    .filter(isBenefitsClaimOrAppeal)
    .filter(claim => {
      // Check if this is an appeal, if so we want to filter it out
      // if it was closed more than 60 days ago
      if (isAppeal(claim)) {
        const sixtyDaysAgo = startOfDay(subDays(new Date(), 60));
        const events = orderBy(
          claim.attributes.events,
          [e => getUnixTime(parseISO(e.date))],
          ['desc'],
        );
        const lastEvent = events[0];
        const lastEventDate = startOfDay(parseISO(lastEvent.date));

        return !claim.attributes.active && isAfter(lastEventDate, sixtyDaysAgo);
      }

      const { closeDate, status } = claim.attributes;

      const isClosed = !isClaimOpen(status, closeDate);

      // If the claim is not an appeal, we want to filter it out
      // if it was closed more than 30 days ago
      const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));
      const startOfCloseDate = startOfDay(parseISO(closeDate));

      return isClosed && isAfter(startOfCloseDate, thirtyDaysAgo);
    })
    .map(c => {
      if (isAppeal(c)) {
        const events = orderBy(
          c.attributes.events,
          [e => getUnixTime(parseISO(e.date))],
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

const formatDate = buildDateFormatter(DATE_FORMATS.LONG_DATE);

const getLinkText = claim => {
  const claimType = isAppeal(claim)
    ? 'Compensation Appeal'
    : getClaimType(claim).toLowerCase();
  return `Your ${claimType} Received ${formatDate(claim.attributes.claimDate)}`;
};

export default function ClosedClaimMessage({ claims, onClose }) {
  const closedClaims = getRecentlyClosedClaims(claims);

  return (
    closedClaims.length !== 0 && (
      <VaAlert
        class="vads-u-margin-bottom--2"
        status="warning"
        closeable
        onCloseEvent={onClose}
        uswds="false"
      >
        <h4 slot="headline">Recently closed:</h4>
        <div>
          {closedClaims.map(claim => (
            <p key={claim.id}>
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
              has been closed as of {formatDate(claim.attributes.closeDate)}
            </p>
          ))}
        </div>
      </VaAlert>
    )
  );
}

ClosedClaimMessage.propTypes = {
  claims: PropTypes.array,
  onClose: PropTypes.func,
};
