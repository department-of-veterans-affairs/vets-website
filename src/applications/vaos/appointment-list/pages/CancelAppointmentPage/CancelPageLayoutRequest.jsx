import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import classNames from 'classnames';
import { useSelector, shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Address from '../../../components/Address';
import FacilityPhone from '../../../components/FacilityPhone';
import {
  CCDetails,
  Details,
} from '../../../components/layouts/DetailPageLayout';
import NewTabAnchor from '../../../components/NewTabAnchor';
import Section from '../../../components/Section';
import { getRealFacilityId } from '../../../utils/appointment';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import ListBestTimeToCall from '../../components/ListBestTimeToCall';
import { selectRequestedAppointmentDetails } from '../../redux/selectors';

export default function CancelPageLayoutRequest() {
  const { id } = useParams();
  const {
    appointment,
    email,
    facility,
    facilityId,
    facilityPhone,
    isCC,
    phone,
    preferredDates,
    preferredLanguage,
    preferredTimesForPhoneCall,
    provider: preferredProvider,
    providerAddress,
    typeOfCareName,
    preferredModality,
    status,
  } = useSelector(
    state => selectRequestedAppointmentDetails(state, id),
    shallowEqual,
  );

  const { patientComments } = appointment || {};
  const { providerName } = preferredProvider || {};

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
        {`Request for ${isCC ? 'community care appointment' : 'appointment'}`}
      </h2>
      <Section heading="Preferred date and time" level={3}>
        <ul
          className={classNames({
            'usa-unstyled-list': preferredDates.length === 1,
          })}
        >
          {preferredDates.map((date, index) => (
            <li key={`${id}-option-${index}`}>{date}</li>
          ))}
        </ul>
      </Section>
      <Section heading="Type of care" level={3}>
        {typeOfCareName || 'Type of care not noted'}
      </Section>
      {isCC && (
        <>
          <Section heading="Scheduling facility" level={3}>
            {APPOINTMENT_STATUS.cancelled !== status && (
              <span>
                This facility will contact you if we need more information about
                your request.
                <br />
                <br />
              </span>
            )}
            {facility?.name}
          </Section>
          <Section heading="Preferred community care provider" level={3}>
            <span dd-data-privacy="mask">
              {`${providerName || 'Provider name not available'}`}
            </span>
            <br />
            {providerAddress && (
              <span dd-data-privacy="mask">{providerAddress.line[0]}</span>
            )}
            {!providerAddress && <span>Address not available</span>}
            <br />
          </Section>
          <Section heading="Language you’d prefer the provider speak" level={3}>
            {preferredLanguage}
          </Section>
          <CCDetails otherDetails={patientComments} request level={3} />
        </>
      )}
      {!isCC && (
        <>
          <Section heading="How you prefer to attend" level={3}>
            <span>{preferredModality}</span>
          </Section>
          <Section heading="Facility" level={3}>
            {/* When the services return a null value for the facility (no facility ID) for all appointment types */}
            {!facility &&
              !facilityId && (
                <>
                  <span>Facility details not available</span>
                  <br />
                  <NewTabAnchor href="/find-locations">
                    Find facility information
                  </NewTabAnchor>
                  <br />
                </>
              )}
            {/* When the services return a null value for the facility (but receive the facility ID) */}
            {!facility &&
              !!facilityId && (
                <>
                  <span>Facility details not available</span>
                  <br />
                  <NewTabAnchor
                    href={`/find-locations/facility/vha_${getRealFacilityId(
                      facilityId,
                    )}`}
                  >
                    View facility information
                  </NewTabAnchor>
                  <br />
                </>
              )}
            {!!facility && (
              <>
                {facility?.name}
                <br />
                <Address address={facility?.address} />
              </>
            )}
          </Section>
          <Section heading="Phone" level={3}>
            {facilityPhone && (
              <FacilityPhone heading="Phone:" contact={facilityPhone} icon />
            )}
            {!facilityPhone && <>Not available</>}
          </Section>
          <Details otherDetails={patientComments} request level={3} />
        </>
      )}
      <Section heading="Your contact details" level={3}>
        <span data-dd-privacy="mask">Email: {email}</span>
        <br />
        <span>Phone number: </span>
        <VaTelephone
          data-dd-privacy="mask"
          notClickable
          contact={phone}
          data-testid="patient-telephone"
        />
        <br />
        {isCC && (
          <ListBestTimeToCall timesToCall={preferredTimesForPhoneCall} />
        )}
      </Section>
    </>
  );
}
