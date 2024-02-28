/* istanbul ignore file */
/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');
const moment = require('moment');

// var
const confirmedVA = require('./var/confirmed_va.json');
const confirmedCC = require('./var/confirmed_cc.json');
const requests = require('./var/requests.json');
const messages0190 = require('./var/messages_0190.json');
const messages0038 = require('./var/messages_0038.json');
const parentFacilities = require('./var/facilities.json');
const facilities983 = require('./var/facilities_983.json');
const facilities984 = require('./var/facilities_984.json');
const facilities983A6 = require('./var/facilities_983A6.json');
const clinicList983 = require('./var/clinicList983.json');
const clinicList612 = require('./var/clinicList612.json');
const facilityDetails983 = require('./var/facility_details_983.json');
const facilityData = require('./var/facility_data.json');
const ccProviders = require('./var/cc_providers.json');
const sitesSupportingVAR = require('./var/sites-supporting-var.json');
const varSlots = require('./var/slots.json');
const cancelReasons = require('./var/cancel_reasons.json');
const requestEligibilityCriteria = require('./var/request_eligibility_criteria.json');
const directBookingEligibilityCriteria = require('./var/direct_booking_eligibility_criteria.json');
const generateMockSlots = require('./var/slots');

// v2
const requestsV2 = require('./v2/requests.json');
const facilitiesV2 = require('./v2/facilities.json');
const schedulingConfigurationsCC = require('./v2/scheduling_configurations_cc.json');
const schedulingConfigurations = require('./v2/scheduling_configurations.json');
const appointmentSlotsV2 = require('./v2/slots.json');
const clinicsV2 = require('./v2/clinics.json');
const confirmedV2 = require('./v2/confirmed.json');

// Uncomment to produce backend service errors
// const meta = require('./v2/meta_failures.json');

// Returns the meta object without any backend service errors
const meta = require('./v2/meta.json');
const momentTz = require('../../lib/moment-tz');

const features = require('../../utils/featureFlags');

varSlots.data[0].attributes.appointmentTimeSlot = generateMockSlots();
const mockAppts = [];
let currentMockId = 1;

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
  'GET /vaos/v0/appointments': (req, res) => {
    if (req.query.type === 'cc') {
      return res.json(confirmedCC);
    }
    return res.json(confirmedVA);
  },
  'GET /vaos/v0/appointments/va/:id': (req, res) => {
    return res.json({
      data: confirmedVA.data.find(appt => appt.id === req.params.id),
    });
  },
  'GET /vaos/v0/appointment_requests': requests,
  'GET /vaos/v0/appointment_requests/:id': (req, res) => {
    return res.json({
      data: requests.data.find(appt => appt.id === req.params.id),
    });
  },
  'GET /vaos/v0/appointment_requests/:id/messages': (req, res) => {
    const { id } = req.params;
    if (id === '8a48912a6c2409b9016c525a4d490190') {
      return res.json(messages0190);
    }

    if (id === '8a48912a6cab0202016cb4fcaa8b0038') {
      return res.json(messages0038);
    }

    return res.json({ data: [] });
  },
  'GET /vaos/v0/facilities': parentFacilities,
  'GET /vaos/v0/systems/:id/direct_scheduling_facilities': (req, res) => {
    if (req.query.parent_code === '984') {
      return res.json(facilities984);
    }
    if (req.query.parent_code === '983A6') {
      return res.json(facilities983A6);
    }
    return res.json(facilities983);
  },
  'GET /vaos/v0/community_care/eligibility/:id': (req, res) => {
    return res.json({
      data: {
        id: req.param.id,
        type: 'cc_eligibility',
        attributes: { eligible: true },
      },
    });
  },
  'GET /vaos/v0/community_care/supported_sites': sitesSupportingVAR,
  'GET /vaos/v0/facilities/:id/visits/:type': (req, res) => {
    if (req.params.type === 'direct') {
      return res.json({
        data: {
          id: '05084676-77a1-4754-b4e7-3638cb3124e5',
          type: 'facility_visit',
          attributes: {
            durationInMonths: 24,
            hasVisitedInPastMonths: !req.params.id.startsWith('984'),
          },
        },
      });
    }

    return res.json({
      data: {
        id: '05084676-77a1-4754-b4e7-3638cb3124e5',
        type: 'facility_visit',
        attributes: {
          durationInMonths: 12,
          hasVisitedInPastMonths: !req.params.id.startsWith('984'),
        },
      },
    });
  },
  'GET /vaos/v0/facilities/limits': (req, res) => {
    const data = req.query.facility_ids.map(id => ({
      id,
      attributes: {
        numberOfRequests: id.startsWith('983') ? 0 : 1,
        requestLimit: 1,
        institutionCode: id,
      },
    }));

    return res.json({
      data,
    });
  },
  'GET /vaos/v0/facilities/:id/clinics': (req, res) => {
    if (req.params.id === '983') {
      return res.json(clinicList983);
    }
    if (req.params.id.startsWith(612)) {
      return res.json(clinicList612);
    }

    return res.json({
      data: [],
    });
  },
  'GET /v1/facilities/va/:id': (req, res) => {
    const facility = facilityData.data.find(f => f.id === req.params.id);

    return res.json({
      data: facility || facilityDetails983,
    });
  },
  'GET /v1/facilities/va': facilityData,
  'GET /facilities_api/v1/ccp/provider': ccProviders,
  'GET /v1/facilities/ccp/:id': (req, res) => {
    const provider = ccProviders.data.find(p => p.id === req.params.id);
    return res.json({
      data: provider,
    });
  },
  'GET /vaos/v0/facilities/:id/available_appointments': varSlots,
  'GET /vaos/v0/facilities/:id/cancel_reasons': cancelReasons,
  'GET /vaos/v0/request_eligibility_criteria': requestEligibilityCriteria,
  'GET /vaos/v0/direct_booking_eligibility_criteria': directBookingEligibilityCriteria,
  'PUT /vaos/v0/appointments/cancel': {},
  'POST /vaos/v0/appointment_requests': {
    data: {
      id: '8a4886886e4c8e22016e6613216d001g',
      attributes: {},
    },
  },
  'PUT /vaos/v0/appointment_requests/:id': (req, res) => {
    const requestAttributes = requests.data.find(
      item => item.id === req.params.id,
    ).attributes;

    return res.json({
      data: {
        id: req.body.id,
        attributes: {
          ...requestAttributes,
          status: 'Cancelled',
          appointmentRequestDetailCode: [{ detailCode: { code: 'DETCODE8' } }],
        },
      },
    });
  },
  'POST /vaos/v0/appointments': {},
  'POST /vaos/v0/appointment_requests/:id/messages': {
    data: {
      attributes: {},
    },
  },
  'POST /vaos/v2/appointments': (req, res) => {
    const {
      practitioners = [{ identifier: [{ system: null, value: null }] }],
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
    const submittedAppt = {
      id: `mock${currentMockId}`,
      attributes: {
        ...req.body,
        localStartTime: req.body.slot?.id ? localTime : null,
        preferredProviderName: providerNpi ? providerMock[providerNpi] : null,
        physicalLocation:
          selectedClinic[0]?.attributes.physicalLocation || null,
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

    let appt = appointments.find(item => item.id === req.params.id);
    if (req.body.status === 'cancelled') {
      appt = {
        ...appt,
        attributes: {
          ...appt.attributes,
          cancelationReason: { coding: [{ code: 'pat' }] },
        },
      };
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
  'GET /vaos/v2/appointments/:id': (req, res) => {
    const appointments = {
      data: requestsV2.data.concat(confirmedV2.data).concat(mockAppts),
    };
    return res.json({
      data: appointments.data.find(appt => appt.id === req.params.id),
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
    if (!isDirect && !req.query.facility_id.startsWith('983')) {
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
              facility_id: '983',
              is_cerner: false,
            },
            {
              facility_id: '984',
              is_cerner: false,
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
            addressLine2: null,
            addressLine3: null,
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
};

module.exports = delay(responses, 1000);
