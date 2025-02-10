import React from 'react';
import PropTypes from 'prop-types';

function BurialStatus({ facility }) {
  const statusMappings = {
    BURIALS_OPEN: {
      statusTitle: 'Burials open',
      statusDescription: 'Burial space is available',
    },
    BURIALS_CREMATION_ONLY: {
      statusTitle: 'Cremation only',
      statusDescription: 'Cremation interments only',
    },
    BURIALS_CLOSED: {
      statusTitle: 'Closed',
      statusDescription: 'Call for burial status',
    },
    BURIALS_UNDER_CONSTRUCTION: {
      statusTitle: 'Under construction',
      statusDescription: 'Cemetery is under construction.',
    },
    default: {
      statusTitle: 'Call for burial status',
      statusDescription: null,
    },
  };
  const facilityBurialStatus =
    facility.attributes.operatingStatus?.supplementalStatus?.[0]?.id;
  const { statusTitle, statusDescription } =
    statusMappings[facilityBurialStatus] || statusMappings.default;

  return (
    <div>
      <h2 className="vads-u-font-size--h3">Burial space</h2>
      <div>
        <p>
          <strong>{statusTitle}</strong>
        </p>
        {statusDescription && <p>{statusDescription}</p>}
      </div>
    </div>
  );
}

BurialStatus.propTypes = {
  facility: PropTypes.object.isRequired,
};

export default BurialStatus;
