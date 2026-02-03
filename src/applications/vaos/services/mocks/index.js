/* istanbul ignore file */
/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

// v2
const { formatInTimeZone } = require('date-fns-tz');
const {
  isAfter,
  isValid,
  isWithinInterval,
  differenceInMinutes,
} = require('date-fns');
const {
  getMockConfirmedAppointments,
  findNextBusinessDay,
} = require('./utils/confirmedAppointments');
const { getMockSlots } = require('./utils/slots');

// v2
const ccProviders = require('./v2/cc_providers.json');
const facilitiesV2 = require('./v2/facilities.json');
// const schedulingConfigurationsCC = require('./v2/scheduling_configurations_cc.json');
// const schedulingConfigurations = require('./v2/scheduling_configurations.json');

// Generate dynamic slots with conflicts based on confirmed appointments
const mockConfirmedAppointments = getMockConfirmedAppointments();
// Find appointments scheduled for the next business day to force conflicts
const nextBusinessDay = findNextBusinessDay();
const nextBusinessDayString = nextBusinessDay.toISOString().split('T')[0]; // Get YYYY-MM-DD format

// To locally test appointment details null state behavior, comment out
// the inclusion of confirmed.json and uncomment the inclusion of
// confirmed_null_states.json
const confirmedV2 = require('./v2/confirmed.json');
// const confirmedV2 = require('./v2/confirmed_null_states.json');

// Oracle Health confirmed appointments
const confirmedOh = require('./v2/confirmed_oh.json');

const confirmedAppointmentsV3 = {
  data: mockConfirmedAppointments.data.concat(
    confirmedV2.data,
    confirmedOh.data,
  ),
};

const nextBusinessDayAppointments = confirmedAppointmentsV3.data.filter(
  appointment => {
    const appointmentDate = appointment.attributes.start.split('T')[0];
    return appointmentDate === nextBusinessDayString;
  },
);
const appointmentSlotsV2 = getMockSlots({
  existingAppointments: confirmedAppointmentsV3.data,
  futureMonths: 6,
  pastMonths: 1,
  slotsPerDay: 10,
  conflictRate: 0.4, // 40% of days with appointments will have conflicts
  forceConflictWithAppointments: nextBusinessDayAppointments,
});
const clinics983V2 = require('./v2/clinics_983.json');
const clinics984V2 = require('./v2/clinics_984.json');
const patientProviderRelationships = require('./v2/patient_provider_relationships.json');
// Comment out line above and uncomment line below to test relationship endpoint error states
// const patientProviderRelationships = require('./v2/patient_provider_relationships_errors.json');
const recentLocations = require('./v2/recent_locations.json');
const vamcEhr = require('./v2/vamc_ehr.json');
const { data: avsPdfData } = require('./v2/avs_pdf_data');

// To locally test appointment details null state behavior, comment out
// the inclusion of requests.json and uncomment the inclusion of
// requests_null_states.json.json
const requestsV2 = require('./v2/requests.json');
// const requestsV2 = require('./v2/requests_null_states.json.json');

// Oracle Health appointment requests
const requestsOh = require('./v2/requests_oh.json');
const schedulingConfigurationsVPG = require('./v2/scheduling_configurations_vpg.json');

const appointmentRequests = {
  data: requestsV2.data.concat(requestsOh.data),
};

// CC Direct Scheduling mocks
const MockReferralListResponse = require('../../tests/fixtures/MockReferralListResponse');
const MockReferralDetailResponse = require('../../tests/fixtures/MockReferralDetailResponse');
const MockReferralDraftAppointmentResponse = require('../../tests/fixtures/MockReferralDraftAppointmentResponse');
const MockReferralAppointmentDetailsResponse = require('../../tests/fixtures/MockReferralAppointmentDetailsResponse');
const MockReferralSubmitAppointmentResponse = require('../../tests/fixtures/MockReferralSubmitAppointmentResponse');

// Returns the meta object without any backend service errors
const meta = require('./v2/meta.json');
// Uncomment to produce backend service errors
// const meta = require('./v2/meta_failures.json');

const features = require('./featureFlags');
const {
  // defaultUser,
  // acceleratedCernerUser,
  cernerUser,
  // transitioningUser,
} = require('../../../../platform/mhv/api/mocks/user');

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

const responses = {
  'GET /facilities_api/v2/ccp/provider': ccProviders,
  'POST /vaos/v2/appointments': (req, res) => {
    const {
      practitioners = [{ identifier: [{ system: null, value: null }] }],
      kind,
    } = req.body;
    const selectedClinic = clinics983V2.data.filter(
      clinic => clinic.id === req.body.clinic,
    );
    const providerNpi = practitioners[0]?.identifier[0].value;
    const selectedTime = appointmentSlotsV2.data
      .filter(slot => slot.id === req.body.slot?.id)
      .map(slot => slot.attributes.start);
    // convert to local time in America/Denver timezone
    let localTime;
    if (selectedTime && selectedTime.length) {
      localTime = formatInTimeZone(
        selectedTime[0],
        'America/Denver',
        'yyyy-MM-ddTHH:mm:ss',
      );
    }
    const pending = req.body.status === 'proposed';
    const future = req.body.status === 'booked';
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
        if (token.startsWith('comments:')) {
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
    const appointments = appointmentRequests.data
      .concat(confirmedAppointmentsV3.data)
      .concat(mockAppts);

    const appt = appointments.find(item => item.id === req.params.id);
    if (req.body.status === 'cancelled') {
      appt.attributes.status = 'cancelled';
      appt.attributes.cancelationReason = { coding: [{ code: 'pat' }] };
      appt.attributes.cancellable = false;
      if (appt.attributes.start) {
        appt.attributes.future = isAfter(
          new Date(appt.attributes.start),
          new Date(),
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

    const appointments = confirmedAppointmentsV3.data.concat(
      appointmentRequests.data,
      mockAppts,
    );
    for (const appointment of appointments) {
      if (
        appointment.attributes.start &&
        !appointment.attributes.referral?.referralNumber
      ) {
        appointment.attributes.future = isAfter(
          new Date(appointment.attributes.start),
          new Date(),
        );

        if (appointment.attributes.modality === 'vaVideoCareAtHome') {
          const diff = differenceInMinutes(
            new Date(),
            new Date(appointment.attributes.start),
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
          let date;

          if (status === 'proposed') {
            if (
              Array.isArray(requestedPeriods) &&
              requestedPeriods.length > 0
            ) {
              date = new Date(requestedPeriods[0].start);
            }
          } else if (status === 'booked') {
            date = new Date(appointment.attributes.start);
          }

          if (
            isValid(date) &&
            isWithinInterval(date, {
              start: new Date(req.query.start),
              end: new Date(req.query.end),
            })
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
      data: appointmentRequests.data
        .concat(confirmedAppointmentsV3.data)
        .concat(mockAppts),
    };
    const appointment = appointments.data.find(
      appt => appt.id === req.params.id,
    );

    if (appointment?.start && !appointment.referral?.referralNumber) {
      appointment.future = isAfter(new Date(appointment.start), new Date());
    }
    return res.json({
      data: appointment,
    });
  },
  'GET /vaos/v2/appointments/avs_binary/:appointmentId': (req, res) => {
    const { appointmentId } = req.params;
    const docIds = req.query.doc_ids ? req.query.doc_ids.split(',') : [];

    // Look up mock data for this appointment
    const appointmentData = avsPdfData[appointmentId];

    if (!appointmentData) {
      return res.status(404).json({
        errors: [
          {
            title: 'Appointment not found',
            status: '404',
            detail: `No AVS data found for appointment ${appointmentId}`,
          },
        ],
      });
    }

    // Filter to only requested doc_ids and format as JSON:API
    const filteredData = appointmentData
      .filter(item => docIds.includes(item.docId))
      .map(item => ({
        id: item.docId,
        attributes: item,
      }));

    return res.json({ data: filteredData });
  },
  'GET /vaos/v2/scheduling/configurations': (req, res) => {
    if (req.query.cc_enabled === 'true') {
      // Return VPG scheduling configurations
      return res.json(schedulingConfigurationsVPG);
      // return res.json(schedulingConfigurationsCC);
    }

    // Return VPG scheduling configurations
    return res.json(schedulingConfigurationsVPG);
    // return res.json(schedulingConfigurations);
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
    const start = new Date(req.query.start);
    const end = new Date(req.query.end);
    const slots = appointmentSlotsV2.data.filter(slot => {
      const slotStartDate = new Date(slot.attributes.start);
      return isWithinInterval(slotStartDate, { start, end });
    });
    return res.json({
      data: slots,
    });
  },
  'GET /vaos/v2/locations/:facility_id/slots': (req, res) => {
    const start = new Date(req.query.start);
    const end = new Date(req.query.end);
    const slots = appointmentSlotsV2.data.filter(slot => {
      const slotStartDate = new Date(slot.attributes.start);
      return isWithinInterval(slotStartDate, { start, end });
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
        data: clinics983V2.data.filter(clinic =>
          req.query.clinic_ids.includes(clinic.id),
        ),
      });
    }

    if (req.params.id === '983') {
      return res.json(clinics983V2);
    }

    if (req.params.id === '984') {
      return res.json(clinics984V2);
    }

    return res.json({
      data: [],
    });
  },
  'GET /vaos/v2/relationships': (req, res) => {
    return res.json(patientProviderRelationships);
  },
  'GET /vaos/v2/referrals': (req, res) => {
    return res.json(
      new MockReferralListResponse({
        predefined: true,
      }),
    );
  },
  'GET /vaos/v2/referrals/:referralId': (req, res) => {
    if (req.params.referralId === 'error') {
      return res.status(500).json({ error: true });
    }

    if (req.params.referralId === 'scheduled-referral') {
      return res.json(
        new MockReferralDetailResponse({
          id: req.params.referralId,
          expirationDate: '2024-12-02',
          hasAppointments: true,
        }),
      );
    }

    if (req.params.referralId === 'referral-without-provider-error') {
      return res.json(
        new MockReferralDetailResponse({
          id: req.params.referralId,
          provider: null,
        }),
      );
    }

    return res.json(
      new MockReferralDetailResponse({
        id: req.params.referralId,
        referralNumber: req.params.referralId,
      }),
    );
  },
  'POST /vaos/v2/appointments/draft': (req, res) => {
    const { referral_number: referralNumber } = req.body;
    // empty referral number throws error
    if (referralNumber === '') {
      return res.status(500).json(
        new MockReferralDraftAppointmentResponse({
          referralNumber,
          serverError: true,
        }),
      );
    }
    if (referralNumber === 'draft-no-slots-error') {
      return res.json(
        new MockReferralDraftAppointmentResponse({
          referralNumber,
          categoryOfCare: 'OPTOMETRY',
          startDate: new Date(),
          noSlotsError: true,
        }),
      );
    }

    return res.json(
      new MockReferralDraftAppointmentResponse({
        referralNumber,
        categoryOfCare: 'OPTOMETRY',
        startDate: new Date(),
      }),
    );
  },
  'GET /vaos/v2/eps_appointments/:appointmentId': (req, res) => {
    let successPollCount = 2; // The number of times to poll before returning a confirmed appointment
    const { appointmentId } = req.params;

    // create a mock appointment in draft state for polling simulation
    let mockAppointment = new MockReferralAppointmentDetailsResponse({
      appointmentId,
      status: 'draft',
    });

    const mockBookedAppointment = new MockReferralAppointmentDetailsResponse({
      appointmentId,
      status: 'booked',
    });

    const serverError = new MockReferralAppointmentDetailsResponse({
      appointmentId,
      serverError: true,
    });

    const notFoundError = new MockReferralAppointmentDetailsResponse({
      appointmentId,
      notFound: true,
    });

    if (appointmentId === 'appointment-for-poll-retry-error') {
      // Set a very high poll count to simulate a timeout
      successPollCount = 1000;
    }

    if (appointmentId === 'appointment-for-poll-error') {
      return res.status(500).json(serverError);
    }

    // Check if the request is coming from the details page
    const isDetailsView = req.headers['x-page-type'] === 'details'; // 'details' or 'review-confirm'

    if (
      isDetailsView &&
      appointmentId === 'appointment-for-details-not-found-error'
    ) {
      return res.status(400).json(notFoundError);
    }

    if (isDetailsView && appointmentId === 'appointment-for-details-error') {
      return res.status(500).json(serverError);
    }

    if (isDetailsView) {
      // For details view, immediately return appointment in booked state
      return res.json(mockBookedAppointment);
    }

    // Continue with normal polling behavior for ReviewAndConfirm component
    const count = draftAppointmentPollCount[appointmentId] || 0;

    // Mock polling for appointment state change
    if (count < successPollCount) {
      draftAppointmentPollCount[appointmentId] = count + 1;
    } else {
      // reassign status of mocked appointment to booked to simulate success
      draftAppointmentPollCount[appointmentId] = 0;
      mockAppointment = new MockReferralAppointmentDetailsResponse({
        appointmentId,
        status: 'booked',
      });
    }

    return res.json(mockAppointment);
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
      return res.status(400).json(
        new MockReferralSubmitAppointmentResponse({
          appointmentId: id,
          notFound: true,
        }),
      );
    }

    if (referralNumber === 'appointment-submit-error') {
      return res.status(500).json(
        new MockReferralSubmitAppointmentResponse({
          appointmentId: id,
          serverError: true,
        }),
      );
    }

    draftAppointmentPollCount[id] = 1;
    return res.json(
      new MockReferralSubmitAppointmentResponse({
        appointmentId: id,
      }),
    );
  },
  'GET /data/cms/vamc-ehr.json': (req, res) => {
    return res.json(vamcEhr);
  },
  // Required v0 APIs
  // 'GET /v0/user': transitioningUser, // use this user to test migration alerts
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
        vaProfile: {
          ...cernerUser.data.attributes.vaProfile,
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

module.exports = delay(responses, 1000);
