import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { OtherExposureDescription } from '../../../components/FormDescriptions/OtherExposureDescriptions';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

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
    ...titleUI(
      content['service-info--exposures-title'],
      OtherExposureDescription,
    ),
    'view:otherToxicExposures': {
      exposureToAirPollutants: {
        'ui:title': content['service-info--exposures-air-pollutants-label'],
      },
      exposureToAsbestos: {
        'ui:title': content['service-info--exposures-asbestos-label'],
      },
      exposureToChemicals: {
        'ui:title': content['service-info--exposures-chemicals-label'],
      },
      exposureToContaminatedWater: {
        'ui:title': content['service-info--exposures-camp-lejeune-label'],
      },
      exposureToMustardGas: {
        'ui:title': content['service-info--exposures-mustard-gas-label'],
      },
      exposureToOccupationalHazards: {
        'ui:title': content['service-info--exposures-hazards-label'],
      },
      exposureToRadiation: {
        'ui:title': content['service-info--exposures-radiation-label'],
      },
      exposureToShad: {
        'ui:title': content['service-info--exposures-shad-label'],
      },
      exposureToWarfareAgents: {
        'ui:title': content['service-info--exposures-warfare-agents-label'],
      },
      exposureToOther: {
        'ui:title': content['service-info--exposures-other-label'],
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
