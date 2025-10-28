import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import FormStartControls from 'platform/forms/save-in-progress/FormStartControls';
import {
  fetchInProgressForm,
  removeInProgressForm,
} from 'platform/forms/save-in-progress/actions';

/**
 * Save-in-progress component that checks for saved form data and displays resume controls
 * when a user refreshes or directly navigates to a form page.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.formConfig - Form configuration object
 * @param {React.ReactNode} props.children - Form page content to render
 * @param {boolean} props.isLoggedIn - Whether user is logged in
 * @param {Array} props.savedForms - List of saved forms for current user
 * @param {string} props.loadedStatus - Status of form data loading
 * @param {Object} props.formData - Current form data
 * @param {Object} props.location - React router location
 * @param {Object} props.router - React router instance
 * @returns {React.ReactElement} Form page with save-in-progress controls or normal content
 */
const SaveInProgress = ({
  formConfig,
  children,
  isLoggedIn,
  savedForms,
  loadedStatus,
  formData,
  loadedData,
  location,
  router,
  fetchInProgressFormAction,
  removeInProgressFormAction,
  profileLoading,
}) => {
  const currentForm = formConfig.formId;
  const hasSavedForm = savedForms?.some(
    savedForm => savedForm.form === currentForm,
  );

  /**
   * Determine if current location is a form page (not intro/confirmation/error)
   * Checks the actual path segments to avoid false matches
   */
  const trimmedPathname = location.pathname.replace(/\/$/, '');
  const pathSegments = trimmedPathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || '';

  const isFormPage =
    trimmedPathname !== '/' &&
    lastSegment !== 'introduction' &&
    !trimmedPathname.endsWith('/introduction') &&
    !trimmedPathname.includes('confirmation') &&
    !trimmedPathname.includes('error') &&
    !trimmedPathname.includes('resume');

  /** Check if form data has been loaded */
  const hasFormData = formData && Object.keys(formData).length > 0;

  /**
   * Determine when to show resume controls:
   * - User is logged in
   * - On a form page (not intro/confirmation)
   * - Has a saved form for this form ID
   * - Data hasn't been loaded yet (to avoid showing on normal navigation)
   */
  const shouldShowResumeControls =
    isLoggedIn &&
    isFormPage &&
    hasSavedForm &&
    !hasFormData &&
    (loadedStatus === 'notAttempted' || loadedStatus === 'not-attempted');

  useEffect(
    () => {
      /**
       * Navigate to saved page when data loads successfully
       * This happens when clicking Continue from intro page or resume controls
       * Only navigates if not already on the return URL to prevent loops
       */
      if (
        loadedStatus === 'success' &&
        hasFormData &&
        loadedData?.metadata?.returnUrl
      ) {
        const { returnUrl } = loadedData.metadata;
        if (!location.pathname.includes(returnUrl)) {
          router.push(returnUrl);
        }
      }
    },
    [loadedStatus, hasFormData, loadedData, router, location],
  );

  /**
   * Show loading state while profile is loading
   * Prevents form flash before showing resume controls
   */
  if (isFormPage && profileLoading) {
    const [breadcrumbsElement] = React.Children.toArray(
      children?.props?.children || [],
    );
    return (
      <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
        {breadcrumbsElement}
        <article className="schemaform-intro">
          <va-loading-indicator
            label="Loading"
            message="Checking for saved application..."
          />
        </article>
      </div>
    );
  }

  /** Show loading spinner while form data is being fetched */
  if (loadedStatus === 'pending') {
    const [breadcrumbsElement] = React.Children.toArray(
      children?.props?.children || [],
    );
    return (
      <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
        {breadcrumbsElement}
        <article className="schemaform-intro">
          <va-loading-indicator
            label="Loading"
            message="Loading your saved application..."
          />
        </article>
      </div>
    );
  }

  /** Show resume controls for users with saved form data */
  if (shouldShowResumeControls) {
    const savedForm = savedForms.find(form => form.form === currentForm);
    /** Check if saved form has expired using Unix timestamp */
    const expiresAt =
      savedForm?.metadata?.expiresAt || savedForm?.metadata?.expires_at;
    const isExpired = expiresAt && new Date(expiresAt * 1000) < new Date();

    const message = isExpired
      ? 'Your saved application has expired. Please start a new application.'
      : 'We have saved your application in progress. You can continue where you left off.';

    /**
     * Extract breadcrumbs from children to maintain navigation context
     * while replacing form content with resume controls
     */
    const [breadcrumbsElement] = React.Children.toArray(
      children?.props?.children || [],
    );

    return (
      <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
        {breadcrumbsElement}
        <article className="schemaform-intro">
          <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />

          <p className="vads-u-margin-bottom--3">{message}</p>

          <FormStartControls
            formId={currentForm}
            migrations={formConfig.migrations}
            startPage={formConfig.urlPrefix || '/'}
            prefillAvailable={false}
            prefillTransformer={formConfig.prefillTransformer}
            formSaved
            isExpired={isExpired}
            fetchInProgressForm={fetchInProgressFormAction}
            removeInProgressForm={removeInProgressFormAction}
            router={router}
            routes={router?.routes || [{}, { formConfig }]}
            formConfig={formConfig}
          />
        </article>
      </div>
    );
  }

  /** Render normal form content when no special cases apply */
  return children;
};

SaveInProgress.propTypes = {
  children: PropTypes.node.isRequired,
  fetchInProgressFormAction: PropTypes.func.isRequired,
  formConfig: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  removeInProgressFormAction: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  formData: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  loadedData: PropTypes.object,
  loadedStatus: PropTypes.string,
  profileLoading: PropTypes.bool,
  savedForms: PropTypes.array,
};

/**
 * Map Redux state to component props
 * Checks for user authentication via multiple methods as currentlyLoggedIn
 * flag may not always be reliable
 * @param {Object} state - Redux state
 * @returns {Object} Props mapped from Redux state
 */
const mapStateToProps = state => {
  const hasUserProfile =
    state.user?.profile?.accountUuid || state.user?.profile?.loa?.current === 3;
  const isLoggedIn = Boolean(
    state.user?.login?.currentlyLoggedIn || hasUserProfile,
  );

  return {
    isLoggedIn,
    savedForms: state.user?.profile?.savedForms || [],
    loadedStatus: state.form?.loadedStatus || 'notAttempted',
    formData: state.form?.data || {},
    loadedData: state.form?.loadedData || {},
    profileLoading: state.user?.profile?.loading,
  };
};

const mapDispatchToProps = {
  fetchInProgressFormAction: fetchInProgressForm,
  removeInProgressFormAction: removeInProgressForm,
};

// Export unwrapped component for testing
export { SaveInProgress };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SaveInProgress),
);
