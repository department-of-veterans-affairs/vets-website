import cloneDeep from 'platform/utilities/data/cloneDeep';
import omit from 'lodash/omit';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
import {
  buildAddressSchema,
  addressUISchema,
  updateFormDataAddress,
} from '../../../address-schema';
import { report674 } from '../../../utilities';
import { StudentAddressDescription } from './helpers';

const addressSchema = buildAddressSchema(true);

const studentAddressMarriageTuition = cloneDeep(
  omit(report674.properties.studentAddressMarriageTuition, [
    'properties.datePaymentsBegan',
    'properties.agencyName',
  ]),
);

studentAddressMarriageTuition.properties.address = addressSchema;

export const schema = {
  type: 'object',
  properties: {
    studentAddressMarriageTuition,
  },
};

export const uiSchema = {
  'ui:title': 'Student’s Address',
  studentAddressMarriageTuition: {
    address: {
      ...{
        'ui:description': StudentAddressDescription,
      },
      ...addressUISchema(
        true,
        'studentAddressMarriageTuition.address',
        formData => isChapterFieldRequired(formData, TASK_KEYS.report674),
      ),
    },
    wasMarried: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:title': 'Was the student ever married?',
      'ui:widget': 'yesNo',
      'ui:errorMessages': { required: 'Select an option' },
    },
    marriageDate: {
      ...currentOrPastDateUI('Date of marriage'),
      ...{
        'ui:required': formData =>
          formData?.studentAddressMarriageTuition?.wasMarried,
        'ui:options': {
          expandUnder: 'wasMarried',
          expandUnderCondition: true,
        },
      },
    },
    tuitionIsPaidByGovAgency: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:title':
        'Is student’s tuition or education allowance being paid by the Survivors’ and Dependents’ Educational Assisatnce (DEA), the Federal Compensation Act, or any U.S. government agency or program?',
      'ui:widget': 'yesNo',
      'ui:errorMessages': { required: 'Select an option' },
    },
  },
};

export const updateFormData = (oldFormData, formData) =>
  updateFormDataAddress(oldFormData, formData, [
    'studentAddressMarriageTuition',
    'address',
  ]);
