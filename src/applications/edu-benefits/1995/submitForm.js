import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

const submitForm = (form, formConfig) => {
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);

  const eventData = {
    'edu-stem-applicant': form.data.isEdithNourseRogersScholarship
      ? 'Yes'
      : 'No',
  };

  return submitToUrl(
    body,
    formConfig.submitUrl,
    formConfig.trackingPrefix,
    eventData,
  );
};

export default submitForm;
