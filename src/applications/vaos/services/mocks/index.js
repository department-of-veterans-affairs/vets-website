/* istanbul ignore file */
/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');
const moment = require('moment');

// v2
const ccProviders = require('./v2/cc_providers.json');
const facilitiesV2 = require('./v2/facilities.json');
const schedulingConfigurationsCC = require('./v2/scheduling_configurations_cc.json');
const schedulingConfigurations = require('./v2/scheduling_configurations.json');
const appointmentSlotsV2 = require('./v2/slots.json');
const clinicsV2 = require('./v2/clinics.json');
const patientProviderRelationships = require('./v2/patient_provider_relationships.json');
const recentLocations = require('./v2/recent_locations.json');

// To locally test appointment details null state behavior, comment out
// the inclusion of confirmed.json and uncomment the inclusion of
// confirmed_null_states.json
const confirmedV2 = require('./v2/confirmed.json');
// const confirmedV2 = require('./v2/confirmed_null_states.json');

// To locally test appointment details null state behavior, comment out
// the inclusion of requests.json and uncomment the inclusion of
// requests_null_states.json.json
const requestsV2 = require('./v2/requests.json');
// const requestsV2 = require('./v2/requests_null_states.json.json');

// Uncomment to produce backend service errors
// const meta = require('./v2/meta_failures.json');

// CC Direct Scheduling mocks
const referralUtils = require('../../referral-appointments/utils/referrals');
const providerUtils = require('../../referral-appointments/utils/provider');
const epsAppointmentUtils = require('../../referral-appointments/utils/appointment');

// Returns the meta object without any backend service errors
const meta = require('./v2/meta.json');
const momentTz = require('../../lib/moment-tz');
const features = require('./featureFlags');

const mockAppts = [];
let currentMockId = 1;
const draftAppointmentPollCount = {};

// key: NPI, value: Provider Name
const providerMock = {
  1801312053: 'AJADI, ADEDIWURA',
  1952935777: 'OH, JANICE',
  1992228522: 'SMAWLEY, DONNA C',
  1053355479: 'LYONS, KRISTYN',
  1396153797: 'STEWART, DARRYL',
  1154867018: 'GUILD, MICHAELA',
  1205346533: 'FREEMAN, SHARON',
  1548796501: 'CHAIB, EMBARKA',
  1780016782: 'Lawton, Amanda',
  1558874636: 'MELTON, JOY C',
  1982005708: 'OLUBUNMI, ABOLANLE A',
  1649609736: 'REISER, KATRINA',
  1770999294: 'TUCKER JONES, MICHELLE A',
  1255962510: 'OYEKAN, ADETOLA O',
  1770904021: 'Jones, Tillie',
};

const purposeText = {
  ROUTINEVISIT: 'Routine/Follow-up',
  MEDICALISSUE: 'New medical issue',
  QUESTIONMEDS: 'Medication concern',
  OTHER_REASON: 'My reason isn’t listed',
};

const responses = {
  'GET /facilities_api/v2/ccp/provider': ccProviders,
  'POST /vaos/v2/appointments': (req, res) => {
    const {
      practitioners = [{ identifier: [{ system: null, value: null }] }],
      kind,
    } = req.body;
    const selectedClinic = clinicsV2.data.filter(
      clinic => clinic.id === req.body.clinic,
    );
    const providerNpi = practitioners[0]?.identifier[0].value;
    const selectedTime = appointmentSlotsV2.data
      .filter(slot => slot.id === req.body.slot?.id)
      .map(slot => slot.attributes.start);
    // convert to local time in America/Denver timezone
    const localTime = momentTz(selectedTime[0])
      .tz('America/Denver')
      .format('YYYY-MM-DDTHH:mm:ss');
    const pending = req.body.status === 'proposed';
    const future = req.body.status === 'booked';
    let reasonForAppointment;
    let patientComments;
    let type;
    let modality;
    if (req.body.kind === 'cc') {
      patientComments = req.body.reasonCode?.text;
      type = pending ? 'COMMUNITY_CARE_REQUEST' : 'COMMUNITY_CARE_APPOINTMENT';
      modality = 'communityCare';
    } else {
      const tokens = req.body.reasonCode?.text?.split('|') || [];
      for (const token of tokens) {
        if (token.startsWith('reason code:')) {
          reasonForAppointment =
            purposeText[token.substring('reason code:'.length)];
        } else if (token.startsWith('comments:')) {
          patientComments = token.substring('comments:'.length);
        }
      }
      type = pending ? 'REQUEST' : 'VA';
      modality = 'vaInPerson';
    }

    const submittedAppt = {
      id: `mock${currentMockId}`,
      attributes: {
        ...req.body,
        created: new Date().toISOString(),
        kind,
        type,
        modality,
        localStartTime: req.body.slot?.id ? localTime : null,
        start: req.body.slot?.id ? selectedTime[0] : null,
        preferredProviderName: providerNpi ? providerMock[providerNpi] : null,
        contact: {
          telecom: [
            {
              type: 'phone',
              value: '6195551234',
            },
            {
              type: 'email',
              value: 'myemail72585885@unattended.com',
            },
          ],
        },
        physicalLocation:
          selectedClinic[0]?.attributes.physicalLocation || null,
        reasonForAppointment,
        patientComments,
        future,
        pending,
      },
    };
    currentMockId += 1;
    mockAppts.push(submittedAppt);
    return res.json({ data: submittedAppt });
  },
  'PUT /vaos/v2/appointments/:id': (req, res) => {
    // TODO: also check through confirmed mocks, when those exist
    const appointments = requestsV2.data
      .concat(confirmedV2.data)
      .concat(mockAppts);

    const appt = appointments.find(item => item.id === req.params.id);
    if (req.body.status === 'cancelled') {
      appt.attributes.status = 'cancelled';
      appt.attributes.cancelationReason = { coding: [{ code: 'pat' }] };
      appt.attributes.cancellable = false;
      if (appt.attributes.start) {
        appt.attributes.future = moment(appt.attributes.start).isAfter(
          moment(),
        );
      }
    }

    return res.json({
      data: {
        id: req.params.id,
        attributes: {
          ...appt.attributes,
          ...req.body,
        },
      },
    });
  },
  'GET /vaos/v2/appointments': (req, res) => {
    // merge arrays together
    const appointments = confirmedV2.data.concat(requestsV2.data, mockAppts);
    for (const appointment of appointments) {
      if (appointment.attributes.start) {
        appointment.attributes.future = moment(
          appointment.attributes.start,
        ).isAfter(moment());

        if (appointment.attributes.modality === 'vaVideoCareAtHome') {
          const diff = moment().diff(
            moment(appointment.attributes.start),
            'minutes',
          );
          if (!appointment.attributes.telehealth) {
            appointment.attributes.telehealth = {};
          }
          appointment.attributes.telehealth.displayLink =
            diff > -30 && diff < 240;
        }
      }
    }
    const filteredAppointments = appointments.filter(appointment => {
      return req.query.statuses.some(status => {
        if (appointment.attributes.status === status) {
          // Automatically add appointments with these statuses to the collection
          if (
            appointment.id.startsWith('mock') ||
            appointment.attributes.status === 'cancelled'
          )
            return true;

          const { requestedPeriods } = appointment.attributes;
          let date = moment.invalid();

          if (status === 'proposed') {
            // Must check for valid data since creating a moment object with invalid
            // data defaults to creating a moment object using the current date.
            if (
              Array.isArray(requestedPeriods) &&
              requestedPeriods.length > 0
            ) {
              date = moment(requestedPeriods[0].start);
            }
          } else if (status === 'booked') {
            date = moment(appointment.attributes.start);
          }

          if (
            date.isValid() &&
            date.isBetween(req.query.start, req.query.end, 'day', '(]')
          ) {
            return true;
          }
        }
        return false;
      });
    });
    return res.json({ data: filteredAppointments, meta });
  },
  //  To test malformed appointmentID error response locally
  //  uncomment the inclusion of errors.json
  //  uncomment the get api with returned errors
  //  comment out the get api request with returned data

  // const errors = require('./v2/errors.json');
  // 'GET /vaos/v2/appointments/:id': (req, res) => {
  //   return res.json(errors);
  // },

  'GET /vaos/v2/appointments/:id': (req, res) => {
    const appointments = {
      data: requestsV2.data.concat(confirmedV2.data).concat(mockAppts),
    };
    const appointment = appointments.data.find(
      appt => appt.id === req.params.id,
    );

    if (appointment?.start) {
      appointment.future = moment(appointment.start).isAfter(moment());
    }
    return res.json({
      data: appointment,
    });
  },
  'GET /vaos/v2/scheduling/configurations': (req, res) => {
    if (req.query.cc_enabled === 'true') {
      return res.json(schedulingConfigurationsCC);
    }

    return res.json(schedulingConfigurations);
  },
  'GET /vaos/v2/community_care/eligibility/:id': (req, res) => {
    return res.json({
      data: {
        id: req.param.id,
        type: 'cc_eligibility',
        attributes: { eligible: true },
      },
    });
  },
  'GET /vaos/v2/facilities/:id': (req, res) => {
    return res.json({
      data: facilitiesV2.data.find(facility => facility.id === req.params.id),
    });
  },
  'GET /vaos/v2/facilities': (req, res) => {
    const { ids } = req.query;
    const { children } = req.query;
    const { sort_by } = req.query;

    if (sort_by === 'recentLocations') {
      return res.json({
        data: recentLocations?.data.filter(
          facility =>
            ids.includes(facility?.id) ||
            (children === 'true' &&
              ids?.some(id => facility?.id.startsWith(id))),
        ),
      });
    }

    return res.json({
      data: facilitiesV2.data.filter(
        facility =>
          ids.includes(facility.id) ||
          (children === 'true' && ids.some(id => facility.id.startsWith(id))),
      ),
    });
  },
  'GET /vaos/v2/locations/:facility_id/clinics/:clinic_id/slots': (
    req,
    res,
  ) => {
    const start = moment(req.query.start);
    const end = moment(req.query.end);
    const slots = appointmentSlotsV2.data.filter(slot => {
      const slotStartDate = moment(slot.attributes.start);
      return slotStartDate.isBetween(start, end, '[]');
    });
    return res.json({
      data: slots,
    });
  },
  'GET /vaos/v2/patients': (req, res) => {
    return res.json({
      data: {
        attributes: {
          hasRequiredAppointmentHistory:
            !req.query.facility_id.startsWith('984') ||
            req.query.clinical_service === 'primaryCare',
          isEligibleForNewAppointmentRequest: req.query.facility_id.startsWith(
            '983',
          ),
        },
      },
    });
  },
  'GET /vaos/v2/eligibility': (req, res) => {
    const isDirect = req.query.type === 'direct';
    const ineligibilityReasons = [];

    // Direct scheduling, Facility 983, not primaryCare
    if (
      isDirect &&
      req.query.facility_id.startsWith('984') &&
      req.query.clinical_service_id !== 'primaryCare'
    ) {
      ineligibilityReasons.push({
        coding: [
          {
            code: 'patient-history-insufficient',
          },
        ],
      });
    }

    // Request, not Facility 983, not Facility 692 (OH)
    if (
      !isDirect &&
      (!req.query.facility_id.startsWith('983') &&
        !req.query.facility_id.startsWith('692'))
    ) {
      ineligibilityReasons.push({
        coding: [
          {
            code: 'facility-request-limit-exceeded',
          },
        ],
      });
    }

    return res.json({
      data: {
        attributes: {
          type: req.query.type,
          clinicalServiceId: req.query.clinical_service_id,
          eligible: ineligibilityReasons.length === 0,
          ineligibilityReasons:
            ineligibilityReasons.length === 0
              ? undefined
              : ineligibilityReasons,
        },
      },
    });
  },
  'GET /vaos/v2/locations/:id/clinics': (req, res) => {
    if (req.query.clinic_ids) {
      return res.json({
        data: clinicsV2.data.filter(clinic =>
          req.query.clinic_ids.includes(clinic.id),
        ),
      });
    }

    if (req.params.id === '983') {
      return res.json(clinicsV2);
    }

    return res.json({
      data: [],
    });
  },
  'GET /vaos/v2/relationships': (req, res) => {
    return res.json(patientProviderRelationships);
  },
  'GET /vaos/v2/referrals': (req, res) => {
    return res.json({
      data: referralUtils.createReferrals(4, null, null, true, true),
    });
  },
  'GET /vaos/v2/referrals/:referralId': (req, res) => {
    if (req.params.referralId === 'error') {
      return res.status(500).json({ error: true });
    }

    if (req.params.referralId === 'scheduled-referral') {
      const scheduledReferral = referralUtils.createReferralById(
        '2024-12-02',
        'scheduled-referral',
      );
      // Set hasAppointments to true to test redirect
      scheduledReferral.attributes.hasAppointments = true;
      return res.json({
        data: scheduledReferral,
      });
    }

    if (req.params.referralId?.startsWith(referralUtils.expiredUUIDBase)) {
      const expiredReferral = referralUtils.createReferralById(
        '2024-12-02',
        req.params.referralId,
      );
      return res.json({
        data: expiredReferral,
      });
    }

    if (req.params.referralId === 'referral-without-provider-error') {
      const expiredReferral = referralUtils.createReferralById(
        '2024-12-02',
        req.params.referralId,
        undefined,
        undefined,
        false, // hasProvider
      );
      return res.json({
        data: expiredReferral,
      });
    }

    const referral = referralUtils.createReferralById(
      '2024-12-02',
      req.params.referralId,
    );

    return res.json({
      data: referral,
    });
  },
  'POST /vaos/v2/appointments/draft': (req, res) => {
    const { referral_number: referralNumber } = req.body;
    // empty referral number throws error
    if (referralNumber === '') {
      return res.status(500).json({ error: true });
    }

    const draftAppointment = providerUtils.createDraftAppointmentInfo(
      3,
      referralNumber,
    );

    return res.json({
      data: draftAppointment,
    });
  },
  'GET /vaos/v2/eps_appointments/:appointmentId': (req, res) => {
    let successPollCount = 2; // The number of times to poll before returning a confirmed appointment
    const { appointmentId } = req.params;
    // create a mock appointment in draft state for polling simulation
    const mockAppointment = epsAppointmentUtils.createMockEpsAppointment(
      appointmentId,
      'draft',
      epsAppointmentUtils.appointmentData,
    );

    if (appointmentId === 'details-retry-error') {
      // Set a very high poll count to simulate a timeout
      successPollCount = 1000;
    }

    if (appointmentId === 'EEKoGzEf-appointment-details-error') {
      return res.status(500).json({ error: true });
    }

    if (appointmentId === 'eps-error-appointment-id') {
      return res.status(400).json({ error: true });
    }

    if (appointmentId === 'details-error') {
      return res.status(500).json({ error: true });
    }

    // Check if the request is coming from the details page
    // We can determine this by checking the referer header or request path
    const refererHeader = req.headers.referer || '';
    const isDetailsView =
      refererHeader.includes(`/${appointmentId}`) ||
      req.query.view === 'details';

    if (isDetailsView) {
      // For details view, immediately return appointment in booked state
      mockAppointment.attributes.status = 'booked';
      return res.json({
        data: mockAppointment,
      });
    }

    // Continue with normal polling behavior for ReviewAndConfirm component
    const count = draftAppointmentPollCount[appointmentId] || 0;

    // Mock polling for appointment state change
    if (count < successPollCount) {
      draftAppointmentPollCount[appointmentId] = count + 1;
    } else {
      // reassign status of mocked appointment to booked to simulate success
      mockAppointment.attributes.status = 'booked';
      draftAppointmentPollCount[appointmentId] = 0;
    }

    return res.json({
      data: mockAppointment,
    });
  },
  'POST /vaos/v2/appointments/submit': (req, res) => {
    const {
      id,
      referralNumber,
      slotId,
      networkId,
      providerServiceId,
    } = req.body;

    if (!id || !referralNumber || !slotId || !networkId || !providerServiceId) {
      return res.status(400).json({ error: true });
    }

    if (referralNumber === 'appointment-submit-error') {
      return res.status(500).json({ error: true });
    }

    draftAppointmentPollCount[id] = 1;

    return res.status(201).json({
      data: { id },
    });
  },
  // Required v0 APIs
  'GET /v0/user': {
    data: {
      attributes: {
        profile: {
          sign_in: {
            service_name: 'idme',
          },
          email: 'fake@fake.com',
          loa: { current: 3 },
          first_name: 'Jane',
          middle_name: '',
          last_name: 'Doe',
          gender: 'F',
          birth_date: '1985-01-01',
          verified: true,
        },
        veteran_status: {
          status: 'OK',
          is_veteran: true,
          served_in_military: true,
        },
        in_progress_forms: [],
        prefills_available: ['21-526EZ'],
        services: [
          'facilities',
          'hca',
          'edu-benefits',
          'evss-claims',
          'form526',
          'user-profile',
          'health-records',
          'rx',
          'messaging',
        ],
        va_profile: {
          status: 'OK',
          birth_date: '19511118',
          family_name: 'Hunter',
          gender: 'M',
          given_names: ['Julio', 'E'],
          active_status: 'active',
          facilities: [
            {
              facility_id: '556',
              is_cerner: false,
            },
            {
              facility_id: '984',
              is_cerner: false,
            },
            {
              facility_id: '983',
              is_cerner: false,
            },
            {
              facility_id: '692',
              is_cerner: true,
            },
          ],
        },
        vet360ContactInformation: {
          email: {
            createdAt: '2018-04-20T17:24:13.000Z',
            emailAddress: 'myemail72585885@unattended.com',
            effectiveEndDate: null,
            effectiveStartDate: '2019-03-07T22:32:40.000Z',
            id: 20648,
            sourceDate: '2019-03-07T22:32:40.000Z',
            sourceSystemUser: null,
            transactionId: '44a0858b-3dd1-4de2-903d-38b147981a9c',
            updatedAt: '2019-03-08T05:09:58.000Z',
            vet360Id: '1273766',
          },
          residentialAddress: {
            addressLine1: '345 Home Address St.',
            addressLine2: 'line 2',
            addressLine3: 'line 3',
            addressPou: 'RESIDENCE/CHOICE',
            addressType: 'DOMESTIC',
            city: 'San Francisco',
            countryName: 'United States',
            countryCodeIso2: 'US',
            countryCodeIso3: 'USA',
            countryCodeFips: null,
            countyCode: null,
            countyName: null,
            createdAt: '2022-03-21T21:26:35.000Z',
            effectiveEndDate: null,
            effectiveStartDate: '2022-03-23T19:11:51.000Z',
            geocodeDate: '2022-03-23T19:11:51.000Z',
            geocodePrecision: null,
            id: 312003,
            internationalPostalCode: null,
            latitude: 37.781,
            longitude: -122.4605,
            province: null,
            sourceDate: '2022-03-23T19:11:51.000Z',
            sourceSystemUser: null,
            stateCode: 'CA',
            transactionId: 'c5adb989-3b87-47b6-afe3-dc18800cedc3',
            updatedAt: '2022-03-23T19:11:52.000Z',
            validationKey: null,
            vet360Id: '1273766',
            zipCode: '94118',
            zipCodeSuffix: null,
            badAddress: null,
          },
          mailingAddress: {
            addressLine1: '123 Mailing Address St.',
            addressLine2: 'Apt 1',
            addressLine3: null,
            addressPou: 'CORRESPONDENCE',
            addressType: 'DOMESTIC',
            city: 'Fulton',
            countryName: 'United States',
            countryCodeIso2: 'US',
            countryCodeIso3: 'USA',
            countryCodeFips: null,
            countyCode: null,
            countyName: null,
            createdAt: '2022-03-21T21:06:15.000Z',
            effectiveEndDate: null,
            effectiveStartDate: '2022-03-23T19:14:59.000Z',
            geocodeDate: '2022-03-23T19:15:00.000Z',
            geocodePrecision: null,
            id: 311999,
            internationalPostalCode: null,
            latitude: 45.2248,
            longitude: -121.3595,
            province: null,
            sourceDate: '2022-03-23T19:14:59.000Z',
            sourceSystemUser: null,
            stateCode: 'NY',
            transactionId: '3ea3ecf8-3ddf-46d9-8a4b-b5554385b3fb',
            updatedAt: '2022-03-23T19:15:01.000Z',
            validationKey: null,
            vet360Id: '1273766',
            zipCode: '97063',
            zipCodeSuffix: null,
            badAddress: null,
          },
          mobilePhone: {
            areaCode: '619',
            countryCode: '1',
            createdAt: '2022-01-12T16:22:03.000Z',
            extension: null,
            effectiveEndDate: null,
            effectiveStartDate: '2022-02-17T20:15:44.000Z',
            id: 269804,
            isInternational: false,
            isTextable: null,
            isTextPermitted: null,
            isTty: null,
            isVoicemailable: null,
            phoneNumber: '5551234',
            phoneType: 'MOBILE',
            sourceDate: '2022-02-17T20:15:44.000Z',
            sourceSystemUser: null,
            transactionId: 'fdb13953-f670-4bd3-a3bb-8881eb9165dd',
            updatedAt: '2022-02-17T20:15:45.000Z',
            vet360Id: '1273766',
          },
          homePhone: {
            areaCode: '989',
            countryCode: '1',
            createdAt: '2018-04-20T17:22:56.000Z',
            extension: null,
            effectiveEndDate: null,
            effectiveStartDate: '2022-03-11T16:31:55.000Z',
            id: 2272982,
            isInternational: false,
            isTextable: null,
            isTextPermitted: null,
            isTty: null,
            isVoicemailable: null,
            phoneNumber: '8981233',
            phoneType: 'HOME',
            sourceDate: '2022-03-11T16:31:55.000Z',
            sourceSystemUser: null,
            transactionId: '2814cdf6-7f2c-431b-95f3-d37f3837215d',
            updatedAt: '2022-03-11T16:31:56.000Z',
            vet360Id: '1273766',
          },
          workPhone: null,
          temporaryPhone: null,
          faxNumber: null,
          textPermission: null,
        },
      },
    },
    meta: { errors: null },
  },
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features,
    },
  },
  // End of required v0 APIs
};

module.exports = delay(responses, 4000);
