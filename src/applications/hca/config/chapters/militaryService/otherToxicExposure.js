import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { OtherExposureDescription } from '../../../components/FormDescriptions/OtherExposureDescriptions';
import { FULL_SCHEMA } from '../../../utils/imports';

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
} = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI('Other toxic exposures', OtherExposureDescription),
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
          'Occupational hazards (like jet fuel, industrial solvents, lead, or firefighting foams)',
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
