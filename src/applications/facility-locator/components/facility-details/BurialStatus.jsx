import React from 'react';
import PropTypes from 'prop-types';
import { BurialStatusDisplay } from '../../constants';

function BurialStatus({ facility }) {
  const facilityBurialStatus =
    facility.attributes.operatingStatus?.supplementalStatus?.[0]?.id;
  const underConstruction =
    facilityBurialStatus === 'BURIALS_UNDER_CONSTRUCTION';
  const { statusTitle, statusDescription, descriptionDetails } =
    BurialStatusDisplay[facilityBurialStatus] || BurialStatusDisplay.DEFAULT;
  const linkOrMemorialDescription = underConstruction ? (
    <va-link
      text="Find a VA national cemetery"
      label="Find a VA national cemetery"
      href="/find-locations?facilityType=cemetery"
    />
  ) : (
    <p>
      This cemetery may also have a memorial section or a memorial wall.
      Memorial areas honor decedents whose remains are not recoverable and are
      not available for burial. (Examples include remains that are donated to
      science or cremated remains scattered at sea). Please contact the cemetery
      for more information.
    </p>
  );

  return (
    <div className="vads-u-padding-bottom--1">
      <h2>Burial space</h2>
      <div>
        <p>
          <strong>{statusTitle}</strong>
        </p>
        {statusDescription && <p>{statusDescription}</p>}
        {descriptionDetails && descriptionDetails.length > 0 && (
          <ul className="va-list--disc">
            {descriptionDetails.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        )}
        {linkOrMemorialDescription}
      </div>
    </div>
  );
}

BurialStatus.propTypes = {
  facility: PropTypes.object.isRequired,
};

export default BurialStatus;
