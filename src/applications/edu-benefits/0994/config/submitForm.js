import _ from 'lodash';
import { submitToUrl } from 'platform/forms-system/src/js/actions';

import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import recordEvent from 'platform/monitoring/record-event';

const submitForm = (form, formConfig) => {
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);
  recordEvent({
    'edu-0994-appliedPastBenefits': _.get(
      form,
      'data.appliedForVaEducationBenefits',
      '',
    ),
    activeDuty: _.get(form, 'data.activeDuty', ''),
    calledActiveDuty: _.get(form, 'data.activeDutyDuringVetTec', ''),
    educationCompleted: _.get(form, 'data.highestLevelofEducation', ''),
    'edu-0994-currentlyWorkingIndustry': _.get(
      form,
      'data.currentHighTechnologyEmployment',
      '',
    ),
    salary: _.get(form, 'data.view:salaryEmploymentTypes.currentSalary', ''),
    'edu-0994-programSelection': _.get(form, 'data.hasSelectedPrograms', ''),
    'edu-0994-programs-saved': _.get(form, 'data.vetTecPrograms.length', 0),
  });

  return submitToUrl(body, formConfig.submitUrl, formConfig.trackingPrefix);
};

export default submitForm;
