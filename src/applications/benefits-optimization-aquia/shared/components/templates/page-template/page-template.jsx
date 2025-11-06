import PropTypes from 'prop-types';
import React from 'react';

import { useFormSection } from '@bio-aquia/shared/hooks';

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
    sectionName: sectionName || 'default',
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

PageTemplateWithHook.propTypes = {
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
};

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

  const wrapperClasses = ['form-panel', className].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <form noValidate>
        <fieldset className="vads-u-margin-y--2">
          {title && (
            <legend id="root__title">
              <h3 className="vads-u-color--gray-dark vads-u-margin-top--0 vads-u-font-family--serif">
                {title}
              </h3>
            </legend>
          )}

          {subtitle && (
            <div className="vads-u-margin-bottom--2">
              <p className="vads-u-margin--0">{subtitle}</p>
            </div>
          )}

          {renderChildren()}
        </fieldset>

        {!hideNavigation && (
          <div className="vads-u-margin-y--2 vads-u-display--flex vads-u-justify-content--space-between">
            {onReviewPage ? (
              // Review page mode - show Save button (right-aligned)
              <div style={{ marginLeft: 'auto' }}>
                <va-button
                  onClick={e => {
                    e.preventDefault();
                    formSectionProps.handleContinue(() => {
                      if (updatePage) {
                        updatePage();
                      }
                    });
                  }}
                  text="Save"
                  {...navigationProps?.updateButtonProps || {}}
                />
              </div>
            ) : (
              // Normal page mode - show Back/Continue buttons
              <>
                <div>
                  {goBack && (
                    <va-button
                      secondary
                      onClick={goBack}
                      text={navigationProps?.backButtonText || 'Back'}
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
                    text={navigationProps?.continueButtonText || 'Continue'}
                    {...navigationProps?.continueButtonProps || {}}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

PageTemplateBase.propTypes = {
  formSectionProps: PropTypes.object.isRequired,
  goForward: PropTypes.func.isRequired,
  shouldUseHook: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  goBack: PropTypes.func,
  hideNavigation: PropTypes.bool,
  navigationProps: PropTypes.object,
  onReviewPage: PropTypes.bool,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  updatePage: PropTypes.func,
};

/**
 * Generic form page template.
 * Wraps any form content with consistent layout and navigation.
 * Provides form section logic without imposing business requirements.
 * Styled to match VA.gov form patterns.
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
export const PageTemplate = ({
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

PageTemplate.propTypes = {
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
};
