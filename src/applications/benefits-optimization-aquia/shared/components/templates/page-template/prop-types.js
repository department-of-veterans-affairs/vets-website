/**
 * Shared PropTypes definitions for page-template components
 * @module components/templates/page-template/prop-types
 */

import PropTypes from 'prop-types';

/**
 * Core props required for all page templates
 */
export const corePagePropTypes = {
  data: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  goBack: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

/**
 * Props for page template customization
 */
export const templateCustomizationPropTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  hideNavigation: PropTypes.bool,
  navigationProps: PropTypes.shape({
    backButtonProps: PropTypes.object,
    continueButtonProps: PropTypes.object,
    updateButtonProps: PropTypes.object,
  }),
};

/**
 * Props for form section functionality
 */
export const formSectionPropTypes = {
  schema: PropTypes.object,
  sectionName: PropTypes.string,
  dataProcessor: PropTypes.func,
  defaultData: PropTypes.object,
  useFormSectionHook: PropTypes.bool,
};

/**
 * Props for review page functionality
 */
export const reviewPagePropTypes = {
  onReviewPage: PropTypes.bool,
  updatePage: PropTypes.func,
};

/**
 * Redux-provided props for save-in-progress
 */
export const reduxSaveInProgressPropTypes = {
  form: PropTypes.shape({
    data: PropTypes.object,
    lastSavedDate: PropTypes.string,
    autoSavedStatus: PropTypes.string,
    inProgressFormId: PropTypes.string,
    loadedData: PropTypes.shape({
      metadata: PropTypes.shape({
        inProgressFormId: PropTypes.string,
      }),
    }),
  }).isRequired,
  user: PropTypes.shape({
    login: PropTypes.shape({
      currentlyLoggedIn: PropTypes.bool,
    }),
    profile: PropTypes.shape({
      email: PropTypes.string,
    }),
  }).isRequired,
  showLoginModal: PropTypes.bool,
  saveAndRedirectToReturnUrlAction: PropTypes.func.isRequired,
  toggleLoginModalAction: PropTypes.func.isRequired,
};

/**
 * Props for form configuration
 */
export const formConfigPropTypes = {
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      appType: PropTypes.string,
      finishAppLaterMessage: PropTypes.string,
      appSavedSuccessfullyMessage: PropTypes.string,
    }),
  }),
};

/**
 * Props for routing (from React Router)
 */
export const routingPropTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  route: PropTypes.object,
};

/**
 * Props used internally by form section hook
 */
export const formSectionInternalPropTypes = {
  localData: PropTypes.object,
  handleFieldChange: PropTypes.func,
  handleContinue: PropTypes.func,
  errors: PropTypes.object,
  formSubmitted: PropTypes.bool,
};

/**
 * Complete PropTypes for PageTemplateCore
 */
export const PageTemplateCorePropTypes = {
  ...corePagePropTypes,
  ...templateCustomizationPropTypes,
  ...formSectionPropTypes,
  ...reviewPagePropTypes,
};

/**
 * Complete PropTypes for PageTemplateWithSaveInProgress
 */
export const PageTemplateWithSaveInProgressPropTypes = {
  ...corePagePropTypes,
  ...templateCustomizationPropTypes,
  ...formSectionPropTypes,
  ...reviewPagePropTypes,
  ...reduxSaveInProgressPropTypes,
  ...formConfigPropTypes,
  ...routingPropTypes,
};

/**
 * PropTypes for StableSaveStatus component
 */
export const StableSaveStatusPropTypes = {
  form: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      appSavedSuccessfullyMessage: PropTypes.string,
      appType: PropTypes.string,
    }),
  }),
  showLoginModal: PropTypes.bool,
  toggleLoginModal: PropTypes.func,
};
