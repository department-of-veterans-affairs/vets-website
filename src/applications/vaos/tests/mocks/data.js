/**
 * @module testing/mocks/data
 */
import moment from '../../lib/moment-tz';
import omit from 'platform/utilities/data/omit';
import { VIDEO_TYPES } from '../../utils/constants';

/**
 * Creates a mock appointment record, based on the data and version number
 * provided.
 *
 * Versions currently supported:
 * - 0: MAS appointment
 * - 2: VAOS service appointment
 *
 * @export
 * @param {Object} params
 * @param {?string} params.id The appointment id
 * @param {?string} params.email The email address used
 * @param {?string} params.currentStatus The VistA status to use. Ignored in version 2
 * @param {Number} [params.version=2] The version of the output data. Currently 0 and 2 are supported
 * @param {?string} params.clinicFriendlyName The clinic name of the appointment (version 0 only)
 * @param {?string} params.clinicName The regular clinic name of the appointment (version 0 only)
 * @param {?string} params.instructionsTitle The video instructions title string
 * @param {PPMSProvider} params.communityCareProvider The community care provider to use. Info aside from
 *   uniqueId is discarded in version 2
 * @param {...string} params.fields Other fields provided can be any version 2 field. Some are used to set data
 *   on the version 0 output (kind, start, etc) and all are merged into the v2 output
 * @returns {VAOSAppointment|MASAppointment} An appointment object in the specified format
 */
export function createMockAppointmentByVersion({
  id = null,
  email = null,
  currentStatus = null,
  version = 2,
  clinicFriendlyName = null,
  clinicName = null,
  instructionsTitle = null,
  communityCareProvider = null,
  timezone = null,
  ...fields
} = {}) {
  const fieldsWithoutProps = omit(['email'], fields);
  if (version === 0 && fields.kind !== 'cc') {
    const vdsAppointments = [];
    const vvsAppointments = [];
    let vistaStatus = currentStatus;

    if (
      !vistaStatus &&
      (fields.kind !== 'telehealth' || fields.vvsKind === VIDEO_TYPES.clinic)
    ) {
      if (fields.status === 'cancelled') {
        vistaStatus = 'CANCELLED BY PATIENT';
      } else if (
        fields.status === 'booked' &&
        moment().isSameOrAfter(fields.start)
      ) {
        vistaStatus = 'CHECKED OUT';
      } else if (fields.status === 'booked') {
        vistaStatus = 'FUTURE';
      }
    }

    if (
      fields.kind === 'clinic' ||
      fields.kind === 'phone' ||
      (fields.kind === 'telehealth' &&
        fields.telehealth.vvsKind === VIDEO_TYPES.clinic)
    ) {
      vdsAppointments.push({
        bookingNote: fields.comment,
        appointmentLength: fields.minutesDuration,
        appointmentTime: fields.start,
        clinic: {
          name: clinicName,
          askForCheckIn: false,
          facilityCode: fields.locationId?.substr(0, 3) || null,
        },
        type: 'REGULAR',
        currentStatus: vistaStatus,
      });
    }

    if (fields.kind === 'telehealth') {
      vvsAppointments.push({
        id,
        appointmentKind: fields.telehealth.vvsKind,
        sourceSystem: 'VCM',
        dateTime: fields.start,
        duration: fields.minutesDuration || null,
        status: { description: null, code: 'FUTURE' },
        schedulingRequestType: null,
        type: null,
        bookingNotes: fields.comment,
        instructionsOther: null,
        instructionsTitle,
        patients: [
          {
            name: { firstName: 'JUDY', lastName: 'MORRISON' },
            contactInformation: {
              mobile: null,
              preferredEmail: email || null,
            },
            location: {
              type: 'NonVA',
              facility: {
                name: null,
                siteCode: fields.locationId?.substr(0, 3),
                timeZone: null,
              },
            },
            patientAppointment: true,
            virtualMeetingRoom: {
              conference: null,
              pin: null,
              url: fields.telehealth.url,
            },
          },
        ],
        tasInfo: fields.telehealth.atlas || null,
        providers:
          fields.practitioners?.map(p => ({
            name: {
              firstName: p.firstName,
              lastName: p.lastName,
            },
          })) || [],
      });
    }

    return {
      id,
      type: 'appointment',
      attributes: {
        startDate: fields.start || null,
        uniqueId: id,
        clinicFriendlyName,
        clinicId: fields.clinic || null,
        facilityId: fields.locationId?.substr(0, 3) || null,
        sta6aid: fields.locationId || null,
        communityCare: false,
        phoneOnly: fields.kind === 'phone',
        char4: fields.serviceType === 'covid' ? 'CDQC' : null,
        vdsAppointments,
        vvsAppointments,
      },
    };
  }

  if (version === 0 && fields.kind === 'cc') {
    return {
      id,
      type: 'cc_appointments',
      attributes: {
        appointmentRequestId: id,
        distanceEligibleConfirmed: true,
        name: { firstName: null, lastName: null },
        providerPractice: communityCareProvider.name,
        providerPhone: communityCareProvider.caresitePhone,
        address: {
          street: communityCareProvider.street,
          city: communityCareProvider.city,
          state: communityCareProvider.state,
          zipCode: communityCareProvider.zip,
        },
        instructionsToVeteran: fields.comment,
        appointmentTime: moment(fields.start)
          .utc()
          .format('MM/DD/YYYY HH:mm:ss'),
        timeZone: moment(fields.start)
          .tz(timezone || moment.tz.guess())
          .format('Z z'),
      },
    };
  }

  if (version === 2) {
    return {
      id,
      type: 'appointments',
      attributes: {
        id,
        cancellationReason: null,
        clinic: null,
        comment: null,
        contact: {
          telecom: [
            {
              type: 'email',
              value: email,
            },
          ],
        },
        description: null,
        end: null,
        kind: null,
        locationId: null,
        minutesDuration: null,
        practitioners: communityCareProvider
          ? [
              {
                id: { system: 'HSRM', value: communityCareProvider.uniqueId },
              },
            ]
          : null,
        preferredTimesForPhoneCall: null,
        priority: null,
        reason: null,
        requestedPeriods: null,
        serviceType: null,
        slot: null,
        start:
          fields.kind === 'cc'
            ? moment(fields.start)
                .utc()
                .format()
            : null,
        status: null,
        telehealth: null,
        ...fieldsWithoutProps,
      },
    };
  }

  return null;
}
