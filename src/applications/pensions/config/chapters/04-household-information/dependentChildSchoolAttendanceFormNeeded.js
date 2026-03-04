import get from 'platform/forms-system/src/js/utilities/data/get';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { SchoolAttendanceDescription } from '../../../components/Descriptions';
import { showMultiplePageResponse } from '../../../helpers';
import {
  getDependentChildTitle,
  isBetween18And23,
  dependentIsAttendingSchool,
} from './helpers';

export default {
  title: item => getDependentChildTitle(item, 'additional form needed'),
  path:
    'household/dependents/children/information/school-attendance-form-needed/:index',
  depends: (formData, index) =>
    !showMultiplePageResponse() &&
    isBetween18And23(
      get(['dependents', index, 'childDateOfBirth'], formData),
    ) &&
    dependentIsAttendingSchool(formData, index),
  showPagePerItem: true,
  arrayPath: 'dependents',
  uiSchema: {
    dependents: {
      items: {
        ...titleUI('Additional form needed', SchoolAttendanceDescription),
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
            'view:schoolAttendanceFormNeeded': {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};
