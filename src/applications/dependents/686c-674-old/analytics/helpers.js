import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { customTransformForSubmit } from '../config/utilities';

export const buildEventData = formData => {
  return {
    'disability-claimSpouse': formData['view:selectable686Options'].addSpouse,
    'disability-under18AndUnmarried':
      formData['view:selectable686Options'].addChild,
    'disability-childAttendingSchool':
      formData['view:selectable686Options'].report674,
    'disability-reportingDivorce':
      formData['view:selectable686Options'].reportDivorce,
    'disability-stepchildLeftHousehold':
      formData['view:selectable686Options'].reportStepchildNotInHousehold,
    'disability-deathOfDependent':
      formData['view:selectable686Options'].reportDeath,
    'disability-marriageOfChild':
      formData['view:selectable686Options'].reportMarriageOfChildUnder18,
    'disability-childStoppedAttendingSchool':
      formData['view:selectable686Options']
        .reportChild18OrOlderIsNotAttendingSchool,
  };
};

export const customSubmit686 = (form, formConfig) => {
  const body = customTransformForSubmit(formConfig, form);

  return submitToUrl(
    body,
    formConfig.submitUrl,
    formConfig.trackingPrefix,
    buildEventData(form.data),
  );
};
