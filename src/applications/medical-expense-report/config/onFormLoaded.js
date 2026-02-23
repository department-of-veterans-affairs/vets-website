/**
 * Update claimantPhone fields to match mapping.
 * Remove when mappings are no longer underscore prefixed.
 * @param {Object} formData - Form data from save-in-progress
 * @param {String} returnUrl - URL of last saved page
 * @param {Object} formConfig - Full form config
 * @param {Object} router - React router
 */
const validateInternationalPhoneNumbers = props => {
  const { formData, router, returnUrl } = props;
  if (
    formData?.primaryPhone &&
    typeof formData.primaryPhone === 'object' &&
    formData.primaryPhone.contact
  ) {
    if (!formData.primaryPhone._isValid) {
      formData.primaryPhone._isValid =
        formData.primaryPhone.isValid || formData.primaryPhone.IsValid;
    }
    if (!formData.primaryPhone._error) {
      formData.primaryPhone._error =
        formData.primaryPhone.error ?? formData.primaryPhone.Error ?? null;
    }
    if (!formData.primaryPhone._touched) {
      formData.primaryPhone._touched =
        formData.primaryPhone.touched || formData.primaryPhone.Touched;
    }
    if (!formData.primaryPhone._required) {
      formData.primaryPhone._required =
        formData.primaryPhone.required || formData.primaryPhone.Required;
    }
  }
  router.push(returnUrl);
};

export const onFormLoaded = props => {
  validateInternationalPhoneNumbers(props);
};
