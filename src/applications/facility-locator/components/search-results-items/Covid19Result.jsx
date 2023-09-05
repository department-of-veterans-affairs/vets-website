import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import { isVADomain } from '../../utils/helpers';
import { recordResultClickEvents } from '../../utils/analytics';
import { OperatingStatus } from '../../constants';
import LocationAddress from './common/LocationAddress';
import LocationOperationStatus from './common/LocationOperationStatus';
import LocationDistance from './common/LocationDistance';
import CovidPhoneLink from './common/Covid19PhoneLink';

const Covid19Result = ({
  location,
  index,
  showCovidVaccineWalkInAvailabilityText,
}) => {
  const {
    name,
    website,
    operatingStatus,
    detailedServices,
    phone,
  } = location.attributes;

  const appointmentPhone =
    detailedServices?.[0]?.appointmentPhones?.[0] || null;
  const infoURL = detailedServices?.[0]?.path || null;

  return (
    <div className="facility-result" id={location.id} key={location.id}>
      <>
        <LocationDistance
          distance={location.distance}
          markerText={location.markerText}
        />
        <span
          onClick={() => {
            recordResultClickEvents(location, index);
          }}
          onKeyPress={() => {
            recordResultClickEvents(location, index);
          }}
          role="link"
          tabIndex={0}
        >
          {isVADomain(website) ? (
            <h3 className="vads-u-font-size--h5 no-marg-top">
              <a href={website}>{name}</a>
            </h3>
          ) : (
            <h3 className="vads-u-font-size--h5 no-marg-top">
              <Link to={`facility/${location.id}`}>{name}</Link>
            </h3>
          )}
        </span>
        {operatingStatus &&
          operatingStatus.code !== OperatingStatus.NORMAL && (
            <LocationOperationStatus operatingStatus={operatingStatus} />
          )}
        <LocationAddress location={location} />
        <LocationDirectionsLink location={location} from="SearchResult" />
        {showCovidVaccineWalkInAvailabilityText && (
          <strong className="vads-u-margin-bottom--2 vads-u-display--block">
            Walk-ins accepted
          </strong>
        )}
        {appointmentPhone ? (
          <CovidPhoneLink
            phone={appointmentPhone}
            showCovidVaccineWalkInAvailabilityText={
              showCovidVaccineWalkInAvailabilityText
            }
            labelId={`${location.id}-phoneLabel`}
          />
        ) : (
          <div>
            <strong id={`${location.id}-phoneLabel`}>
              Main number :&nbsp;
            </strong>
            <va-telephone
              className="vads-u-margin-left--0p25"
              contact={phone.main}
            />
          </div>
        )}
        {infoURL && (
          <span className="vads-u-margin-top--2 vads-u-display--block">
            <a href={infoURL} target="_blank" rel="noreferrer">
              COVID-19 info at this location
            </a>
          </span>
        )}
      </>
    </div>
  );
};

Covid19Result.propTypes = {
  location: PropTypes.object,
  query: PropTypes.object,
  index: PropTypes.number,
  showCovidVaccineWalkInAvailabilityText: PropTypes.bool,
};

export default Covid19Result;
