import React, { useState } from 'react';
import { isVideoHome } from '../../../services/appointment';
import { VIDEO_TYPES } from '../../../utils/constants';
import VideoLink from './VideoLink';
import AtlasLocation from './AtlasLocation';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import AlertBox from 'applications/gi/components/AlertBox';
import { ALERT_TYPE } from '@department-of-veterans-affairs/component-library/AlertBox';
import FacilityPhone from 'applications/vaos/components/FacilityPhone';
import VideoVisitProvider from './VideoVisitProvider';
import { VideoVisitInstructions } from './VideoInstructions';
import AddToCalendar from 'applications/vaos/components/AddToCalendar';
import moment from 'applications/vaos/lib/moment-tz';
import {
  formatFacilityAddress,
  formatFacilityPhone,
} from 'applications/vaos/services/location';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

function getLocation({ isAtlas, isVideo, videoKind, facility, appointment }) {
  if (isAtlas) {
    const { atlasLocation } = appointment.videoData;

    if (atlasLocation?.address) {
      const {
        firstName,
        lastName,
      } = appointment.vaos.apiData.vvsAppointments[0].providers[0].name;
      return {
        providerName: `${firstName} ${lastName}`,
        location: formatFacilityAddress(atlasLocation),
        text: 'Join this video meeting from this ATLAS (non-VA) location:',
        additionalText: [
          `Your appointment code is ${
            appointment.videoData.atlasConfirmationCode
          }. Use this code to find your appointment on the computer at {ATLAS location}.`,
        ],
      };
    }
  } else if (videoKind === VIDEO_TYPES.clinic) {
    return {
      providerName: appointment.location.clinicName,
      location: facility ? formatFacilityAddress(facility) : null,
      text: 'You need to join this video meeting from:',
      additionalText: [
        `You’ll be meeting with ${appointment.location.clinicName}`,
      ],
    };
  } else if (videoKind === VIDEO_TYPES.gfe || isVideo) {
    return {
      providerName: '',
      location: 'Video conference',
      text: '',
      additionalText: [],
    };
  }
  return {};
}

export default function VideoVisitLocation({ header, appointment, facility }) {
  const { kind, isAtlas, providers } = appointment.videoData;
  const isHome = isVideoHome(appointment);
  const [showMoreOpen, setShowMoreOpen] = useState(false);
  const phone = facility?.telecom?.find(tele => tele.system === 'phone')?.value;
  const name = facility?.name;

  const { location, providerName, text, additionalText } = getLocation({
    isAtlas,
    isVideo: appointment.vaos.isVideo,
    kind,
    facility,
    appointment,
  });

  const showVideoInstructions =
    appointment.vaos.isVideo &&
    appointment.comment &&
    kind !== VIDEO_TYPES.clinic &&
    kind !== VIDEO_TYPES.gfe;

  if (appointment.vaos.isPastAppointment && kind === VIDEO_TYPES.clinic) {
    return (
      <VAFacilityLocation
        facility={facility}
        facilityId={appointment.videoData.facilityId}
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
              <VideoVisitProvider providers={providers} />
            </div>
            {showVideoInstructions && (
              <div className="vads-u-margin-top--2">
                <AdditionalInfo
                  onClick={() => setShowMoreOpen(!showMoreOpen)}
                  triggerText="Prepare for video visit"
                >
                  <VideoVisitInstructions
                    instructionsType={appointment.comment}
                  />
                </AdditionalInfo>
              </div>
            )}
          </>
        )}
        {kind === VIDEO_TYPES.gfe && (
          <div className="vads-u-margin-top--2">
            <VideoVisitProvider providers={providers} />
          </div>
        )}
        {isAtlas && (
          <div className="vads-u-margin-top--2">
            <AtlasLocation appointment={appointment} />
          </div>
        )}
        {kind === VIDEO_TYPES.clinic &&
          !isAtlas && (
            <div className="vads-u-margin-top--2">
              <VAFacilityLocation
                facility={facility}
                facilityId={appointment.location.stationId}
                clinicFriendlyName={appointment.location.clinicName}
                isHomepageRefresh
              />
            </div>
          )}

        <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
          <i
            aria-hidden="true"
            className="far fa-calendar vads-u-margin-right--1"
          />
          <AddToCalendar
            summary={`VA Video Connect appointment at ${providerName}`}
            description={{
              text,
              phone: formatFacilityPhone(facility),
              additionalText,
            }}
            location={location}
            duration={appointment.minutesDuration}
            startDateTime={moment.parseZone(appointment.start)}
          />
        </div>

        <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
          <i
            aria-hidden="true"
            className="fas fa-print vads-u-margin-right--1"
          />
          <button className="va-button-link" onClick={() => window.print()}>
            Print
          </button>
        </div>
        <AlertBox
          status={ALERT_TYPE.INFO}
          className="vads-u-display--block"
          headline=" Need to make changes?"
          backgroundOnly
        >
          Contact this facility if you need to reschedule or cancel your
          appointment.
          <br />
          {!isAtlas &&
            !!facility && (
              <span className="vads-u-display--block vads-u-margin-top--2">
                {name}
                {phone && (
                  <>
                    <br />
                    <FacilityPhone contact={phone} level={3} />
                  </>
                )}
              </span>
            )}
        </AlertBox>
      </div>
    </>
  );
}
