import React from 'react';
import PropTypes from 'prop-types';
import { deriveEventLocations } from '../../helpers';

const WhereContent = ({ fieldLocation, fieldType, derivedLocations }) => {
  if (fieldType === 'online') return 'This is an online event.';
  return (
    <>
      <a href={fieldLocation?.entity?.entityUrl.path}>
        {fieldLocation?.entity?.title}
      </a>
      {derivedLocations?.length > 0 && (
        <div>
          {derivedLocations?.map(location => (
            <p className="vads-u-margin--0" key={location}>
              {location}
            </p>
          ))}
        </div>
      )}
    </>
  );
};

export const ResultsWhereContent = ({ event }) => {
  const fieldFacilityLocation = event?.fieldFacilityLocation;
  const fieldLocationType = event?.fieldLocationType;
  const locations = deriveEventLocations(event);
  if (
    fieldFacilityLocation === null &&
    fieldLocationType !== 'online' &&
    locations.length === 0
  )
    return <></>;

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-top--1">
      <p className="vads-u-margin--0 vads-u-margin-right--0p5">
        <strong>Where:</strong>
      </p>
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <p className="vads-u-margin--0">
          <WhereContent
            fieldLocation={fieldFacilityLocation}
            fieldType={fieldLocationType}
            derivedLocations={locations}
          />
        </p>
      </div>
    </div>
  );
};

ResultsWhereContent.propTypes = {
  event: PropTypes.object,
};

WhereContent.propTypes = {
  derivedLocations: PropTypes.object,
  fieldLocation: PropTypes.object,
  fieldType: PropTypes.object,
};

export default ResultsWhereContent;
