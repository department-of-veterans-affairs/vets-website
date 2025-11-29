import {
  titleUI,
  textUI,
  textSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';
import { validFieldCharsOnly } from '../../../shared/validations';
import { validateDateRange } from '../../utils/validation';

const TOGGLE_KEY = 'view:champvaForm107959cRev2025';

const pageTitle = () =>
  titleUI(({ formData }) => {
    const name = nameWording(formData);
    const suffix = formData[TOGGLE_KEY] ? 'effective date' : 'carrier';
    return privWrapper(`${name} Medicare Part D ${suffix}`);
  });

export default {
  uiSchema: {
    ...pageTitle(),
    applicantMedicarePartDCarrier: {
      ...textUI({
        title: 'Name of insurance carrier',
        hint: 'Your insurance carrier is your insurance company.',
        hideIf: formData => formData[TOGGLE_KEY],
        required: () => true,
      }),
    },
    applicantMedicarePartDEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part D effective date',
      hint: 'This information is at the top of the card.',
    }),
    applicantMedicarePartDTerminationDate: currentOrPastDateUI({
      title: 'Medicare Part D termination date',
      hint: 'Only enter this date if the plan is inactive.',
      hideIf: formData => !formData[TOGGLE_KEY],
    }),
    'ui:validations': [
      (errors, formData) =>
        !formData[TOGGLE_KEY] &&
        validFieldCharsOnly(
          errors,
          null,
          formData,
          'applicantMedicarePartDCarrier',
        ),
      (errors, data) =>
        validateDateRange(errors, data, {
          startDateKey: 'applicantMedicarePartDEffectiveDate',
          endDateKey: 'applicantMedicarePartDTerminationDate',
        }),
    ],
  },
  schema: {
    type: 'object',
    required: ['applicantMedicarePartDEffectiveDate'],
    properties: {
      applicantMedicarePartDCarrier: textSchema,
      applicantMedicarePartDEffectiveDate: currentOrPastDateSchema,
      applicantMedicarePartDTerminationDate: currentOrPastDateSchema,
    },
  },
};
