import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import createHouseholdMemberTitle from '../../../components/DisclosureTitle';

import { doesHaveDependents, getDependentChildTitle } from './helpers';

export default {
  path: 'household/dependents/children/inhousehold/:index',
  title: item => getDependentChildTitle(item, 'household'),
  depends: doesHaveDependents,
  showPagePerItem: true,
  arrayPath: 'dependents',
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
};
