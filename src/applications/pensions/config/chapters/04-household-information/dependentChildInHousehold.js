import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import createHouseholdMemberTitle from '../../../components/DisclosureTitle';
import { showDependentsMultiplePage } from '../../../helpers';
import { doesHaveDependents, getDependentChildTitle } from './helpers';

const {
  childInHousehold,
} = fullSchemaPensions.properties.dependents.items.properties;

export default {
  title: item => getDependentChildTitle(item, 'household'),
  path: 'household/dependents/children/inhousehold/:index',
  depends: formData =>
    !showDependentsMultiplePage() && doesHaveDependents(formData),
  showPagePerItem: true,
  arrayPath: 'dependents',
  uiSchema: {
    dependents: {
      items: {
        ...titleUI(createHouseholdMemberTitle('fullName', 'household')),
        childInHousehold: yesNoUI({
          title: 'Does your child live with you?',
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      dependents: {
        type: 'array',
        items: {
          type: 'object',
          required: ['childInHousehold'],
          properties: {
            childInHousehold,
          },
        },
      },
    },
  },
};
