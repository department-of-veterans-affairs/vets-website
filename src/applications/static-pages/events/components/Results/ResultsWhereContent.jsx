import React from 'react';
import PropTypes from 'prop-types';

export const ResultsWhereContent = ({
  fieldFacilityLocation,
  fieldLocationType,
  locations,
}) => {
  function whereContent() {
    if (fieldLocationType === 'online') return 'This is an online event.';
    return (
      <>
        <a href={fieldFacilityLocation?.entity?.entityUrl.path}>
          {fieldFacilityLocation?.entity?.title}
        </a>
        {locations?.length > 0 && (
          <div>
            {locations?.map(location => (
              <p className="vads-u-margin--0" key={location}>
                {location}
              </p>
            ))}
          </div>
        )}
      </>
    );
  }

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
        <p className="vads-u-margin--0">{whereContent()}</p>
      </div>
    </div>
  );
};

ResultsWhereContent.propTypes = {
  fieldFacilityLocation: PropTypes.object,
  fieldLocationType: PropTypes.string,
  locations: PropTypes.array,
};

export default ResultsWhereContent;
