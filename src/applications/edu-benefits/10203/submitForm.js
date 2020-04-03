import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { display10203StemFlow } from './helpers';

const submitForm = (form, formConfig) => {
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);
  const exhaustedAllBenefits =
    form.data['view:exhaustionOfBenefits'] === true ||
    form.data['view:exhaustionOfBenefitsAfterPursuingTeachingCert'] === true;
  const eventData = {
    benefitsUsedRecently: form.data.benefit,
    'edu-stemApplicant': form.data.isEdithNourseRogersScholarship
      ? 'Yes'
      : 'No',
    'edu-undergradStem': form.data.isEnrolledStem ? 'Yes' : 'No',
    'edu-pursueTeaching': form.data.isPursuingTeachingCert ? 'Yes' : 'No',
    activeDuty: form.data.isActiveDuty ? 'Yes' : 'No',
    calledActiveDuty: form.data.isActiveDuty ? 'Yes' : 'No',
    preferredContactMethod: form.data.preferredContactMethod,
    'edu-exhaustedAllBenefits': exhaustedAllBenefits ? 'Yes' : 'No',
  };

  const submitUrl = display10203StemFlow(form.data)
    ? formConfig.submitUrl.replace('1995', '1995s')
    : formConfig.submitUrl;

  return submitToUrl(body, submitUrl, formConfig.trackingPrefix, eventData);
};

export default submitForm;
