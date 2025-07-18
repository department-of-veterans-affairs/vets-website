/* eslint-disable camelcase */
// Location to custom commands type definitions.
/// <reference path="./index.d.ts" />

import schedulingConfigurations from '../../services/mocks/v2/scheduling_configurations.json';
import featureFlags from '../../services/mocks/featureFlags';

/**
 * Function to mock feature toggle endpoint.
 *
 * @example GET '/v0/features_toggles'
 *
 * @export
 * @param {Object} [toggles={}] Feature flags to set/unset
 */
export function mockFeatureToggles(
  toggles = {
    vaOnlineSchedulingRecentLocationsFilter: false,
    vaOnlineSchedulingCCDirectScheduling: false,
  },
) {
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
  ).as('v0:get:feature_toggles');
}

/**
 * Function to mock the 'GET' community care providers endpoint.
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockCCProvidersApi({
  response: data,
  responseCode = 200,
} = {}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/facilities_api/v2/ccp/provider',
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: '404 Not Found',
          statusCode: 404,
        });

        return;
      }

      req.reply({ data });
    },
  ).as('v2:get:provider');
}

/**
 * Function to mock the 'GET' appointment endpoint.
 *
 * @example GET '/vaos/v2/appointments/:id'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockAppointmentGetApi({ response: data, responseCode = 200 }) {
  cy.intercept(
    {
      method: 'GET',
      pathname: `/vaos/v2/appointments/${data.id}`,
      query: {
        _include: '*',
      },
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: '404 Not Found',
          statusCode: 404,
        });
        return;
      }

      req.reply({ data });
    },
  ).as('v2:get:appointment');
}

/**
 * Function to mock the 'update' appointments endpoint.
 *
 * @example PUT '/vaos/v2/appointments/:id'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockAppointmentUpdateApi({
  response: data,
  responseCode = 200,
}) {
  cy.intercept(
    {
      method: 'PUT',
      url: '/vaos/v2/appointments/1',
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: '404 Not Found',
          statusCode: 404,
        });
        return;
      }

      req.reply({
        data,
      });
    },
  ).as('v2:update:appointment');
}

/**
 * Function to mock the 'CREATE' appointment endpoint.
 *
 * @example POST '/vaos/v2/appointments'
 *
 * @export
 * @param {Object} arguments
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockAppointmentCreateApi({
  response: data,
  responseCode = 200,
}) {
  cy.intercept(
    {
      method: 'POST',
      pathname: '/vaos/v2/appointments',
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: '404 Not Found',
          statusCode: 404,
        });
        return;
      }

      req.reply({
        data,
      });
    },
  ).as('v2:create:appointment');
}

/**
 * Function to mock the 'GET' appointments endpoint.
 *
 * @example GET '/vaos/v2/appointments'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockAppointmentsGetApi({ response: data, responseCode = 200 }) {
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
          body: '404 Not Found',
          statusCode: 404,
        });
        return;
      }

      if (data) {
        req.reply({
          data: data.flat().map((resp, index) => resp.setId(index + 1)),
        });
      }
    },
  ).as('v2:get:appointments');
}

/**
 * Function to mock the 'GET' facility endpoint.
 *
 * @example GET '/vaos/v2/facilities/:id'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {String} arguments.id - The facility id.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockFacilityApi({ id, response: data, responseCode = 200 }) {
  cy.intercept(
    {
      method: 'GET',
      pathname: `/vaos/v2/facilities/${id}`,
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: '404 Not Found',
          statusCode: 404,
        });

        return;
      }

      req.reply({
        data,
      });
    },
  ).as(`v2:get:facility`);
}

/**
 * Function to mock the 'GET' facilities endpoint.
 *
 * @example GET '/vaos/v2/facilities'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockFacilitiesApi({ response: data, responseCode = 200 }) {
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
          body: '404 Not Found',
          statusCode: 404,
        });

        return;
      }

      if (data) {
        req.reply({
          data,
        });
      }
    },
  ).as('v2:get:facilities');
}

/**
 * Function to mock the 'GET' facility configuration endpoint.
 *
 * @example GET '/vaos/v2/scheduling/configuration'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Array.<String>} [arguments.facilityIds] - Array of facility ids.
 * @param {string=} [arguments.typeOfCareId] - Type of care id.
 * @param {boolean} [arguments.isDirect=false] - Toggle if facility supports direct scheduling or not.
 * @param {boolean} [arguments.isRequest=false] - Toggle if facility supports request scheduling or not.
 * @param {Object} [arguments.overrideDirect={}] - Override the direct scheduling configuration value.
 */
export function mockSchedulingConfigurationApi({
  facilityIds,
  typeOfCareId = null,
  isDirect = false,
  isRequest = false,
  overrideDirect = {},
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
                        direct: {
                          ...service.direct,
                          enabled: isDirect,
                          ...overrideDirect,
                        },
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
  ).as('v2:get:scheduling-configurations');
}

/**
 * Function to mock the 'GET' eligibility endpoint.
 *
 * @example GET '/vaos/v2/eligibility'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockEligibilityApi({ response: data, responseCode = 200 }) {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vaos/v2/eligibility',
      query: { facility_id: '*', clinical_service_id: '*', type: '*' },
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: '404 Not Found',
          statusCode: 404,
        });

        return;
      }

      req.reply({
        data: {
          ...data,
          attributes: {
            ...data.attributes,
            type: data.attributes?.type || req.query.type,
          },
        },
      });
    },
  ).as('v2:get:eligibility');
}

/**
 * Convience function to mock the 'GET' elligibility endpoint for direct scheduling.
 *
 * @example GET '/vaos/v2/eligibility?facility_id=*&clinical_service_id=*&type=direct'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockEligibilityDirectApi({
  response: data,
  responseCode = 200,
}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vaos/v2/eligibility',
      query: { facility_id: '*', clinical_service_id: '*', type: 'direct' },
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: '404 Not Found',
          statusCode: 404,
        });

        return;
      }

      req.reply({
        data,
      });
    },
  ).as('v2:get:eligibility:direct');
}

/**
 * Convience function to mock the 'GET' elligibility endpoint for request scheduling.
 *
 * @example GET '/vaos/v2/eligibility?facility_id=*&clinical_service_id=*&type=request'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockEligibilityRequestApi({
  response: data,
  responseCode = 200,
}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vaos/v2/eligibility',
      query: { facility_id: '*', clinical_service_id: '*', type: 'request' },
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: '404 Not Found',
          statusCode: 404,
        });

        return;
      }

      req.reply({
        data,
      });
    },
  ).as('v2:get:eligibility:request');
}

/**
 * Function to mock the 'GET' community care eligibility endpoint. This function is
 * used to determine if a veteran is eligible to schedule CC appointments for the
 * given type of care or not.
 *
 * @example GET '/vaos/v2/community_care/eligibility/:cceType'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {String} arguments.cceType - Community care eligibility type code.
 * @param {Boolean} [arguments.isEligible=true] - Flag to determine CC eligibility
 */
export function mockEligibilityCCApi({ cceType, isEligible: eligible = true }) {
  cy.intercept(`/vaos/v2/community_care/eligibility/${cceType}`, req => {
    req.reply({
      data: {
        id: cceType,
        type: 'cc_eligibility',
        attributes: { eligible },
      },
    });
  }).as('v2:get:eligibility-cc');
}

/**
 * Function to mock the 'GET' clinics endpoint. This function is used get all
 * clinics associated with the given facility/location.
 *
 * @example GET '/vaos/v2/locations/:locationId/clinics'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {String} arguments.locationId - Location id.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockClinicsApi({
  locationId,
  response: data,
  responseCode = 200,
}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: `/vaos/v2/locations/${locationId}/clinics`,
    },
    req => {
      if (responseCode !== 200) {
        req.reply({
          body: '404 Not Found',
          statusCode: 404,
        });

        return;
      }

      req.reply({
        data,
      });
    },
  ).as(`v2:get:clinics`);
}

/**
 * Function to mock the 'GET' clinic available appointment slots endpoint.
 *
 * @example GET '/vaos/v2/locations/:locationId/clinics/:clinicId/slots'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {string} arguments.locationId - Location/facility id. The mocked facility id should be used here.
 * @param {string} arguments.clinicId - Clinic id. The mocked clinic id should be used.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode = 200] - The response code to return from the mock api call.
 */
export function mockSlotsApi({
  locationId,
  clinicId,
  response: data,
  responseCode = 200,
}) {
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
          body: '404 Not Found',
          statusCode: 404,
        });

        return;
      }

      req.reply({
        data,
      });
    },
  ).as('v2:get:slots');
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
      rules: {
        'aria-allowed-role': {
          enabled: false,
        },
      },
    });
  });
}

/**
 * Function to mock the 'GET' vamc-ehr.json endpoint. This endpoint is used to
 * determine if Cerner is used or not.
 *
 * @example GET /data/cms/vamc-ehr.json
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Boolean} [arguments.isCerner=false] - Flag to determine if a facility is Cerner or not.
 * The default facilities are '983' and '984'.
 */
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
