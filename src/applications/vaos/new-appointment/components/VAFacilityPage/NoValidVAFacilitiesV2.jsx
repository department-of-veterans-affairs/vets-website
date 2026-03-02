import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import FacilityPhone from '../../../components/FacilityPhone';
import InfoAlert from '../../../components/InfoAlert';
import NewTabAnchor from '../../../components/NewTabAnchor';
import State from '../../../components/State';
import { lowerCase } from '../../../utils/formatters';
import { selectFeatureUseVpg } from '../../../redux/selectors';

export default function NoValidVAFacilities({
  facilities,
  sortMethod,
  typeOfCare,
  address,
}) {
  // We're showing the two closest facilities if we have an address to sort by,
  // otherwise we're showing the first 5 facilities in alpha order
  const facilityLimit = address?.addressLine1 ? 2 : 5;
  const featureUseVpg = useSelector(selectFeatureUseVpg);
  const unsupportedFacilities = facilities
    ?.filter(
      facility =>
        featureUseVpg
          ? !facility.legacyVAR.settings[typeOfCare.id]?.bookedAppointments &&
            !facility.legacyVAR.settings[typeOfCare.id]?.apptRequests
          : !facility.legacyVAR.settings[typeOfCare.id]?.direct.enabled &&
            !facility.legacyVAR.settings[typeOfCare.id]?.request.enabled,
    )
    ?.slice(0, facilityLimit);

  return (
    <div aria-atomic="true" aria-live="assertive">
      <InfoAlert
        status="warning"
        headline="You can’t schedule this appointment online"
        level="2"
      >
        <>
          <p>
            None of your VA facilities have online scheduling for{' '}
            {lowerCase(typeOfCare?.name)}.
          </p>
          <p id="what_you_can_do">You’ll need to call to schedule.</p>
          <ul
            className="usa-unstyled-list vads-u-margin-top--2"
            aria-labelledby="what_you_can_do"
          >
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            {unsupportedFacilities.map(facility => (
              <li key={facility.id} className="vads-u-margin-bottom--2">
                <strong>{facility.name}</strong>
                <br />
                {facility.address?.city},{' '}
                <State state={facility.address?.state} />
                <br />
                {!!facility.legacyVAR[sortMethod] && (
                  <>
                    {facility.legacyVAR[sortMethod]} miles
                    <br />
                  </>
                )}
                <FacilityPhone
                  contact={
                    facility.telecom.find(t => t.system === 'phone')?.value
                  }
                  className="vads-u-font-weight--normal"
                  level={3}
                />
              </li>
            ))}
          </ul>
          <p>
            Or you can find a different VA facility.
            <br />
            <NewTabAnchor href="/find-locations">
              Find a VA health facility
            </NewTabAnchor>
          </p>
        </>
      </InfoAlert>
    </div>
  );
}
NoValidVAFacilities.propTypes = {
  address: PropTypes.object,
  facilities: PropTypes.array,
  sortMethod: PropTypes.string,
  typeOfCare: PropTypes.object,
};
