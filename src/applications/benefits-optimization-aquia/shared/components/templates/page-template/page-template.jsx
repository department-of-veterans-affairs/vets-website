import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { useFormSection } from '@bio-aquia/shared/hooks';
import { FINISH_APP_LATER_DEFAULT_MESSAGE } from 'platform/forms-system/src/js/constants';
import SaveFormLink from 'platform/forms/save-in-progress/SaveFormLink';
import { saveAndRedirectToReturnUrl } from 'platform/forms/save-in-progress/actions';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { BUTTON_TEXT, CSS_CLASSES, DEFAULTS } from './constants';
import {
  PageTemplateCorePropTypes,
  PageTemplateWithSaveInProgressPropTypes,
  formSectionInternalPropTypes,
} from './prop-types';
import StableSaveStatus from './stable-save-status';

/**
 * Internal component that uses the form section hook.
 * This is separated to avoid conditional hook calls.
 */
const PageTemplateWithHook = ({
  data,
  setFormData,
  goForward,
  goBack,
  schema,
  sectionName,
  title,
  subtitle,
  children,
  dataProcessor,
  defaultData,
  hideNavigation,
  navigationProps,
  className,
  onReviewPage,
  updatePage,
}) => {
  const formSectionProps = useFormSection({
    sectionName: sectionName || DEFAULTS.SECTION_NAME,
    schema: schema || { parse: value => value },
    data,
    setFormData,
    dataProcessor,
    defaultData,
  });

  return (
    <PageTemplateBase
      data={data}
      goForward={goForward}
      goBack={goBack}
      title={title}
      subtitle={subtitle}
      hideNavigation={hideNavigation}
      navigationProps={navigationProps}
      className={className}
      formSectionProps={formSectionProps}
      shouldUseHook
      onReviewPage={onReviewPage}
      updatePage={updatePage}
    >
      {children}
    </PageTemplateBase>
  );
};

PageTemplateWithHook.propTypes = PageTemplateCorePropTypes;

/**
 * Base template component that handles rendering.
 * This component does not use any hooks conditionally.
 */
const PageTemplateBase = ({
  goForward,
  goBack,
  title,
  subtitle,
  children,
  hideNavigation,
  navigationProps,
  className,
  formSectionProps,
  shouldUseHook,
  onReviewPage,
  updatePage,
}) => {
  /**
   * Renders children with proper form context.
   * Supports both render props pattern and automatic form field enhancement.
   * @returns {React.ReactNode} Rendered children
   */
  const renderChildren = () => {
    if (typeof children === 'function') {
      return children(formSectionProps);
    }

    return React.Children.map(children, child => {
      if (!React.isValidElement(child) || !shouldUseHook) {
        return child;
      }

      const childName = child.props?.name;
      if (!childName) {
        return child;
      }

      return React.cloneElement(child, {
        value: formSectionProps.localData[childName] ?? child.props.value,
        onChange: child.props.onChange || formSectionProps.handleFieldChange,
        error: formSectionProps.errors[childName] ?? child.props.error,
        errors:
          formSectionProps.errors[childName] &&
          typeof formSectionProps.errors[childName] === 'object' &&
          !Array.isArray(formSectionProps.errors[childName])
            ? formSectionProps.errors[childName]
            : child.props.errors,
        forceShowError:
          formSectionProps.formSubmitted || child.props.forceShowError,
      });
    });
  };

  const wrapperClasses = [CSS_CLASSES.FORM_PANEL, className]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className={wrapperClasses}>
        <form noValidate>
          <fieldset className={CSS_CLASSES.FIELDSET}>
            {title && (
              <legend id="root__title">
                <h3
                  className={`${CSS_CLASSES.HEADING_DARK} ${
                    CSS_CLASSES.HEADING_NO_TOP_MARGIN
                  } ${CSS_CLASSES.HEADING_SERIF} ${CSS_CLASSES.HEADING_SIZE}`}
                >
                  {title}
                </h3>
              </legend>
            )}

            {subtitle && (
              <div className={CSS_CLASSES.MARGIN_BOTTOM_2}>
                <p className={CSS_CLASSES.MARGIN_0}>{subtitle}</p>
              </div>
            )}

            {renderChildren()}
          </fieldset>

          {!hideNavigation &&
            !onReviewPage && (
              <div
                className={`${CSS_CLASSES.MARGIN_TOP_2} ${
                  CSS_CLASSES.MARGIN_BOTTOM_2
                } ${CSS_CLASSES.DISPLAY_FLEX} ${
                  CSS_CLASSES.JUSTIFY_SPACE_BETWEEN
                }`}
              >
                <div>
                  {goBack && (
                    <va-button
                      secondary
                      onClick={goBack}
                      text={navigationProps?.backButtonText || BUTTON_TEXT.BACK}
                      {...navigationProps?.backButtonProps || {}}
                    />
                  )}
                </div>
                <div>
                  <va-button
                    onClick={e => {
                      e.preventDefault();
                      formSectionProps.handleContinue(goForward);
                    }}
                    text={BUTTON_TEXT.CONTINUE}
                    {...navigationProps?.continueButtonProps || {}}
                  />
                </div>
              </div>
            )}
        </form>
      </div>

      {!hideNavigation &&
        onReviewPage && (
          <div
            className={`${CSS_CLASSES.MARGIN_TOP_2} ${
              CSS_CLASSES.MARGIN_BOTTOM_2
            } ${CSS_CLASSES.DISPLAY_FLEX} ${CSS_CLASSES.JUSTIFY_FLEX_END}`}
          >
            <va-button
              onClick={e => {
                e.preventDefault();
                formSectionProps.handleContinue(() => {
                  if (updatePage) {
                    updatePage();
                  }
                });
              }}
              text={BUTTON_TEXT.SAVE}
              {...navigationProps?.updateButtonProps || {}}
            />
          </div>
        )}
    </>
  );
};

PageTemplateBase.propTypes = {
  formSectionProps: formSectionInternalPropTypes,
  goForward: PageTemplateCorePropTypes.goForward,
  shouldUseHook: PageTemplateCorePropTypes.useFormSectionHook,
  ...PageTemplateCorePropTypes,
};

/**
 * Core form page template component (without save-in-progress UI or Redux).
 * Wraps any form content with consistent layout and navigation.
 * Provides form section logic without imposing business requirements.
 * Styled to match VA.gov form patterns.
 *
 * Use this in tests or when you need a PageTemplate without save-in-progress features.
 * For production use, import PageTemplate (the default export) which includes
 * save-in-progress UI automatically.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Current form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Navigation forward handler
 * @param {Function} props.goBack - Navigation back handler
 * @param {import('zod').ZodSchema} [props.schema] - Optional validation schema
 * @param {string} [props.sectionName] - Section name in form data (required if using schema)
 * @param {string} [props.title] - Page title
 * @param {string} [props.subtitle] - Page subtitle or description
 * @param {React.ReactNode|Function} props.children - Page content to render or render prop function
 * @param {Function} [props.dataProcessor] - Optional data processor
 * @param {Object} [props.defaultData={}] - Default data for the section
 * @param {boolean} [props.hideNavigation=false] - Hide navigation buttons
 * @param {Object} [props.navigationProps] - Additional props for navigation buttons
 * @param {string} [props.className] - Additional CSS classes for the wrapper
 * @param {boolean} [props.useFormSectionHook=true] - Whether to use form section logic
 * @param {boolean} [props.onReviewPage=false] - Whether page is in review mode (shows Update button instead of Continue)
 * @param {Function} [props.updatePage] - Function to call when Update button is clicked (for review page)
 * @returns {JSX.Element} Form page with navigation
 */
export const PageTemplateCore = ({
  data,
  setFormData,
  goForward,
  goBack,
  schema,
  sectionName,
  title,
  subtitle,
  children,
  dataProcessor,
  defaultData = {},
  hideNavigation = false,
  navigationProps = {},
  className = '',
  useFormSectionHook = true,
  onReviewPage = false,
  updatePage,
}) => {
  const shouldUseHook = useFormSectionHook && schema && sectionName;

  // If we should use the hook, render the component that uses it
  if (shouldUseHook) {
    return (
      <PageTemplateWithHook
        data={data}
        setFormData={setFormData}
        goForward={goForward}
        goBack={goBack}
        schema={schema}
        sectionName={sectionName}
        title={title}
        subtitle={subtitle}
        dataProcessor={dataProcessor}
        defaultData={defaultData}
        hideNavigation={hideNavigation}
        navigationProps={navigationProps}
        className={className}
        onReviewPage={onReviewPage}
        updatePage={updatePage}
      >
        {children}
      </PageTemplateWithHook>
    );
  }

  // Otherwise, render without the hook
  const fallbackProps = {
    localData: sectionName ? data?.[sectionName] || {} : {},
    handleFieldChange: (name, value) => {
      if (sectionName) {
        setFormData({
          ...data,
          [sectionName]: {
            ...data?.[sectionName],
            [name]: value,
          },
        });
      } else {
        setFormData({
          ...data,
          [name]: value,
        });
      }
    },
    handleContinue: callback => callback && callback(),
    errors: {},
    formSubmitted: false,
  };

  return (
    <PageTemplateBase
      goForward={goForward}
      goBack={goBack}
      title={title}
      subtitle={subtitle}
      hideNavigation={hideNavigation}
      navigationProps={navigationProps}
      className={className}
      formSectionProps={fallbackProps}
      shouldUseHook={false}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
    >
      {children}
    </PageTemplateBase>
  );
};

PageTemplateCore.propTypes = PageTemplateCorePropTypes;

/**
 * PageTemplate with integrated save-in-progress UI.
 * This is the main component to use for all form pages.
 *
 * Automatically includes:
 * - Save-in-progress success/error alerts
 * - "Finish this application later" link
 * - All core PageTemplate functionality
 *
 * The save-in-progress UI automatically shows/hides based on user authentication
 * and form configuration. Auto-save functionality is handled by the platform's
 * RoutedSavableApp - this component only provides the UI elements.
 *
 * @component
 * @param {Object} props - All PageTemplate props plus Redux-provided props
 * @returns {JSX.Element} Form page with save-in-progress UI
 */
const PageTemplateComponent = ({
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
      <PageTemplateCore
        data={data}
        setFormData={setFormData}
        {...pageTemplateProps}
      />

      {/* Finish this application later link - shows after navigation buttons */}
      {saveFormLinkElement}
    </>
  );
};

PageTemplateComponent.propTypes = PageTemplateWithSaveInProgressPropTypes;

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

/**
 * PageTemplate with save-in-progress features (Redux-connected version).
 * Use this in production code when you want automatic save-in-progress UI.
 *
 * @example
 * <PageTemplateWithSaveInProgress
 *   data={data}
 *   setFormData={setFormData}
 *   goForward={goForward}
 *   goBack={goBack}
 *   formConfig={formConfig}
 *   schema={schema}
 *   sectionName="mySection"
 * >
 *   {children}
 * </PageTemplateWithSaveInProgress>
 */
export const PageTemplateWithSaveInProgress = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PageTemplateComponent),
);

/**
 * PageTemplate - Core version without save-in-progress.
 * This is the main export for backward compatibility with existing tests.
 *
 * For production code that needs save-in-progress features,
 * use PageTemplateWithSaveInProgress instead.
 */
export const PageTemplate = PageTemplateCore;

export default PageTemplate;
