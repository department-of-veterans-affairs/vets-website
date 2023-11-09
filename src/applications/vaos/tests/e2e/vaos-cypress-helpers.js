/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
// Location to custom commands type definitions.
/// <reference path="./index.d.ts" />
import unset from 'platform/utilities/data/unset';
import { mockContactInformation } from 'platform/user/profile/vap-svc/util/local-vapsvc';

import moment from '../../utils/business-days';
import * as momentTZ from '../../lib/moment-tz';

import facilityData from '../../services/mocks/var/facility_data.json';

import facilitiesV2 from '../../services/mocks/v2/facilities.json';
import schedulingConfigurations from '../../services/mocks/v2/scheduling_configurations.json';
import clinicsV2 from '../../services/mocks/v2/clinics.json';
import { getStagingId } from '../../services/var';

import featureFlags from '../../utils/featureFlags';

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

/**
 * Function to mock feature toggle endpoint.
 *
 * @example GET '/v0/features_toggles'
 *
 * @export
 * @param {Object} [toggles={}] Feature flags to set/unset
 */
export function mockFeatureToggles(toggles = {}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/v0/feature_toggles',
    },
    req => {
      req.reply({
        data: {
          features: featureFlags.map(feature => {
            if (Object.keys(toggles).includes(feature.name)) {
              return { ...feature, value: toggles[feature.name] };
            }
            return feature;
          }),
        },
      });
    },
  ).as('feature_toggles');
}

export function mockCCProvidersApi({
  response: data,
  responseCode = 200,
} = {}) {
  cy.intercept(
    {
      method: 'GET',
      // url: '/facilities_api/v1/ccp/provider*',
      pathname: '/facilities_api/v1/ccp/provider',
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          forceNetworkError: true,
        });

        return;
      }

      req.reply({ data });
    },
  ).as('v1:get:provider');
}

/**
 * Function to mock the 'GET' appointment endpoint.
 *
 * @example GET '/vaos/v2/appointments/:id'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} arguments.response - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call. Use this to simulate a network error.
 * @param {number} [arguments.version=2] - Api version number.
 */
export function mockAppointmentApi({
  response: data,
  responseCode = 200,
  version = 2,
} = {}) {
  if (version === 2) {
    cy.intercept(
      {
        method: 'GET',
        pathname: `/vaos/v2/appointments/${data.id}`,
      },
      req => {
        if (responseCode !== 200) {
          req.reply({
            forceNetworkError: true,
          });
          return;
        }

        req.reply({ data });
      },
    ).as('v2:get:appointment');
  }
}

/**
 * Function to mock the 'update' appointments endpoint.
 *
 * @example PUT '/vaos/v2/appointments/:id'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} arguments.response - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call. Use this to simulate a network error.
 * @param {number} [arguments.version=2] - Api version number.
 */
export function mockAppointmentUpdateApi({
  response: data,
  responseCode = 200,
  version = 2,
} = {}) {
  if (version === 2) {
    cy.intercept(
      {
        method: 'PUT',
        url: '/vaos/v2/appointments/1',
      },
      req => {
        if (responseCode !== 200) {
          req.reply({
            forceNetworkError: true,
          });
          return;
        }

        req.reply({
          data,
        });
      },
    ).as('v2:update:appointment');
  }
}

/**
 * Function to mock the 'create' appointment endpoint.
 *
 * @example POST '/vaos/v2/appointments'
 *
 * @export
 * @param {Object} arguments
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call. Use this to simulate a network error.
 * @param {number} [arguments.version=2] - Api version number.
 */
export function mockAppointmentCreateApi({
  response: data,
  responseCode = 200,
  version = 2,
} = {}) {
  if (version === 2) {
    cy.intercept(
      {
        method: 'POST',
        pathname: '/vaos/v2/appointments',
      },
      req => {
        if (responseCode !== 200) {
          req.reply({
            forceNetworkError: true,
          });
          return;
        }

        req.reply({
          data,
        });
      },
    ).as('v2:create:appointment');
  }
}

/**
 * Function to mock the 'GET' appointments endpoint.
 *
 * @example GET '/vaos/v2/appointments'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} arguments.response - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call. Use this to simulate a network error.
 * @param {number} [arguments.version=2] - Api version number.
 */
export function mockAppointmentsApi({
  response: data,
  responseCode = 200,
  apiVersion = 2,
} = {}) {
  if (apiVersion === 2) {
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
        if (responseCode !== 200) {
          req.reply({
            forceNetworkError: true,
          });
          return;
        }

        if (data) {
          req.reply({ data });
        }
      },
    ).as('v2:get:appointments');
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

/**
 * Function to mock the 'GET' facilities endpoint.
 *
 * @example GET '/vaos/v2/facilities'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response=] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call. Use this to simulate a network error.
 * @param {number} [arguments.version=2] - Api version number.
 */
export function mockFacilitiesApi({
  response: data,
  responseCode = 200,
  version = 2,
} = {}) {
  if (version === 2) {
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
        if (responseCode !== 200) {
          req.reply({
            forceNetworkError: true,
          });

          return;
        }

        if (data) {
          req.reply({ data });
        } else {
          req.reply(facilitiesV2);
        }
      },
    ).as('v2:get:facilities');
  }
}

/**
 * Function to mock the 'create' appointment endpoint.
 *
 * @example GET '/vaos/v2/scheduling/configuration'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Array.<String>} arguments.facilityIds - Array of facility ids.
 * @param {string=} [arguments.typeOfCareId] - Type of care id.
 * @param {boolean} [arguments.isDirect=false] - Toggle if facility supports direct scheduling or not.
 * @param {boolean} [arguments.isRequest=false] - Toggle if facility supports request scheduling or not.
 */
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
              attributes: {
                communityCare: true,
                ...facility.attributes,
                facilityId: facility.id,
                services,
              },
            };
          });
      } else {
        data = schedulingConfigurations.data;
      }

      req.reply({ data });
    },
  ).as('scheduling-configurations');
}

export function mockEligibilityApi({
  typeOfCare = 'primaryCare',
  isEligible = true,
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
// TODO: Refactor into 'mockCCEligibilityApi'!
export function mockEligibilityCCApi({
  typeOfCare = 'PrimaryCare',
  isEligible: eligible = true,
} = {}) {
  cy.intercept(`/vaos/v2/community_care/eligibility/${typeOfCare}`, req => {
    req.reply({
      data: {
        id: typeOfCare,
        type: 'cc_eligibility',
        attributes: { eligible },
      },
    });
  }).as('eligibility-cc');
}

export function mockClinicApi({
  locationId,
  response: data,
  responseCode = 200,
  version = 2,
} = {}) {
  if (version === 2) {
    cy.intercept(
      {
        method: 'GET',
        path: `/vaos/v2/locations/${locationId}/clinics?clinical_service*`,
      },
      req => {
        if (responseCode !== 200) {
          req.reply({
            forceNetworkError: true,
          });

          return;
        }

        req.reply({
          data,
        });
      },
    ).as(`v2:get:clinics`);
  }
}
/**
 * Function to mock the 'GET' appointment endpoint.
 *
 * @example GET '/vaos/v2/locations/:locationId/clinics'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Array.<String>} [arguments.locations] - Location ids.
 * @param {String=} arguments.clinicId - Clinic id. The clinicId is used to filter the collection of clinics returned in the response.
 * @param {number} [arguments.apiVersion=2] - Api version number.
 */
export function mockClinicsApi({
  clinicId,
  locations = [],
  apiVersion = 2,
} = {}) {
  if (apiVersion === 2) {
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
      ).as('v2:get:clinics');
    });
  }
}

export function mockSlotsApi({
  locationId,
  clinicId,
  response: data,
  responseCode = 200,
  version = 2,
} = {}) {
  if (version === 2) {
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
        if (responseCode !== 200) {
          req.reply({
            forceNetworkError: true,
          });

          return;
        }

        req.reply({
          data,
        });
      },
    ).as('v2:get:slots');
  }
}
export function mockDirectScheduleSlotsApi({
  locationId = '983',
  clinicId,
  start = moment(),
  end = moment(),
  apiVersion = 0,
} = {}) {
  if (apiVersion === 2) {
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
              id: '1',
              type: 'slots',
              attributes: {
                start: start
                  .utc()
                  .add(1, 'day')
                  .format(),
                end: end
                  .utc()
                  .add(1, 'day')
                  .format(),
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

/**
 * Function to add custom Cypress commands.
 *
 * @export
 */
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

export function mockVamcEhrApi({ isCerner = false } = {}) {
  const fieldVamcEhrSystem = isCerner ? 'cerner' : 'vista';

  cy.intercept(
    {
      method: 'GET',
      pathname: '/data/cms/vamc-ehr.json',
    },
    req => {
      req.reply({
        data: {
          nodeQuery: {
            count: 2,
            entities: [
              {
                fieldFacilityLocatorApiId: 'vha_983',
                title: 'Cheyenne VA Medical Center',
                fieldRegionPage: {
                  entity: {
                    title: 'VA Cheyenne health care',
                    fieldVamcEhrSystem,
                  },
                },
              },
              {
                fieldFacilityLocatorApiId: 'vha_984',
                title: 'Dayton VA Medical Center',
                fieldRegionPage: {
                  entity: {
                    title: 'VA Dayton health care',
                    fieldVamcEhrSystem,
                  },
                },
              },
            ],
          },
        },
      });
    },
  ).as('drupal-source-of-truth');
}
