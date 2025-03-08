import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';
import { OtherExposureDescription } from '../../../components/FormDescriptions/OtherToxicExposureDescription';

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
} = ezrSchema.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['military-service-other-toxic-exposure-title'],
      OtherExposureDescription,
    ),
    'view:otherToxicExposures': {
      exposureToAirPollutants: {
        'ui:title': content['military-service-air-pollutants-exposure-title'],
      },
      exposureToAsbestos: {
        'ui:title': content['military-service-asbestos-exposure-title'],
      },
      exposureToChemicals: {
        'ui:title': content['military-service-chemicals-exposure-title'],
      },
      exposureToContaminatedWater: {
        'ui:title': content['military-service-water-exposure-title'],
      },
      exposureToMustardGas: {
        'ui:title': content['military-service-gas-exposure-title'],
      },
      exposureToOccupationalHazards: {
        'ui:title': content['military-service-occupational-exposure-title'],
      },
      exposureToRadiation: {
        'ui:title': content['military-service-radiation-exposure-title'],
      },
      exposureToShad: {
        'ui:title': content['military-service-shad-exposure-title'],
      },
      exposureToWarfareAgents: {
        'ui:title': content['military-service-warfare-agents-exposure-title'],
      },
      exposureToOther: {
        'ui:title': content['military-service-other-exposure-title'],
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
