import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import DemographicField from '../../../components/FormFields/DemographicViewField';
import { DemographicInfoTitle } from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

const {
  isAmericanIndianOrAlaskanNative,
  isAsian,
  isBlackOrAfricanAmerican,
  isNativeHawaiianOrOtherPacificIslander,
  isSpanishHispanicLatino,
  isWhite,
  hasDemographicNoAnswer,
} = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['vet-info--demographic-info-title']),
    'view:demographicCategories': {
      'ui:title': DemographicInfoTitle,
      'ui:field': DemographicField,
      isAmericanIndianOrAlaskanNative: {
        'ui:title': content['vet-info--demographic-info-indian-label'],
      },
      isSpanishHispanicLatino: {
        'ui:title': content['vet-info--demographic-info-latino-label'],
      },
      isAsian: {
        'ui:title': content['vet-info--demographic-info-asian-label'],
      },
      isBlackOrAfricanAmerican: {
        'ui:title': content['vet-info--demographic-info-black-label'],
      },
      isNativeHawaiianOrOtherPacificIslander: {
        'ui:title': content['vet-info--demographic-info-hawaiian-label'],
      },
      isWhite: {
        'ui:title': content['vet-info--demographic-info-white-label'],
      },
      hasDemographicNoAnswer: {
        'ui:title': content['vet-info--demographic-info-no-answer-label'],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:demographicCategories': {
        type: 'object',
        required: [],
        properties: {
          isAmericanIndianOrAlaskanNative,
          isAsian,
          isBlackOrAfricanAmerican,
          isSpanishHispanicLatino,
          isNativeHawaiianOrOtherPacificIslander,
          isWhite,
          hasDemographicNoAnswer,
        },
      },
    },
  },
};
