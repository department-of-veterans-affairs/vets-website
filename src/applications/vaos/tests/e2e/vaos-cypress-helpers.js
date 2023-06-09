/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import unset from 'platform/utilities/data/unset';
import { mockContactInformation } from 'platform/user/profile/vap-svc/util/local-vapsvc';

import moment from '../../utils/business-days';
import * as momentTZ from '../../lib/moment-tz';

import confirmedVA from '../../services/mocks/var/confirmed_va.json';
import confirmedCC from '../../services/mocks/var/confirmed_cc.json';
import requests from '../../services/mocks/var/requests.json';
import cancelReasons from '../../services/mocks/var/cancel_reasons.json';
import supportedSites from '../../services/mocks/var/sites-supporting-var.json';
import facilities from '../../services/mocks/var/facilities.json';
import facilityData from '../../services/mocks/var/facility_data.json';
import clinicList983 from '../../services/mocks/var/clinicList983.json';
import requestEligibilityCriteria from '../../services/mocks/var/request_eligibility_criteria.json';
import directEligibilityCriteria from '../../services/mocks/var/direct_booking_eligibility_criteria.json';

import { getVAAppointmentMock } from '../mocks/v0';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import facilitiesV2 from '../../services/mocks/v2/facilities.json';
import schedulingConfigurations from '../../services/mocks/v2/scheduling_configurations.json';
import clinicsV2 from '../../services/mocks/v2/clinics.json';
import confirmedV2 from '../../services/mocks/v2/confirmed.json';
import requestsV2 from '../../services/mocks/v2/requests.json';
import { getStagingId } from '../../services/var';

const mockUser = {
  data: {
    id: '',
    type: 'users_scaffolds',
    attributes: {
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'form-save-in-progress',
        'form-prefill',
        'evss-claims',
        'form526',
        'user-profile',
        'appeals-status',
        'identity-proofed',
      ],
      account: {
        accountUuid: '6af59b36-f14d-482e-88b4-3d7820422343',
      },
      profile: {
        email: 'vets.gov.user+228@gmail.com',
        firstName: 'MARK',
        middleName: null,
        lastName: 'WEBB',
        birthDate: '1950-10-04',
        gender: 'M',
        zip: null,
        lastSignedIn: '2020-06-18T21:15:19.664Z',
        loa: {
          current: 3,
          highest: 3,
        },
        multifactor: true,
        verified: true,
        signIn: {
          serviceName: 'idme',
          accountType: 'N/A',
        },
        authnContext: 'http://idmanagement.gov/ns/assurance/loa/3/vets',
      },
      vaProfile: {
        status: 'OK',
        birthDate: '19501004',
        familyName: 'Webb-ster',
        gender: 'M',
        givenNames: ['Mark'],
        isCernerPatient: false,
        facilities: [
          {
            facilityId: '556',
            isCerner: false,
          },
          {
            facilityId: '668',
            isCerner: false,
          },
          {
            facilityId: '983QA',
            isCerner: false,
          },
          {
            facilityId: '983GB',
            isCerner: false,
          },
        ],
        vaPatient: true,
        mhvAccountState: 'NONE',
      },
      veteranStatus: null,
      inProgressForms: [],
      prefillsAvailable: [
        '21-686C',
        '40-10007',
        '22-1990',
        '22-1990N',
        '22-1990E',
        '22-1995',
        '22-1995S',
        '22-5490',
        '22-5495',
        '22-0993',
        '22-0994',
        'FEEDBACK-TOOL',
        '22-10203',
        '21-526EZ',
        '1010ez',
        '21P-530',
        '21P-527EZ',
        '686C-674',
        '20-0996',
        'MDOT',
      ],
      vet360ContactInformation: mockContactInformation,
    },
  },
  meta: {
    errors: [
      {
        externalService: 'EMIS',
        startTime: '2020-06-18T21:15:34Z',
        endTime: null,
        description:
          'IOError, Betamocks default response requested but none exist. Please create one at: [/cache/emis/veteran_status/default.yml]., Betamocks default response requested but none exist. Please create one at: [/cache/emis/veteran_status/default.yml].',
        status: 503,
      },
    ],
  },
};

function createPastVAAppointments() {
  const appointments = [];
  let appointment = getVAAppointmentMock();
  appointment.attributes = {
    ...appointment.attributes,
    startDate: moment()
      .add(-3, 'days')
      .format(),
    clinicFriendlyName: 'Three day clinic name',
    facilityId: '983',
    sta6aid: '983GC',
  };
  appointment.attributes.vdsAppointments[0].currentStatus = 'CHECKED OUT';
  appointments.push(appointment);

  appointment = getVAAppointmentMock();
  appointment.attributes = {
    ...appointment.attributes,
    startDate: moment()
      .add(-4, 'months')
      .format(),
    clinicFriendlyName: 'Four month clinic name',
    facilityId: '983',
    sta6aid: '983GC',
  };
  appointment.attributes.vdsAppointments[0].currentStatus = 'CHECKED OUT';
  appointments.push(appointment);

  return {
    data: appointments,
  };
}

function updateConfirmedVADates(data) {
  data.data.forEach(item => {
    const futureDateStr = moment()
      .add(3, 'days')
      .toISOString();

    item.attributes.startDate = futureDateStr;
    if (item.attributes.vdsAppointments[0]) {
      item.attributes.vdsAppointments[0].appointmentTime = futureDateStr;
    } else {
      item.attributes.vvsAppointments[0].dateTime = futureDateStr;
    }
  });
  return data;
}

function updateConfirmedCCDates(data) {
  data.data.forEach(item => {
    const futureDateStr = moment()
      .add(4, 'days')
      .format('MM/DD/YYYY HH:mm:ss');

    item.attributes.appointmentTime = futureDateStr;
  });
  return data;
}

function updateRequestDates(data) {
  data.data.forEach(item => {
    const futureDateStr = moment()
      .add(5, 'days')
      .format('MM/DD/YYYY');

    item.attributes.optionDate1 = futureDateStr;
  });
  return data;
}

export function mockFeatureToggles({
  v2Requests = false,
  v2Facilities = false,
  v2DirectSchedule = false,
} = {}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/v0/feature_toggles',
    },
    req => {
      req.reply({
        data: {
          features: [
            {
              name: 'vaOnlineScheduling',
              value: true,
            },
            {
              name: 'vaOnlineSchedulingCancel',
              value: true,
            },
            {
              name: 'vaOnlineSchedulingRequests',
              value: true,
            },
            {
              name: 'vaOnlineSchedulingCommunityCare',
              value: true,
            },
            {
              name: 'vaOnlineSchedulingDirect',
              value: true,
            },
            {
              name: 'vaOnlineSchedulingPast',
              value: true,
            },
            {
              name: `cerner_override_668`,
              value: false,
            },
            {
              name: 'vaOnlineSchedulingVAOSServiceRequests',
              value: v2Requests,
            },
            {
              name: 'vaOnlineSchedulingVAOSServiceVAAppointments',
              value: v2DirectSchedule,
            },
            {
              name: 'vaOnlineSchedulingFacilitiesServiceV2',
              value: v2Facilities,
            },
            { name: 'vaOnlineSchedulingStatusImprovement', value: false },
            { name: 'vaOnlineSchedulingClinicFilter', value: true },
            {
              name: 'vaOnlineSchedulingVAOSServiceCCAppointments',
              value: true,
            },
          ],
        },
      });
    },
  ).as('feature_toggles');
}

export function mockRequestLimitsApi(id = '983') {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vaos/v0/facilities/limits',
    },
    req => {
      req.reply({
        data: [
          {
            id,
            attributes: {
              requestLimit: 1,
              numberOfRequests: 0,
            },
          },
        ],
      });
    },
  ).as('v0:get:limits');
}

export function mockSupportedSitesApi() {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vaos/v0/community_care/supported_sites',
    },
    req => {
      req.reply(supportedSites);
    },
  ).as('v0:get:supported_sites');
}

export function mockRequestEligibilityCriteriaApi() {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vaos/v0/request_eligibility_criteria',
    },
    req => req.reply(requestEligibilityCriteria),
  ).as('v0:get:request_eligibility_criteria');
}

export function mockDirectBookingEligibilityCriteriaApi({
  facilityIds,
  typeOfCareId = '349',
  unableToScheduleCovid = false,
} = {}) {
  if (unableToScheduleCovid) {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v0/direct_booking_eligibility_criteria',
      },
      req =>
        req.reply({
          data: directEligibilityCriteria.data.map(facility => ({
            ...facility,
            attributes: {
              ...facility.attributes,
              coreSettings: facility.attributes.coreSettings.filter(
                f => f.id !== 'covid',
              ),
            },
          })),
        }),
    ).as('v0:get:direct_booking_eligibility_criteria');
  } else {
    let data;

    if (facilityIds && typeOfCareId) {
      data = directEligibilityCriteria.data
        .filter(facility => facilityIds.some(id => id === facility.id))
        .map(facility => {
          const coreSettings = facility.attributes.coreSettings
            .map(
              setting =>
                setting.id === typeOfCareId
                  ? { ...setting, patientHistoryRequired: 'no' }
                  : null,
            )
            // Remove all falsey values from array
            .filter(Boolean);

          return {
            ...facility,
            attributes: {
              ...facility.attributes,
              coreSettings,
            },
          };
        });
    } else {
      data = [...directEligibilityCriteria.data];
    }

    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v0/direct_booking_eligibility_criteria',
      },
      req => {
        // req.reply(directEligibilityCriteria);
        req.reply({ data });
      },
    ).as('v0:get:direct_booking_eligibility_criteria');
  }
}

export function mockVisitsApi({ facilityId = '983' } = {}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: `/vaos/v0/facilities/${facilityId}/visits/direct`,
    },
    req =>
      req.reply({
        data: {
          facilityId: '05084676-77a1-4754-b4e7-3638cb3124e5',
          type: 'facility_visit',
          attributes: {
            durationInMonths: 24,
            hasVisitedInPastMonths: true,
          },
        },
      }),
  ).as('v0:get:visits:direct');
  cy.intercept(
    {
      method: 'GET',
      pathname: `/vaos/v0/facilities/${facilityId}/visits/request`,
    },
    req =>
      req.reply({
        data: {
          id: '05084676-77a1-4754-b4e7-3638cb3124e5',
          type: 'facility_visit',
          attributes: {
            durationInMonths: 24,
            hasVisitedInPastMonths: true,
          },
        },
      }),
  ).as('v0:get:visits:request');
}

export function mockCCProvidersApi() {
  cy.intercept(
    {
      method: 'GET',
      // url: '/facilities_api/v1/ccp/provider*',
      pathname: '/facilities_api/v1/ccp/provider',
    },
    req => {
      req.reply({
        data: [
          {
            id: '1497723753',
            type: 'provider',
            attributes: {
              accNewPatients: 'true',
              address: {
                street: '1012 14TH ST NW STE 700',
                city: 'WASHINGTON',
                state: 'DC',
                zip: '20005-3477',
              },
              caresitePhone: '202-638-0750',
              email: null,
              fax: null,
              gender: 'Male',
              lat: 38.903195,
              long: -77.032382,
              name: 'Doe, Jane',
              phone: null,
              posCodes: null,
              prefContact: null,
              uniqueId: '1497723753',
            },
            relationships: {
              specialties: {
                data: [
                  { id: '363L00000X', type: 'specialty' },
                  { id: '363LP2300X', type: 'specialty' },
                ],
              },
            },
          },
        ],
      });
    },
  ).as('v1:get:provider');
}

export function mockAppointmentApi({ data, id } = {}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: `/vaos/v2/appointments/${id}`,
    },
    req => {
      req.reply({ data });
    },
  ).as('v2:get:appointment');
}

export function mockAppointmentsApi({
  data,
  status = APPOINTMENT_STATUS.booked,
  apiVersion = 2,
} = {}) {
  if (apiVersion === 0) {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v0/appointments',
        query: { start_date: '*', end_date: '*', type: 'va' },
      },
      req => {
        const appointments = updateConfirmedVADates(confirmedVA).data.concat(
          createPastVAAppointments().data,
        );
        req.reply({
          data: appointments,
        });
      },
    ).as('v0:get:appointments:va');

    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v0/appointments',
        query: { start_date: '*', end_date: '*', type: 'cc' },
      },
      req => {
        req.reply({
          data: updateConfirmedCCDates(confirmedCC).data,
        });
      },
    ).as('v0:get:appointments:cc');

    cy.intercept(
      {
        method: 'POST',
        pathname: '/vaos/v0/appointments',
      },
      req => {
        req.reply({});
      },
    ).as('v0:create:appointment');
    cy.intercept(
      {
        method: 'PUT',
        url: '/vaos/v0/appointments/cancel',
      },
      req => req.reply({ data: '' }),
    ).as('v0:cancel:appointment');
  } else if (apiVersion === 2) {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v2/appointments',
        query: {
          _include: '*',
          start: '*',
          end: '*',
        },
      },
      req => {
        if (data) {
          req.reply({ data });
        } else if (status === APPOINTMENT_STATUS.booked) {
          req.reply({
            data: confirmedV2.data,
          });
        } else if (status === APPOINTMENT_STATUS.pending) {
          req.reply({ data: requestsV2.data.filter(r => r.id === '25957') });
        } else req.reply({});
      },
    ).as('v2:get:appointments');

    cy.intercept(
      {
        method: 'PUT',
        url: '/vaos/v2/appointments/1',
      },
      req => req.reply({ data: '' }),
    ).as('v2:cancel:appointment');

    cy.intercept(
      {
        method: 'POST',
        pathname: '/vaos/v2/appointments',
      },
      req => {
        // Save and return the same appointment back to the caller with a new simulated
        // appointment id. The saved appointment is used in the next 'v2:get:appointment'
        // api call.
        const newAppointment = {
          data: {
            id: 'mock1',
            attributes: {
              ...req.body,
              start: req.body.slot ? req.body.slot.start : null,
              cancellable: req.body.status,
            },
          },
        };

        req.reply(newAppointment);
      },
    ).as('v2:create:appointment');
  }
}

export function mockAppointmentRequestsApi({ id = 'testing' } = {}) {
  if (id) {
    cy.intercept(
      {
        method: 'GET',
        pathname: `/vaos/v0/appointment_requests/${id}`,
      },
      req =>
        req.reply({
          // TODO: Create a CC appointment with id = testing
          data: requests.data[1],
        }),
    ).as('v0:get:appointment:request');
  }
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vaos/v0/appointment_requests',
    },
    req => req.reply(updateRequestDates(requests)),
  ).as('v0:get:appointment:requests');

  cy.intercept(
    {
      method: 'POST',
      pathname: '/vaos/v0/appointment_requests',
    },
    req =>
      req.reply({
        data: {
          id: 'testing',
          attributes: {},
        },
      }),
  ).as('v0:create:appointment:request');
}

export function mockCancelReasonsApi({ facilityId }) {
  if (facilityId) {
    const id = Array.isArray(facilityId) ? facilityId[0] : facilityId;
    cy.intercept(
      {
        method: 'GET',
        pathname: `/vaos/v0/facilities/${id}/cancel_reasons`,
      },
      req => {
        req.reply(cancelReasons);
      },
    ).as('v0:get:facility:cancel_reason');
  }
}

export function mockFacilityApi({ id, apiVersion = 1 } = {}) {
  if (apiVersion === 1) {
    if (id) {
      const facilityId = Array.isArray(id) ? id[0] : id;
      cy.intercept(
        {
          method: 'GET',
          pathname: `/v1/facilities/va/vha_${getStagingId(facilityId)}`,
        },
        req => {
          req.reply({
            data: facilityData.data.find(f => {
              return f.id
                .replace('442', '983')
                .replace('552', '984')
                .includes(facilityId);
            }),
          });
        },
      ).as('v1:get:facility');
    }
  } else if (apiVersion === 2) {
    cy.intercept(
      {
        method: 'GET',
        pathname: `/vaos/v2/facilities/${id}`,
      },
      req => {
        const facility = facilitiesV2.data.find(f => f.id === id);
        req.reply({
          data: facility,
        });
      },
    ).as(`v2:get:facility`);
  }
}

export function mockFacilitiesApi({ count, data, apiVersion = 0 }) {
  if (apiVersion === 0) {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v0/facilities',
        query: {
          'facility_codes[]': '*',
        },
      },
      req => {
        const f = facilities.data.slice(0, count);
        req.reply({ data: f });
      },
    ).as('v0:get:facilities');
  } else if (apiVersion === 1) {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/v1/facilities/va',
      },
      req => {
        const tokens = req.query.ids.split(',');
        let filteredFacilities = tokens.map(token => {
          // NOTE: Convert test facility ids to real ids
          return facilityData.data.find(f => {
            return f.id === token.replace('983', '442').replace('984', '552');
          });
        });

        // Remove 'falsey' values
        filteredFacilities = filteredFacilities.filter(Boolean);
        // TODO: remove the harded coded id.
        // req.reply({
        //   data: facilityData.data.filter(f => f.id === 'vha_442GC'),
        // });
        // const f = facilities.data.slice(0);
        req.reply({ data: filteredFacilities });
      },
    ).as(`v1:get:facilities`);
  } else if (apiVersion === 2) {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v2/facilities',
        query: {
          children: '*',
          'ids[]': '*',
        },
      },
      req => {
        if (data) {
          req.reply({ data });
        } else {
          req.reply(facilitiesV2);
        }
      },
    ).as('v2:get:facilities');
  }
}

export function mockSchedulingConfigurationApi({
  facilityIds,
  typeOfCareId = null,
  isDirect = false,
  isRequest = false,
} = {}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vaos/v2/scheduling/configurations*',
    },
    req => {
      let data;

      if (facilityIds && typeOfCareId) {
        data = schedulingConfigurations.data
          .filter(facility =>
            facilityIds.some(id => {
              return id === facility.id;
              // return id === getRealFacilityId(facility.id);
            }),
          )
          .map(facility => {
            const services = facility.attributes.services
              .map(
                service =>
                  service.id === typeOfCareId
                    ? {
                        ...service,
                        direct: { ...service.direct, enabled: isDirect },
                        request: { ...service.request, enabled: isRequest },
                      }
                    : null,
              )
              // Remove all falsey values from array
              .filter(Boolean);

            return {
              ...facility,
              id: facility.id,
              // id: getRealFacilityId(facility.id),
              attributes: {
                communityCare: true,
                ...facility.attributes,
                facilityId: facility.id,
                // facililtyId: getRealFacilityId(facility.id),
                services,
              },
            };
          });
      } else {
        data = schedulingConfigurations.data;
      }

      req.reply({ data });

      // if (facilityIds && typeOfCareId) {
      //   let data = facilityIds.map(facilityId => {
      //     const config = schedulingConfigurations.data.find(
      //       facility => facility.id === facilityId,
      //     );

      //     if (config) {
      //       const services = config.attributes.services.map(
      //         setting =>
      //           setting.id === typeOfCareId
      //             ? {
      //                 ...setting,
      //                 direct: { ...setting.direct, enabled: isDirect },
      //                 request: { ...setting.request, enabled: isRequest },
      //               }
      //             : setting,
      //       );
      //       config.attributes.services = services;

      //       return config;
      //     }

      //     return null;
      //   });

      //   // Remove all falsey values from array
      //   data = data.filter(Boolean);
      // req.reply({
      //   data,
      // });
    },
  ).as('scheduling-configurations');
}

export function mockEligibilityApi({
  typeOfCare = 'primaryCare',
  isEligible = false,
  apiVersion = 2,
} = {}) {
  if (apiVersion === 2) {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v2/eligibility',
        query: { facility_id: '*', clinical_service_id: '*', type: '*' },
      },
      req => {
        // let { data } = requestEligibilityCriteria;
        // if (req.query.type === 'direct') {
        // data = directEligibilityCriteria.data;
        req.reply({
          data: {
            id: req.query.facility_id,
            type: 'eligibility',
            attributes: {
              clinicalServiceId: typeOfCare,
              eligible: isEligible,
              type: req.query.type,
            },
          },
        });
        //   req.reply({
        //     data,
        //   });
      },
    ).as('v2:get:eligibility');
  }
}

export function mockCCEligibilityApi({
  typeOfCare = 'PrimaryCare',
  isEligible = true,
} = {}) {
  cy.intercept(
    {
      method: 'GET',
      url: `/vaos/v0/community_care/eligibility/${typeOfCare}`,
    },
    req => {
      req.reply({
        data: {
          id: typeOfCare,
          type: 'cc_eligibility',
          attributes: { eligible: isEligible },
        },
      });
    },
  ).as('v0:get:cc-eligibility');
}

export function mockClinicApi({
  clinicId,
  facilityId,
  locations = [],
  apiVersion = 2,
} = {}) {
  if (apiVersion === 0) {
    cy.intercept(
      {
        method: 'GET',
        pathname: `/vaos/v0/facilities/${facilityId}/clinics`,
      },
      req => {
        req.reply({ data: clinicList983.data });
      },
    ).as('v0:get:clinics');
  } else if (apiVersion === 2) {
    locations.forEach(locationId => {
      let { data } = clinicsV2;
      if (clinicId) data = data.filter(clinic => clinic.id === clinicId);

      cy.intercept(
        {
          method: 'GET',
          path: `/vaos/v2/locations/${locationId}/clinics?clinical_service*`,
        },
        req => {
          req.reply({
            data,
          });
        },
      ).as(`v2:get:clinics`);

      cy.intercept(
        {
          method: 'GET',
          // path: `/vaos/v2/locations/${locationId}/clinics\\?clinic_ids[]**`,
          path: `/vaos/v2/locations/${locationId}/clinics\\?clinic_ids%5B%5D**`,
        },
        req => {
          req.reply({
            data,
          });
        },
      ).as('v2:get:clinic');
    });
  }
}

export function mockDirectScheduleSlotsApi({
  locationId = '983',
  clinicId,
  start = moment(),
  end = moment(),
  apiVersion = 0,
} = {}) {
  if (apiVersion === 0) {
    const data = [
      {
        id: '1',
        type: 'slot',
        attributes: {
          appointmentTimeSlot: [
            {
              bookingStatus: '1',
              remainingAllowedOverBookings: '3',
              availability: true,
              startDateTime: start.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
              endDateTime: end.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
            },
          ],
        },
      },
    ];

    cy.intercept(
      {
        method: 'GET',
        url: '/vaos/v0/facilities/983/available_appointments*',
      },
      req => {
        req.reply({
          data,
        });
      },
    ).as('v0:get:slots');
  } else if (apiVersion === 2) {
    cy.intercept(
      {
        method: 'GET',
        pathname: `/vaos/v2/locations/${locationId}/clinics/${clinicId}/slots`,
        query: {
          start: '*',
          end: '*',
        },
      },
      req => {
        req.reply({
          data: [
            {
              id: '123',
              type: 'slots',
              attributes: {
                start: start.utc().format(),
                end: end.utc().format(),
              },
            },
          ],
        });
      },
    ).as('v2:get:slots');
  }
}

export function mockLoginApi({
  facilityId = '983',
  withoutAddress = false,
} = {}) {
  if (facilityId) {
    const user = {
      ...mockUser,
      data: {
        ...mockUser.data,
        attributes: {
          ...mockUser.data.attributes,
          vaProfile: {
            ...mockUser.data.attributes.vaProfile,
            facilities: [
              ...mockUser.data.attributes.vaProfile.facilities,
              { facilityId },
            ],
          },
        },
      },
    };
    cy.login(user);
  } else if (withoutAddress) {
    const mockUserWithoutAddress = unset(
      'data.attributes.vet360ContactInformation.residentialAddress.addressLine1',
      mockUser,
    );
    cy.login(mockUserWithoutAddress);
  } else {
    cy.login(mockUser);
  }
}

export function mockUserTransitionAvailabilities({ version = 0 } = {}) {
  if (version === 0) {
    cy.intercept(
      {
        method: 'GET',
        pathname: `/v0/user_transition_availabilities`,
      },
      req => {
        req.reply({
          data: {
            organicModal: false,
            credentialType: 'idme',
          },
        });
      },
    ).as('v0:get:user_transition');
  }
}

export function vaosSetup() {
  Cypress.Commands.add('axeCheckBestPractice', (context = 'main') => {
    cy.axeCheck(context, {
      runOnly: {
        type: 'tag',
        values: [
          'section508',
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa',
          'best-practice',
        ],
      },
    });
  });

  Cypress.Commands.add('assertRequestedPeriod', (date, timezone = null) => {
    // Check for null date since creating a moment with null will use the current date.
    if (date === null || date === undefined)
      throw new Error('Request period is null. Expected date string.');

    // Strip timezone information.
    const requestedDate = timezone ? moment(date) : momentTZ.parseZone(date);

    if (!requestedDate.isValid()) return false;
    // Using custom momentjs wrapper functions 'addBusinessDay' and 'addBusinessMonth'. These functions
    // will check to see if adding 5 days to the current date falls on a Sat or Sun. If so, add 1 or 2
    // days to get to Mon since appointment request are only available Mon thru Fri.
    let testDate = moment().addBusinessDay(5, 'd');

    // Add 1 month to account for the test clicking the 'next' button.
    testDate.addBusinessMonth(1);

    // Convert date timezone to that of the facility for scheduled appointment
    if (timezone) {
      testDate = moment
        .tz(testDate.format('YYYY-MM-DDTHH:mm:ss'), 'America/Denver')
        .utc();
    }

    Cypress.log({
      name: 'assertRequestedPeriod',
      // shorter name for the Command Log
      displayName: 'assertRequestedPeriod',
      message: `Requested appointment date: ${requestedDate.format()}, test date: ${testDate.format()}`,
      consoleProps: () => {
        // return an object which will
        // print to dev tools console on click
        return {
          Value: date,
        };
      },
    });

    // eslint-disable-next-line no-unused-expressions
    expect(requestedDate.isSame(testDate, 'day')).to.ok;
    return true;
  });
}
