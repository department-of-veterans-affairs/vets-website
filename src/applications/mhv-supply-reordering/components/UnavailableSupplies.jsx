import React from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { getUnavailableSupplies } from '../utilities/mdot';

/**
 * Shows a list of unavailable supplies if it exists.
 * @param {*} mdotData the MDOT data for the user
 */
const UnavailableSupplies = ({ mdotData }) => {
  const unavailSupplies = getUnavailableSupplies(mdotData);
  const cards = unavailSupplies
    ?.sort((a, b) => a.productName.localeCompare(b.productName))
    .map((supply, index) => (
      <div
        key={`mhv-supply-unavail-${index}`}
        data-testid="mhv-supply-intro-unavail-card"
      >
        <va-card
          class={classNames({
            'mhv-c-reorder-unavail-card': true,
            'vads-u-margin-bottom--1p5': index < unavailSupplies.length - 1,
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
            <p>
              You can’t order this supply online until{' '}
              {format(new Date(supply.nextAvailabilityDate), 'MMMM d, yyyy')}.
              If you need this supply now call us at{' '}
              <va-telephone contact="3032736200">303-273-6200</va-telephone> (
              <va-telephone contact={CONTACTS['711']} tty />
              ).
            </p>
          )}
          {!supply.availableForReorder && (
            <p>
              This item is not available for reordering. To reorder, you can
              call <a href="/find-locations">your VA healthcare team</a> or{' '}
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
      {unavailSupplies?.length > 0 && (
        <div className="vads-u-margin-top--5">
          <h2 className="vads-u-margin-top--0">Unavailable for reorder</h2>
          <p>
            Showing {unavailSupplies.length} medical{' '}
            {unavailSupplies.length > 1
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

UnavailableSupplies.propTypes = {
  mdotData: PropTypes.object,
};

export default UnavailableSupplies;
