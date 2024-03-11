import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const {
  exposureToAirPollutants,
  exposureToAsbestos,
  exposureToChemicals,
  exposureToContaminatedWater,
  exposureToMustardGas,
  exposureToOccupationalHazards,
  exposureToRadiation,
  exposureToShad,
  exposureToWarfareAgents,
  exposureToOther,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    ...titleUI(
      'Other toxic exposures',
      'Have you been exposed to any of these toxins or hazards? Check any that you\u2019ve been exposed to.',
    ),
    'view:otherToxicExposures': {
      exposureToAirPollutants: {
        'ui:title':
          'Air pollutants (like burn pits, sand, oil wells, or sulfur fires)',
      },
      exposureToAsbestos: {
        'ui:title': 'Asbestos',
      },
      exposureToChemicals: {
        'ui:title':
          'Chemicals (like pesticides, herbicides, or contaminated water)',
      },
      exposureToContaminatedWater: {
        'ui:title': 'Contaminated Water at Camp Lejeune',
      },
      exposureToMustardGas: {
        'ui:title': 'Mustard gas',
      },
      exposureToOccupationalHazards: {
        'ui:title':
          'Occupational hazards (jet fuel, industrial solvents, lead, firefighting foams)',
      },
      exposureToRadiation: {
        'ui:title': 'Radiation',
      },
      exposureToShad: {
        'ui:title': 'SHAD (Shipboard Hazard and Defense)',
      },
      exposureToWarfareAgents: {
        'ui:title':
          'Warfare agents (like nerve agents or chemical and biological weapons)',
      },
      exposureToOther: {
        'ui:title': 'Other toxins or hazards not listed here',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:otherToxicExposures': {
        type: 'object',
        properties: {
          exposureToAirPollutants,
          exposureToAsbestos,
          exposureToChemicals,
          exposureToContaminatedWater,
          exposureToMustardGas,
          exposureToOccupationalHazards,
          exposureToRadiation,
          exposureToShad,
          exposureToWarfareAgents,
          exposureToOther,
        },
      },
    },
  },
};
