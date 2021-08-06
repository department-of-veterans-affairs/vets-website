/* istanbul ignore file */
/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

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
const generateMockSlots = require('./var/slots.js');

// v2
const requestsV2 = require('./v2/requests.json');
const facilitiesV2 = require('./v2/facilities.json');
const schedulingConfigurationsCC = require('./v2/scheduling_configurations_cc.json');
const schedulingConfigurations = require('./v2/scheduling_configurations.json');
const appointmentSlotsV2 = require('./v2/slots.json');
const clinicsV2 = require('./v2/clinics.json');

varSlots.data[0].attributes.appointmentTimeSlot = generateMockSlots();

const responses = {
  'GET /vaos/v0/appointments': (req, res) => {
    if (req.query.type === 'cc') {
      return res.json(confirmedCC);
    } else {
      return res.json(confirmedVA);
    }
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
    const id = req.params.id;
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
    } else if (req.query.parent_code === '983A6') {
      return res.json(facilities983A6);
    } else {
      return res.json(facilities983);
    }
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
    } else if (req.params.id.startsWith(612)) {
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
  'GET /vaos/v0/preferences': { data: { attributes: { emailAllowed: true } } },
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
  'PUT /vaos/v0/preferences': { data: { attributes: {} } },
  'POST /vaos/v2/appointments': (req, res) => {
    return res.json({
      data: {
        id: '32152',
        attributes: {
          ...req.body,
        },
      },
    });
  },
  'PUT /vaos/v2/appointments/:id': (req, res) => {
    // TODO: also check through confirmed mocks, when those exist
    const requestAttributes = requestsV2.data.find(
      item => item.id === req.params.id,
    ).attributes;

    return res.json({
      data: {
        id: req.params.id,
        attributes: {
          ...requestAttributes,
          ...req.body,
        },
      },
    });
  },
  'GET /vaos/v2/appointments': (req, res) => {
    if (req.query.statuses?.includes('proposed')) {
      return res.json(requestsV2);
    } else if (req.query.statuses?.includes('booked')) {
      return res.json(require('./v2/confirmed.json'));
    }

    return res.json({ data: [] });
  },
  'GET /vaos/v2/appointments/:id': (req, res) => {
    const appointments = {
      data: requestsV2.data.concat(require('./v2/confirmed.json').data),
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
  'GET /vaos/v2/facilities/:id': (req, res) => {
    return res.json({
      data: facilitiesV2.data.find(facility => facility.id === req.params.id),
    });
  },
  'GET /vaos/v2/facilities': (req, res) => {
    const ids = req.query.ids;
    const children = req.query.children;

    return res.json({
      data: facilitiesV2.data.filter(
        facility =>
          ids.includes(facility.id) ||
          (children && ids.some(id => facility.id.startsWith(id))),
      ),
    });
  },
  'GET /vaos/v2/locations/:facility_id/clinics/:clinic_id/slots': appointmentSlotsV2,
  'GET /vaos/v2/patient': (req, res) => {
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
      },
    },
    meta: { errors: null },
  },

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },

  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        { name: 'facilityLocatorShowCommunityCares', value: true },
        { name: 'profile_show_profile_2.0', value: false },
        { name: 'vaOnlineScheduling', value: true },
        { name: 'vaOnlineSchedulingCancel', value: true },
        { name: 'vaOnlineSchedulingRequests', value: true },
        { name: 'vaOnlineSchedulingCommunityCare', value: true },
        { name: 'vaOnlineSchedulingDirect', value: true },
        { name: 'vaOnlineSchedulingPast', value: true },
        { name: 'vaOnlineSchedulingExpressCare', value: true },
        { name: 'vaOnlineSchedulingFlatFacilityPage', value: true },
        { name: 'vaOnlineSchedulingProviderSelection', value: true },
        { name: 'vaOnlineSchedulingHomepageRefresh', value: true },
        { name: 'vaOnlineSchedulingUnenrolledVaccine', value: true },
        { name: 'vaGlobalDowntimeNotification', value: false },
        { name: 'vaOnlineSchedulingVAOSServiceRequests', value: true },
        { name: 'vaOnlineSchedulingVAOSServiceVAAppointments', value: true },
        { name: 'vaOnlineSchedulingFacilitiesServiceV2', value: true },
        { name: 'vaOnlineSchedulingVAOSServiceCCAppointments', value: true },
        { name: 'vaOnlineSchedulingVariantTesting', value: false },
        { name: 'ssoe', value: true },
        { name: 'ssoeInbound', value: false },
        { name: 'ssoeEbenefitsLinks', value: false },
        { name: 'edu_section_103', value: true },
        { name: 'vaViewDependentsAccess', value: false },
        { name: 'gibctEybBottomSheet', value: true },
      ],
    },
  },
};

module.exports = delay(responses, 1000);
