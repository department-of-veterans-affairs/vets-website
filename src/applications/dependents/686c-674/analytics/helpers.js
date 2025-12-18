import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { customTransformForSubmit } from '../config/utilities';

/**
 * Builds event data for 686c form submission based on selected options. This is
 * meant for the v2 flow. For v3, the post-processed data from the submit
 * transformer
 * @param {object} formData The form data submitted by the user
 * @returns {object} Event data object for submission tracking
 */
export const buildEventData = (formData = {}) => {
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

/**
 * Transform and submit the 686c form data
 * @param {object} form - form object from Redux store
 * @param {object} formConfig - form configuration object
 * @returns {Promise} Promise resolving when the form is submitted
 */
export const customSubmit686 = (form, formConfig) => {
  const { body, data } = customTransformForSubmit(formConfig, form);
  return submitToUrl(
    body,
    formConfig.submitUrl,
    formConfig.trackingPrefix,
    // use processed data so the correct v3 data is sent to events
    buildEventData(data),
  );
};
