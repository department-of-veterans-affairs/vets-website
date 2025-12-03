/**
 * Performance-optimized version of PageTemplate with memoization
 *
 * This component provides the same functionality as PageTemplate but with
 * added performance optimizations including:
 * - Memoized child rendering
 * - useCallback for event handlers
 * - React.memo for component memoization
 * - Optimized re-render prevention
 *
 * @module components/templates/page-template/page-template-optimized
 */

import React, { memo, useCallback, useMemo } from 'react';
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
 * Memoized navigation buttons component
 * Prevents unnecessary re-renders when navigation props haven't changed
 */
const NavigationButtons = memo(
  ({
    goBack,
    goForward,
    navigationProps,
    handleContinue,
    onReviewPage,
    updatePage,
  }) => {
    const handleContinueClick = useCallback(
      e => {
        e.preventDefault();
        if (onReviewPage) {
          handleContinue(() => {
            if (updatePage) {
              updatePage();
            }
          });
        } else {
          handleContinue(goForward);
        }
      },
      [handleContinue, goForward, onReviewPage, updatePage],
    );

    const handleBackClick = useCallback(
      e => {
        e.preventDefault();
        if (goBack) {
          goBack();
        }
      },
      [goBack],
    );

    if (onReviewPage) {
      return (
        <div
          className={`${CSS_CLASSES.MARGIN_TOP_2} ${
            CSS_CLASSES.MARGIN_BOTTOM_2
          } ${CSS_CLASSES.DISPLAY_FLEX} ${CSS_CLASSES.JUSTIFY_FLEX_END}`}
        >
          <va-button
            onClick={handleContinueClick}
            text={BUTTON_TEXT.SAVE}
            {...navigationProps?.updateButtonProps || {}}
          />
        </div>
      );
    }

    return (
      <div
        className={`${CSS_CLASSES.MARGIN_TOP_2} ${
          CSS_CLASSES.MARGIN_BOTTOM_2
        } ${CSS_CLASSES.DISPLAY_FLEX} ${CSS_CLASSES.JUSTIFY_SPACE_BETWEEN}`}
      >
        <div>
          {goBack && (
            <va-button
              secondary
              onClick={handleBackClick}
              text={BUTTON_TEXT.BACK}
              {...navigationProps?.backButtonProps || {}}
            />
          )}
        </div>
        <div>
          <va-button
            onClick={handleContinueClick}
            text={BUTTON_TEXT.CONTINUE}
            {...navigationProps?.continueButtonProps || {}}
          />
        </div>
      </div>
    );
  },
);

NavigationButtons.displayName = 'NavigationButtons';

NavigationButtons.propTypes = {
  goBack: PageTemplateCorePropTypes.goBack,
  goForward: PageTemplateCorePropTypes.goForward,
  navigationProps: PageTemplateCorePropTypes.navigationProps,
  onReviewPage: PageTemplateCorePropTypes.onReviewPage,
  updatePage: PageTemplateCorePropTypes.updatePage,
  handleContinue: formSectionInternalPropTypes.handleContinue,
};

/**
 * Memoized form header component
 */
const FormHeader = memo(({ title, subtitle }) => {
  if (!title && !subtitle) {
    return null;
  }

  return (
    <>
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
    </>
  );
});

FormHeader.displayName = 'FormHeader';

FormHeader.propTypes = {
  subtitle: PageTemplateCorePropTypes.subtitle,
  title: PageTemplateCorePropTypes.title,
};

/**
 * Internal component that uses the form section hook with memoization
 */
const PageTemplateWithHookOptimized = memo(props => {
  const {
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
  } = props;

  const formSectionProps = useFormSection({
    sectionName: sectionName || DEFAULTS.SECTION_NAME,
    schema: schema || { parse: value => value },
    data,
    setFormData,
    dataProcessor,
    defaultData,
  });

  return (
    <PageTemplateBaseOptimized
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
    </PageTemplateBaseOptimized>
  );
});

PageTemplateWithHookOptimized.displayName = 'PageTemplateWithHookOptimized';
PageTemplateWithHookOptimized.propTypes = PageTemplateCorePropTypes;

/**
 * Base template component with optimized rendering
 */
const PageTemplateBaseOptimized = memo(props => {
  const {
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
  } = props;

  /**
   * Memoized children rendering function
   * Only re-computes when children or formSectionProps change
   */
  const renderedChildren = useMemo(
    () => {
      if (typeof children === 'function') {
        return children(formSectionProps);
      }

      if (!shouldUseHook) {
        return children;
      }

      return React.Children.map(children, child => {
        if (!React.isValidElement(child)) {
          return child;
        }

        const childName = child.props?.name;
        if (!childName) {
          return child;
        }

        // Only clone if props actually need to be updated
        const needsUpdate =
          formSectionProps.localData[childName] !== undefined ||
          formSectionProps.errors[childName] !== undefined ||
          formSectionProps.formSubmitted;

        if (!needsUpdate) {
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
    },
    [children, formSectionProps, shouldUseHook],
  );

  const wrapperClasses = useMemo(
    () => [CSS_CLASSES.FORM_PANEL, className].filter(Boolean).join(' '),
    [className],
  );

  return (
    <>
      <div className={wrapperClasses}>
        <form noValidate>
          <fieldset className={CSS_CLASSES.FIELDSET}>
            <FormHeader title={title} subtitle={subtitle} />
            {renderedChildren}
          </fieldset>

          {!hideNavigation && (
            <NavigationButtons
              goBack={goBack}
              goForward={goForward}
              navigationProps={navigationProps}
              handleContinue={formSectionProps.handleContinue}
              onReviewPage={onReviewPage}
              updatePage={updatePage}
            />
          )}
        </form>
      </div>
    </>
  );
});

PageTemplateBaseOptimized.displayName = 'PageTemplateBaseOptimized';

PageTemplateBaseOptimized.propTypes = {
  ...PageTemplateCorePropTypes,
  formSectionProps: formSectionInternalPropTypes,
  goForward: PageTemplateCorePropTypes.goForward,
  shouldUseHook: PageTemplateCorePropTypes.useFormSectionHook,
};

/**
 * Core optimized form page template component
 * Performance-optimized version of PageTemplateCore
 */
export const PageTemplateCoreOptimized = memo(props => {
  const {
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
  } = props;

  const shouldUseHook = useFormSectionHook && schema && sectionName;

  // Memoized fallback props for non-hook usage
  const fallbackProps = useMemo(
    () => {
      if (shouldUseHook) {
        return null;
      }

      return {
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
    },
    [shouldUseHook, sectionName, data, setFormData],
  );

  if (shouldUseHook) {
    return (
      <PageTemplateWithHookOptimized
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
      </PageTemplateWithHookOptimized>
    );
  }

  return (
    <PageTemplateBaseOptimized
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
    </PageTemplateBaseOptimized>
  );
});

PageTemplateCoreOptimized.displayName = 'PageTemplateCoreOptimized';
PageTemplateCoreOptimized.propTypes = PageTemplateCorePropTypes;

/**
 * Memoized SaveFormLink wrapper
 */
const MemoizedSaveFormLink = memo(SaveFormLink);

/**
 * PageTemplate with integrated save-in-progress UI and performance optimizations
 */
const PageTemplateComponentOptimized = props => {
  const {
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
  } = props;

  const finishAppLaterMessage = useMemo(
    () =>
      formConfig?.customText?.finishAppLaterMessage ||
      FINISH_APP_LATER_DEFAULT_MESSAGE,
    [formConfig?.customText?.finishAppLaterMessage],
  );

  // Extract stable values from props
  const isLoggedIn = user?.login?.currentlyLoggedIn;
  const pathname = location?.pathname;

  // Memoized callback for toggleLoginModal
  const handleToggleLoginModal = useCallback(() => toggleLoginModalAction(), [
    toggleLoginModalAction,
  ]);

  // Memoize SaveFormLink element
  const saveFormLinkElement = useMemo(
    () => (
      <MemoizedSaveFormLink
        locationPathname={pathname}
        form={form}
        formConfig={formConfig}
        route={route}
        user={user}
        showLoginModal={showLoginModal}
        saveAndRedirectToReturnUrl={saveAndRedirectToReturnUrlAction}
        toggleLoginModal={handleToggleLoginModal}
      >
        {finishAppLaterMessage}
      </MemoizedSaveFormLink>
    ),
    [
      pathname,
      form,
      formConfig,
      route,
      user,
      showLoginModal,
      saveAndRedirectToReturnUrlAction,
      handleToggleLoginModal,
      finishAppLaterMessage,
    ],
  );

  return (
    <>
      {/* Save success/error alert - shows at top of page */}
      <StableSaveStatus
        isLoggedIn={isLoggedIn}
        showLoginModal={showLoginModal}
        toggleLoginModal={handleToggleLoginModal}
        form={form}
        formConfig={formConfig}
      />

      {/* Main page content */}
      <PageTemplateCoreOptimized
        data={data}
        setFormData={setFormData}
        {...pageTemplateProps}
      />

      {/* Finish this application later link */}
      {saveFormLinkElement}
    </>
  );
};

PageTemplateComponentOptimized.displayName = 'PageTemplateComponentOptimized';

PageTemplateComponentOptimized.propTypes = PageTemplateWithSaveInProgressPropTypes;

/**
 * Map Redux state to component props
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
 * PageTemplateOptimized with save-in-progress features (Redux-connected version)
 * Performance-optimized version of PageTemplateWithSaveInProgress
 *
 * @example
 * <PageTemplateOptimized
 *   data={data}
 *   setFormData={setFormData}
 *   goForward={goForward}
 *   goBack={goBack}
 *   formConfig={formConfig}
 *   schema={schema}
 *   sectionName="mySection"
 * >
 *   {children}
 * </PageTemplateOptimized>
 */
const MemoizedPageTemplateComponent = memo(PageTemplateComponentOptimized);
MemoizedPageTemplateComponent.displayName = 'MemoizedPageTemplateComponent';

export const PageTemplateOptimized = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(MemoizedPageTemplateComponent),
);

/**
 * Export individual optimized components for flexibility
 */
export {
  FormHeader as OptimizedFormHeader,
  NavigationButtons as OptimizedNavigationButtons,
  MemoizedSaveFormLink as OptimizedSaveFormLink,
};

export default PageTemplateOptimized;
