import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import createHouseholdMemberTitle from '../../../components/DisclosureTitle';
import { doesHaveDependents, getDependentChildTitle } from './helpers';

export default {
  title: item => getDependentChildTitle(item, 'household'),
  path: 'household/dependents/children/inhousehold/:index',
  depends: doesHaveDependents,
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
            childInHousehold: yesNoSchema,
          },
        },
      },
    },
  },
};
