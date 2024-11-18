import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import classNames from 'classnames';
import DlcTelephoneLink from './DlcTelephoneLink';
import { HEALTH_FACILITIES_URL } from '../constants';

const SuppliesUnavailable = ({ supplies }) => {
  const cards = supplies
    ?.sort((a, b) => a.productName.localeCompare(b.productName))
    .map((supply, index) => (
      <div
        key={`mhv-supply-unavail-${index}`}
        data-testid="mhv-supply-intro-unavail-card"
      >
        <va-card
          class={classNames({
            'mhv-c-reorder-unavail-card': true,
            'vads-u-margin-bottom--1p5': index < supplies.length - 1,
          })}
        >
          <div>
            <strong>{supply.productGroup}</strong> <br />
            Device: {supply.productName} <br />
            Quantity: {supply.quantity} <br />
            Last ordered on{' '}
            {format(new Date(supply.lastOrderDate), 'MMMM d, yyyy')}
          </div>
          {supply.availableForReorder && (
            <p className="vads-u-margin-bottom--0">
              You can’t order this supply online until{' '}
              {format(new Date(supply.nextAvailabilityDate), 'MMMM d, yyyy')}.
              If you need this supply now call us at <DlcTelephoneLink />.
            </p>
          )}
          {!supply.availableForReorder && (
            <p className="vads-u-margin-bottom--0">
              This item is not available for reordering. To reorder, you can
              call <a href={HEALTH_FACILITIES_URL}>your VA healthcare team</a>{' '}
              or{' '}
              <a href="/my-health/secure-messages/new-message/">
                send them a message
              </a>
              .
            </p>
          )}
        </va-card>
      </div>
    ));

  return (
    <>
      {supplies?.length > 0 && (
        <div className="vads-u-margin-y--5">
          <h2 className="vads-u-margin-top--0">Unavailable for reorder</h2>
          <p>
            Showing {supplies.length} medical{' '}
            {supplies.length > 1
              ? 'supplies, alphabetically by name'
              : 'supply'}
          </p>
          <hr className="vads-u-margin-top--0 vads-u-margin-bottom--2" />
          {cards}
        </div>
      )}
    </>
  );
};

SuppliesUnavailable.propTypes = {
  supplies: PropTypes.array.isRequired,
};

export default SuppliesUnavailable;
