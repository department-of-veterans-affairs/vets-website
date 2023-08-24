import React from 'react';
import PropTypes from 'prop-types';
import { deriveEventLocations } from '../../helpers';

const WhereContent = ({
  event,
  fieldLocation,
  fieldType,
  derivedLocations,
}) => {
  if (fieldType === 'online') return 'This is an online event.';
  const locationAddress = derivedLocations.join(' ');
  return (
    <>
      <a href={fieldLocation?.entity?.entityUrl.path}>
        {fieldLocation?.entity?.title}
      </a>
      {derivedLocations?.length > 0 && (
        <div>
          <p className="vads-u-margin--0" key={location}>
            {event?.fieldLocationHumanreadable}
          </p>
          {derivedLocations?.map(location => (
            <p className="vads-u-margin--0" key={location}>
              {location}
            </p>
          ))}
        </div>
      )}
      <div className="vads-u-margin-bottom--1p5">
        <a
          href={`https://maps.google.com?saddr=Current+Location&daddr=${locationAddress}`}
          rel="noopener noreferrer"
        >
          Directions(Google Maps)
        </a>
      </div>
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
        <div className="vads-u-margin--0">
          <WhereContent
            event={event}
            fieldLocation={fieldFacilityLocation}
            fieldType={fieldLocationType}
            derivedLocations={locations}
          />
        </div>
      </div>
    </div>
  );
};

ResultsWhereContent.propTypes = {
  event: PropTypes.object,
};

WhereContent.propTypes = {
  derivedLocations: PropTypes.array,
  fieldLocation: PropTypes.object,
  fieldType: PropTypes.string,
};

export default ResultsWhereContent;
