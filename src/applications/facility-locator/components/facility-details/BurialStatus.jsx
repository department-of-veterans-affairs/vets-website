import React from 'react';
import PropTypes from 'prop-types';
import { BurialStatusDisplay } from '../../constants';

function BurialStatus({ facility }) {
  const facilityBurialStatus =
    facility.attributes.operatingStatus?.supplementalStatus?.[0]?.id;
  const { statusTitle, statusDescription } =
    BurialStatusDisplay[facilityBurialStatus] || BurialStatusDisplay.default;

  return (
    <div>
      <h2 className="vads-u-font-size--h3">Burial space</h2>
      <div>
        <p>
          <strong>{statusTitle}</strong>
        </p>
        {statusDescription && <p>{statusDescription}</p>}
        <p>
          This cemetery may have a memorial section or a memorial wall. Memorial
          areas honor decedents whose remains are not recoverable and are not
          available for burial. (Examples include remains that are donated to
          science or cremated remains scattered at sea). Please contact the
          cemetery for more information.
        </p>
      </div>
    </div>
  );
}

BurialStatus.propTypes = {
  facility: PropTypes.object.isRequired,
};

export default BurialStatus;
