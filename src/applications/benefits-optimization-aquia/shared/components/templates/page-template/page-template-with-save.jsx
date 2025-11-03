import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SaveFormLink from 'platform/forms/save-in-progress/SaveFormLink';
import { saveAndRedirectToReturnUrl } from 'platform/forms/save-in-progress/actions';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { FINISH_APP_LATER_DEFAULT_MESSAGE } from 'platform/forms-system/src/js/constants';
import StableSaveStatus from './stable-save-status';

import { PageTemplate } from './page-template';

/**
 * PageTemplate with integrated save-in-progress UI.
 * Wraps the base PageTemplate with SaveStatus alert and SaveFormLink.
 *
 * This component provides UI for save-in-progress functionality:
 * - Success alert showing when form is auto-saved by the platform
 * - "Finish this application later" link
 * - Error handling for save failures
 *
 * Note: Auto-save functionality is handled by the platform's RoutedSavableApp.
 * This component only provides the user interface elements.
 *
 * @component
 * @param {Object} props - Component props (same as PageTemplate plus Redux state)
 * @returns {JSX.Element} PageTemplate with save-in-progress UI
 */
const PageTemplateWithSaveComponent = ({
  user,
  form,
  formConfig,
  route,
  location,
  showLoginModal,
  saveAndRedirectToReturnUrlAction,
  toggleLoginModalAction,
  data,
  setFormData,
  ...pageTemplateProps
}) => {
  const finishAppLaterMessage =
    formConfig?.customText?.finishAppLaterMessage ||
    FINISH_APP_LATER_DEFAULT_MESSAGE;

  // Extract stable values from props
  const isLoggedIn = user?.login?.currentlyLoggedIn;
  const pathname = location?.pathname;

  // NOTE: Auto-save is handled by the platform's RoutedSavableApp
  // We only provide the SaveStatus alert and SaveFormLink here

  // Memoize SaveFormLink - only re-render when necessary
  const saveFormLinkElement = useMemo(
    () => (
      <SaveFormLink
        locationPathname={pathname}
        form={form}
        formConfig={formConfig}
        route={route}
        user={user}
        showLoginModal={showLoginModal}
        saveAndRedirectToReturnUrl={saveAndRedirectToReturnUrlAction}
        toggleLoginModal={toggleLoginModalAction}
      >
        {finishAppLaterMessage}
      </SaveFormLink>
    ),
    [
      pathname,
      form,
      formConfig,
      route,
      user,
      showLoginModal,
      saveAndRedirectToReturnUrlAction,
      toggleLoginModalAction,
      finishAppLaterMessage,
    ],
  );

  return (
    <>
      {/* Save success/error alert - shows at top of page */}
      <StableSaveStatus
        isLoggedIn={isLoggedIn}
        showLoginModal={showLoginModal}
        toggleLoginModal={toggleLoginModalAction}
        form={form}
        formConfig={formConfig}
      />

      {/* Main page content */}
      <PageTemplate
        data={data}
        setFormData={setFormData}
        {...pageTemplateProps}
      />

      {/* Finish this application later link - shows after navigation buttons */}
      {saveFormLinkElement}
    </>
  );
};

PageTemplateWithSaveComponent.propTypes = {
  // PageTemplate props
  data: PropTypes.object.isRequired,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  dataProcessor: PropTypes.func,
  defaultData: PropTypes.object,
  goBack: PropTypes.func,
  hideNavigation: PropTypes.bool,
  navigationProps: PropTypes.object,
  onReviewPage: PropTypes.bool,
  schema: PropTypes.object,
  sectionName: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  updatePage: PropTypes.func,
  useFormSectionHook: PropTypes.bool,

  // Redux-provided props
  form: PropTypes.object.isRequired,
  saveAndRedirectToReturnUrlAction: PropTypes.func.isRequired,
  toggleLoginModalAction: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  formConfig: PropTypes.object,
  location: PropTypes.object,
  route: PropTypes.object,
  showLoginModal: PropTypes.bool,
};

/**
 * Map Redux state to component props
 * @param {Object} state - Redux state
 * @returns {Object} Props mapped from Redux state
 */
const mapStateToProps = state => ({
  form: state.form,
  user: state.user,
  showLoginModal: state.navigation?.showLoginModal,
});

const mapDispatchToProps = {
  saveAndRedirectToReturnUrlAction: saveAndRedirectToReturnUrl,
  toggleLoginModalAction: toggleLoginModal,
};

export const PageTemplateWithSave = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PageTemplateWithSaveComponent),
);

export default PageTemplateWithSave;
