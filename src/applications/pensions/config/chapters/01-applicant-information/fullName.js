import moment from 'moment';

import {
  fullNameUI,
  fullNameSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
import UnauthenticatedWarningAlert from '../../../containers/UnauthenticatedWarningAlert';

export function isOver65(formData, currentDate) {
  const today = currentDate || moment();
  const veteranDateOfBirth = moment(
    formData.veteranDateOfBirth,
    'YYYY-MM-DD',
    true,
  );

  if (!veteranDateOfBirth.isValid()) return undefined;

  return today
    .startOf('day')
    .subtract(65, 'years')
    .isSameOrAfter(veteranDateOfBirth);
}

export function setDefaultIsOver65(oldData, newData, currentDate) {
  if (oldData.veteranDateOfBirth !== newData.veteranDateOfBirth) {
    const today = currentDate || moment();
    return {
      ...newData,
      isOver65: isOver65(newData, today),
    };
  }
  return newData;
}

/** @type {PageSchema} */
export default {
  updateFormData: setDefaultIsOver65,
  uiSchema: {
    ...titleUI('Your full name', applicantDescription),
    'view:warningAlert': {
      'ui:description': UnauthenticatedWarningAlert,
    },
    veteranFullName: fullNameUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranFullName'],
    properties: {
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
      veteranFullName: fullNameSchema,
    },
  },
};
