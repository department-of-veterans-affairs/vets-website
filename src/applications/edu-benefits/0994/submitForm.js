import get from 'lodash/get';
import { submitToUrl } from 'platform/forms-system/src/js/actions';

import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import recordEvent from 'platform/monitoring/record-event';

const submitForm = (form, formConfig) => {
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);
  recordEvent({
    'edu-0994-appliedPastBenefits': get(
      form,
      'data.appliedForVaEducationBenefits',
      '',
    ),
    activeDuty: get(form, 'data.activeDuty', ''),
    calledActiveDuty: get(form, 'data.activeDutyDuringVetTec', ''),
    educationCompleted: get(form, 'data.highestLevelofEducation', ''),
    'edu-0994-currentlyWorkingIndustry': get(
      form,
      'data.currentHighTechnologyEmployment',
      '',
    ),
    salary: get(form, 'data.view:salaryEmploymentTypes.currentSalary', ''),
    'edu-0994-programSelection': get(form, 'data.hasSelectedPrograms', ''),
    'edu-0994-programs-saved': get(form, 'data.vetTecPrograms.length', 0),
  });

  return submitToUrl(body, formConfig.submitUrl, formConfig.trackingPrefix);
};

export default submitForm;
