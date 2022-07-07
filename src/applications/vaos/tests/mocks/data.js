/**
 * @module testing/mocks/data
 */
import omit from 'platform/utilities/data/omit';
import moment from '../../lib/moment-tz';
import { VIDEO_TYPES, APPOINTMENT_STATUS } from '../../utils/constants';

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
 * @param {?string} params.phone The phone number used
 * @param {?string} params.currentStatus The VistA status to use. Ignored in version 2
 * @param {Number} [params.version=2] The version of the output data. Currently 0 and 2 are supported
 * @param {?string} params.clinicFriendlyName The clinic name of the appointment (version 0 only)
 * @param {?string} params.clinicName The regular clinic name of the appointment (version 0 only)
 * @param {PPMSProvider} params.communityCareProvider The community care provider to use. Info aside from
 *   uniqueId is discarded in version 2
 * @param {?string} params.timezone The timezone to use
 * @param {...string} params.fields Other fields provided can be any version 2 field. Some are used to set data
 *   on the version 0 output (kind, start, etc) and all are merged into the v2 output
 * @returns {VAOSAppointment|MASAppointment} An appointment object in the specified format
 */
export function createMockAppointmentByVersion({
  id = null,
  email = null,
  phone = null,
  currentStatus = null,
  version = 2,
  clinicFriendlyName = null,
  clinicName = null,
  communityCareProvider = null,
  timezone = null,
  ...fields
} = {}) {
  const fieldsWithoutProps = omit(['email'], fields);

  if (version === 0 && fields.requestedPeriods?.length > 0) {
    return {
      id,
      attributes: {
        additionalInformation: null,
        bestTimetoCall: null,
        date: moment(),
        email,
        facility: {
          facilityCode: fields.locationId,
          name: clinicFriendlyName,
        },
        optionTime1: 'AM',
        optionDate1: moment(fields.requestedPeriods[0].start).format(
          'MM/DD/YYYY',
        ),
        phoneNumber: phone,
        status: fields.status === 'cancelled' ? 'Cancelled' : fields.status,
        typeOfCareId: fields.typeOfCareId || fields.serviceType,
        uniqueId: id,
        visitType: fields.visitType,
        cancelationReason: null,
      },
    };
  }

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
      } else if (fields.status === APPOINTMENT_STATUS.noshow) {
        vistaStatus = 'NO-SHOW';
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
          stopCode: fields.stopCode,
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
        status: {
          description: null,
          code: currentStatus || 'FUTURE',
        },
        schedulingRequestType: null,
        type: null,
        bookingNotes: fields.comment,
        instructionsOther: null,
        instructionsTitle: 'Video Visit Preparation',
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
        providerPractice: communityCareProvider.practiceName,
        providerPhone: communityCareProvider.caresitePhone,
        address: communityCareProvider.address
          ? {
              street: communityCareProvider.address.line[0],
              city: communityCareProvider.address.city,
              state: communityCareProvider.address.state,
              zipCode: communityCareProvider.address.postalCode,
            }
          : null,
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
        cancelationReason: null,
        clinic: null,
        comment: null,
        contact: {
          telecom: [
            { type: 'phone', value: phone },
            { type: 'email', value: email },
          ],
        },
        description: null,
        end: null,
        kind: null,
        locationId: null,
        minutesDuration: null,
        patientInstruction: 'Video Visit Preparation plus extra data',
        practitioners: communityCareProvider
          ? [
              {
                identifier: [
                  {
                    system: 'http://hl7.org/fhir/sid/us-npi',
                    value: communityCareProvider.uniqueId,
                  },
                ],
              },
            ]
          : null,
        preferredTimesForPhoneCall: null,
        priority: null,
        reasonCode: {},
        requestedPeriods: null,
        serviceType: null,
        slot: null,
        start:
          fields.kind === 'cc' && !fields.requestedPeriods?.length
            ? moment(fields.start)
                .utc()
                .format()
            : null,
        status: null,
        telehealth: null,
        extension: {
          ccLocation: communityCareProvider,
        },
        ...fieldsWithoutProps,
      },
    };
  }

  return null;
}

/**
 * Create mock clinic data in the specified version
 *
 * @export
 * @param {Object} params
 * @param {string} params.id Clinic id
 * @param {string} params.stationId Full location id (sta6aid)
 * @param {?string} params.name Standard clinic name,
 * @param {?string} params.friendlyName Friendly clinic name,
 * @param {number} [params.version=2] Version of the mock data format to use
 *
 * @returns {VAOSClinic|VARClinic} A mock clinic object, based on the version provided
 */
export function createMockClinicByVersion({
  id = null,
  stationId = null,
  name = null,
  friendlyName = null,
  version = 2,
}) {
  if (version === 2) {
    return {
      id,
      type: 'clinics',
      attributes: {
        vistaSite: stationId.substr(0, 3),
        id,
        serviceName: friendlyName || name,
        physicalLocation: null,
        phoneNumber: null,
        stationId,
        stationName: null,
        primaryStopCode: null,
        primaryStopCodeName: null,
        secondaryStopCode: null,
        secondaryStopCodeName: null,
        patientDirectScheduling: null,
        patientDisplay: null,
        char4: null,
      },
    };
  }
  if (version === 0) {
    return {
      id,
      type: 'clinic',
      attributes: {
        siteCode: stationId.substr(0, 3),
        clinicId: id,
        clinicName: name,
        clinicFriendlyLocationName: friendlyName,
        primaryStopCode: null,
        secondaryStopCode: null,
        directSchedulingFlag: 'Y',
        displayToPatientFlag: 'Y',
        institutionName: null,
        institutionCode: stationId,
        objectType: 'CdwClinic',
        link: [],
      },
    };
  }

  throw new Error('Missing version specified');
}

/**
 * Creates a mock VA facility object, for the specified version
 *
 * @export
 * @param {Object} params
 * @param {string} params.id The facility id
 * @param {string} params.name The facility name
 * @param {Address} params.address The facility address, in the FHIR format
 * @param {string} params.phone The facility phone
 * @param {number} params.lat The latitude of the facility
 * @param {number} params.long The longitude of the facility
 * @param {?boolean} params.isParent Is the facility is parent facility or not. Only relevent for version 2
 * @param {number} [params.version = 2] The version of the facility object to create
 *
 * @returns {VAFacility|MFSFacility} The facility mock with specified data
 */
export function createMockFacilityByVersion({
  id = 'fake',
  name = 'Fake name',
  address,
  phone = 'fake',
  lat,
  long,
  isParent = null,
  version = 2,
} = {}) {
  if (version === 2) {
    return {
      id,
      type: 'facility',
      attributes: {
        id,
        vistaSite: id.substring(0, 3),
        vastParent: isParent ? id : id.substring(0, 3),
        name,
        lat,
        long,
        phone: { main: phone },
        physicalAddress: address || {
          line: [],
          city: 'fake',
          state: 'fake',
          postalCode: 'fake',
        },
      },
    };
  }

  return {
    id: `vha_${id}`,
    type: 'va_facilities',
    attributes: {
      uniqueId: id,
      name,
      address: {
        physical: {
          zip: address?.postalCode || 'fake zip',
          city: address?.city || 'Fake city',
          state: address?.state || 'FA',
          address1: address?.line?.[0] || 'Fake street',
          address2: null,
          address3: null,
        },
      },
      lat,
      long,
      phone: {
        main: phone,
      },
      hours: {},
    },
  };
}

export function createMockCheyenneFacilityByVersion({ version = 2 } = {}) {
  return createMockFacilityByVersion({
    id: '442',
    name: 'Cheyenne VA Medical Center',
    address: {
      postalCode: '82001-5356',
      city: 'Cheyenne',
      state: 'WY',
      line: ['2360 East Pershing Boulevard'],
    },
    phone: '307-778-7550',
    version,
  });
}

/**
 * Creates a mock Provider object, for the specified version
 *
 * @export
 * @param {Object} params
 * @param {string} params.id The providerNpi id
 * @param {string} params.name The provider name address, in the FHIR format
 * @param {number} [params.version = 2] The version of the facility object to create
 * @returns {Provider} The provider mock with specified data
 */
export function createMockProviderByVersion({
  id = '123',
  name = 'Fake name',
  version = 2,
} = {}) {
  if (version === 2) {
    return {
      id,
      name,
    };
  }
  return null;
}
