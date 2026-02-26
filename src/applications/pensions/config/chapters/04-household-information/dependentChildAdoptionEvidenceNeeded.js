import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { showMultiplePageResponse } from '../../../helpers';
import { getDependentChildTitle, dependentIsAdopted } from './helpers';
import createHouseholdMemberTitle from '../../../components/DisclosureTitle';

export default {
  title: item => getDependentChildTitle(item, 'supporting documents needed'),
  path:
    'household/dependents/children/information/adoption-evidence-needed/:index',
  depends: (formData, index) =>
    !showMultiplePageResponse() && dependentIsAdopted(formData, index),
  showPagePerItem: true,
  arrayPath: 'dependents',
  uiSchema: {
    dependents: {
      items: {
        ...titleUI(
          createHouseholdMemberTitle('fullName', 'supporting documents needed'),
          <>
            <p>
              Because your child is adopted, you’ll need to submit adoption
              papers or an amended birth certificate with this application.
            </p>
            <p>
              We’ll give you instructions for submitting this form at the end of
              this application.
            </p>
          </>,
        ),
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
          properties: {
            'view:adoptionEvidenceNeeded': { type: 'object', properties: {} },
          },
        },
      },
    },
  },
};
