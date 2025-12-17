export const redesignActive = formData => formData?.showArrayBuilder;

/**
 * Redirect to the user's last saved URL if it exists
 * @param {String} returnUrl - URL of last saved page
 * @param {Object} router - React router
 */
export const onFormLoaded = ({ returnUrl, router }) => {
  if (returnUrl) {
    router?.push(returnUrl);
  }
};
