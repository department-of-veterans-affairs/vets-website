import { returnPhoneObject } from '../../../shared/utils/helpers';

export const forceRepPhoneFix = data => {
  const formData = { ...data };

  // Change Rep phone from string to object
  const phone = formData.informalConferenceRep?.phone;
  if (formData.informalConference === 'rep' && typeof phone === 'string') {
    formData.informalConferenceRep.phone = returnPhoneObject(phone);
  }
  return formData;
};

/* Update to rep phone to match Lighthouse v2 (missed in first migration)
 * https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v2/200996.json
 */
export default savedData => {
  const { formData, metadata } = savedData;

  return {
    formData: forceRepPhoneFix(formData),
    metadata,
  };
};
