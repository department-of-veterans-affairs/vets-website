import {
  checkboxGroupSchema,
  checkboxGroupUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import get from 'platform/utilities/data/get';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['signer--relationship-title'];
const INPUT_LABELS = {
  checkgroup: content['signer--relationship-label--checkgroup'],
  text: content['signer--relationship-label--other'],
};
const CHECKGROUP_HINT = content['signer--relationship-hint'];
const ERR_MSG_OTHER_REQUIRED = content['validation--applicant-relationship'];

const SCHEMA_LABELS = {
  spouse: content['signer--relationship-option--spouse'],
  child: content['signer--relationship-option--child'],
  parent: content['signer--relationship-option--parent'],
  thirdParty: content['signer--relationship-option--thirdParty'],
  other: content['signer--relationship-option--other'],
};
const SCHEMA_ENUM = Object.keys(SCHEMA_LABELS);

const updateSchema = (formData, schema) => {
  const dataPath = 'certifierRelationship.relationshipToVeteran.other';
  const hasOtherRelationship = Boolean(get(dataPath, formData));
  return {
    required: hasOtherRelationship
      ? ['relationshipToVeteran', 'otherRelationshipToVeteran']
      : ['relationshipToVeteran'],
    properties: {
      ...schema.properties,
      otherRelationshipToVeteran: {
        ...schema.properties.otherRelationshipToVeteran,
        'ui:collapsed': !hasOtherRelationship,
      },
    },
  };
};

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT),
    certifierRelationship: {
      relationshipToVeteran: checkboxGroupUI({
        title: INPUT_LABELS.checkgroup,
        hint: CHECKGROUP_HINT,
        labels: SCHEMA_LABELS,
        required: () => true,
      }),
      otherRelationshipToVeteran: textUI({
        title: INPUT_LABELS.text,
        errorMessages: {
          required: ERR_MSG_OTHER_REQUIRED,
        },
        expandUnder: 'relationshipToVeteran',
        expandUnderCondition: 'other',
        expandedContentFocus: true,
      }),
      'ui:options': { updateSchema },
    },
  },
  schema: {
    type: 'object',
    required: ['certifierRelationship'],
    properties: {
      certifierRelationship: {
        type: 'object',
        properties: {
          relationshipToVeteran: checkboxGroupSchema(SCHEMA_ENUM),
          otherRelationshipToVeteran: textSchema,
        },
      },
    },
  },
};
