import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

export default function ProviderCard({ provider }) {
  const { lastSeen, providerName, hasAvailability } = provider;
  return (
    <div>
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--2">
        {providerName}
      </h2>
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
        Your last appointment was on {format(new Date(lastSeen), 'M/d/yyyy')}
      </p>

      {!hasAvailability && (
        <va-additional-info
          data-testid="no-appointments-available"
          trigger="Why you can't schedule online with this provider"
        >
          This provider has no appointments available for online scheduling.
        </va-additional-info>
      )}

      {hasAvailability && (
        <va-link
          active
          data-testid="choose-date-time"
          href="#"
          text="Choose your preferred date and time"
        />
      )}

      <hr
        aria-hidden="true"
        className="vads-u-margin-bottom--2 vads-u-margin-top--2"
      />
    </div>
  );
}

ProviderCard.propTypes = {
  provider: PropTypes.object,
};
