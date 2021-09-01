import React, { useState } from 'react';
import {
  isVideoHome,
  getCalendarData,
  isClinicVideoAppointment,
} from '../../../services/appointment';
import VideoLink from './VideoLink';
import AtlasLocation from './AtlasLocation';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import FacilityPhone from 'applications/vaos/components/FacilityPhone';
import VideoVisitProvider from './VideoVisitProvider';
import { VideoVisitInstructions } from './VideoInstructions';
import AddToCalendar from 'applications/vaos/components/AddToCalendar';
import InfoAlert from '../../../components/InfoAlert';
import moment from 'applications/vaos/lib/moment-tz';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import { getFacilityPhone } from '../../../services/location';

export default function VideoVisitLocation({ appointment, facility }) {
  const { isAtlas, providers } = appointment.videoData;
  const isHome = isVideoHome(appointment);
  const [showMoreOpen, setShowMoreOpen] = useState(false);
  const name = facility?.name;
  const facilityPhone = getFacilityPhone(facility);

  const {
    summary,
    providerName,
    location,
    text,
    phone,
    additionalText,
  } = getCalendarData({
    facility,
    appointment,
  });

  const showVideoInstructions =
    !!appointment.comment &&
    (isHome || isAtlas) &&
    !appointment.vaos.isPastAppointment;

  return (
    <>
      <VideoLink
        appointment={appointment}
        hasFacility={!!facility}
        isPast={appointment.vaos.isPastAppointment}
      />
      {isAtlas && (
        <div className="vads-u-margin-top--2">
          <AtlasLocation
            appointment={appointment}
            isPast={appointment.vaos.isPastAppointment}
          />
        </div>
      )}
      {isClinicVideoAppointment(appointment) && (
        <div className="vads-u-margin-top--2">
          <VAFacilityLocation
            facility={facility}
            facilityId={appointment.location.stationId}
            clinicFriendlyName={appointment.location.clinicName}
          />
        </div>
      )}
      {providers?.length > 0 && (
        <div className="vads-u-margin-top--2">
          <VideoVisitProvider
            providers={providers}
            isPast={appointment.vaos.isPastAppointment}
          />
        </div>
      )}
      {showVideoInstructions && (
        <div className="vads-u-margin-top--2">
          <AdditionalInfo
            onClick={() => setShowMoreOpen(!showMoreOpen)}
            triggerText="Prepare for video visit"
          >
            <VideoVisitInstructions instructionsType={appointment.comment} />
          </AdditionalInfo>
        </div>
      )}
      {!appointment.vaos.isPastAppointment && (
        <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
          <i
            aria-hidden="true"
            className="far fa-calendar vads-u-margin-right--1"
          />
          <AddToCalendar
            summary={summary}
            description={{
              text,
              providerName,
              phone,
              additionalText,
            }}
            location={location}
            duration={appointment.minutesDuration}
            startDateTime={moment.parseZone(appointment.start)}
          />
        </div>
      )}
      <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
        <i aria-hidden="true" className="fas fa-print vads-u-margin-right--1" />
        <button className="va-button-link" onClick={() => window.print()}>
          Print
        </button>
      </div>
      {!appointment.vaos.isPastAppointment && (
        <InfoAlert
          status="info"
          className="vads-u-display--block"
          headline="Need to make changes?"
          backgroundOnly
        >
          {!facility &&
            'To reschedule or cancel this appointment, contact the VA facility where you scheduled it.'}
          {!!facility &&
            'Contact this facility if you need to reschedule or cancel your appointment.'}
          <br />
          {!!facility && (
            <span className="vads-u-display--block vads-u-margin-top--2">
              {name}
              {facilityPhone && (
                <>
                  <br />
                  <FacilityPhone contact={facilityPhone} level={3} />
                </>
              )}
            </span>
          )}
        </InfoAlert>
      )}
    </>
  );
}
