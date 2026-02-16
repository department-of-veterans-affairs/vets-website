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
    formData?.claimantPhone &&
    typeof formData.claimantPhone === 'object' &&
    formData.claimantPhone.contact
  ) {
    if (!formData.claimantPhone._isValid) {
      formData.claimantPhone._isValid =
        formData.claimantPhone.isValid || formData.claimantPhone.IsValid;
    }
    if (!formData.claimantPhone._error) {
      formData.claimantPhone._error =
        formData.claimantPhone.error ?? formData.claimantPhone.Error ?? null;
    }
    if (!formData.claimantPhone._touched) {
      formData.claimantPhone._touched =
        formData.claimantPhone.touched || formData.claimantPhone.Touched;
    }
    if (!formData.claimantPhone._required) {
      formData.claimantPhone._required =
        formData.claimantPhone.required || formData.claimantPhone.Required;
    }
  }
  router.push(returnUrl);
};

export const onFormLoaded = props => {
  validateInternationalPhoneNumbers(props);
};
