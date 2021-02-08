import React, { useState } from 'react';
import {
  getVideoKind,
  isAtlasLocation,
  getVAAppointmentLocationId,
  isVideoHome,
  isVideoGFE,
  isVideoVAFacility,
} from '../../../services/appointment';
import { VIDEO_TYPES } from '../../../utils/constants';
import VideoLink from './VideoLink';
import AtlasLocation from './AtlasLocation';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import AlertBox from 'applications/gi/components/AlertBox';
import { ALERT_TYPE } from '@department-of-veterans-affairs/component-library/AlertBox';
import FacilityPhone from 'applications/vaos/components/FacilityPhone';
import VideoVisitProvider from './VideoVisitProvider';
import AdditionalInfoRow from './AdditionalInfoRow';
import { VideoVisitInstructions } from './VideoInstructions';
import AddToCalendar from 'applications/vaos/components/AddToCalendar';
import moment from 'applications/vaos/lib/moment-tz';

// Only use this when we need to pass data that comes back from one of our
// services files to one of the older api functions
function parseFakeFHIRId(id) {
  return id ? id.replace('var', '') : id;
}

export default function VideoVisitLocation({ header, appointment, facility }) {
  const videoKind = getVideoKind(appointment);
  const isAtlas = isAtlasLocation(appointment);
  const isHome = isVideoHome(appointment);
  const isGFE = isVideoGFE(appointment);
  const isVA = isVideoVAFacility(appointment);
  const [showMoreOpen, setShowMoreOpen] = useState(false);
  const phone = facility?.telecom?.find(tele => tele.system === 'phone').value;
  const name = facility?.name || appointment.participant[0]?.actor.display;

  if (appointment.vaos.isPastAppointment && videoKind === VIDEO_TYPES.clinic) {
    return (
      <VAFacilityLocation
        facility={facility}
        facilityId={parseFakeFHIRId(getVAAppointmentLocationId(appointment))}
      />
    );
  }

  if (appointment.vaos.isPastAppointment) {
    return <span>Video conference</span>;
  }

  return (
    <>
      <div>
        <VideoLink appointment={appointment} />
        {isHome && (
          <>
            <div className="vads-u-margin-top--2">
              <VideoVisitProvider participants={appointment.participant} />
            </div>
            <div className="vads-u-margin-top--2">
              <AdditionalInfoRow
                id={appointment.id}
                open={showMoreOpen}
                triggerText="Prepare for video visit"
                onClick={() => setShowMoreOpen(!showMoreOpen)}
              >
                <VideoVisitInstructions
                  instructionsType={appointment.comment}
                />
              </AdditionalInfoRow>
            </div>
          </>
        )}
        {isGFE && (
          <div className="vads-u-margin-top--2">
            <VideoVisitProvider participants={appointment.participant} />
          </div>
        )}
        {isAtlas && (
          <div className="vads-u-margin-top--2">
            <AtlasLocation appointment={appointment} />
          </div>
        )}
        {videoKind === VIDEO_TYPES.clinic &&
          !isAtlas && (
            <div className="vads-u-margin-top--2">
              <VAFacilityLocation
                facility={facility}
                facilityId={parseFakeFHIRId(
                  getVAAppointmentLocationId(appointment),
                )}
                clinicFriendlyName={appointment.participant[0].actor.display}
              />
            </div>
          )}

        <div className="vads-u-margin-top--3 vaos-appts__block-label">
          <i
            aria-hidden="true"
            className="far fa-calendar vads-u-margin-right--1"
          />
          <AddToCalendar
            summary={`${header}`}
            description={`instructionText`}
            location={location}
            duration={appointment.minutesDuration}
            startDateTime={moment.parseZone(appointment.start)}
          />
        </div>

        <div className="vads-u-margin-top--2 vaos-appts__block-label">
          <i
            aria-hidden="true"
            className="fas fa-print vads-u-margin-right--1"
          />
          <a href="#">Print</a>
        </div>
        <AlertBox
          status={ALERT_TYPE.INFO}
          className="vads-u-display--block"
          backgroundOnly
        >
          Contact this facility if you need to reschedule or cancel your
          appointment.
          {!isAtlas &&
            !isVA && (
              <span className="vads-u-display--block vads-u-margin-top--2">
                {name}
                {phone && (
                  <>
                    <br />
                    Main phone: <FacilityPhone contact={phone} />
                  </>
                )}
              </span>
            )}
        </AlertBox>
      </div>
    </>
  );
}
