import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { VaCard } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import DlcTelephoneLink from './DlcTelephoneLink';
import { HEALTH_FACILITIES_URL } from '../constants';
import { formatDate, sortSupplies } from '../utils/helpers';

const SuppliesUnavailable = ({ supplies = [] }) => {
  const cards = sortSupplies(supplies).map((supply, index) => (
    <div key={`mhv-supply-unavailable-${index}`}>
      <VaCard
        class={classNames({
          'mhv-c-reorder-unavail-card': true,
          'vads-u-margin-bottom--1p5': index < supplies.length - 1,
        })}
      >
        <div>
          <strong>{supply.productName}</strong> <br />
          Device: {supply.deviceName} <br />
          Quantity: {supply.quantity} <br />
          Last ordered on {formatDate(supply.lastOrderDate)}
        </div>
        {supply.availableForReorder && (
          <p className="vads-u-margin-bottom--0">
            You can’t order this supply online until{' '}
            {formatDate(supply.nextAvailabilityDate)}. If you need this supply
            now call us at <DlcTelephoneLink />.
          </p>
        )}
        {!supply.availableForReorder && (
          <p className="vads-u-margin-bottom--0">
            This item is not available for reordering. To reorder, you can call{' '}
            <a href={HEALTH_FACILITIES_URL}>your VA healthcare team</a> or{' '}
            <a href="/my-health/secure-messages/new-message/">
              send them a message
            </a>
            .
          </p>
        )}
      </VaCard>
    </div>
  ));

  return (
    <>
      {supplies.length > 0 && (
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
