import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import FormApp from 'platform/forms-system/src/js/containers/FormApp';
import {
  getNextPagePath,
  checkValidPagePath,
} from 'platform/forms-system/src/js/routing';

import {
  Element,
  scrollToTop,
  getScrollOptions,
} from 'platform/utilities/scroll';
import environment from 'platform/utilities/environment';
import { restartShouldRedirect } from 'platform/site-wide/wizard';
import {
  LOAD_STATUSES,
  PREFILL_STATUSES,
  SAVE_STATUSES,
  setFetchFormStatus,
  fetchInProgressForm,
} from './actions';

import { isInProgressPath } from '../helpers';
import { getSaveInProgressState } from './selectors';
import { APP_TYPE_DEFAULT } from '../../forms-system/src/js/constants';

/*
 * Primary component for a schema generated form app.
 */
class RoutedSavableApp extends React.Component {
  constructor(props) {
    super(props);
    this.FormApp = props.FormApp || FormApp;
    this.location = props.location || window.location;
  }

  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillMount() {
    window.addEventListener('beforeunload', this.onbeforeunload);
    document.body.addEventListener('click', this.checkExitFormLink, true);

    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }

    // If we start in the middle of a form, redirect to the beginning or load
    //  saved form / prefill
    // If we're in production, we'll redirect if we start in the middle of a form
    // In development, we won't redirect unless we append the URL with `?redirect`
    const { currentLocation, formConfig } = this.props;
    const { additionalRoutes = [] } = formConfig;
    const additionalSafePaths =
      additionalRoutes && additionalRoutes.map(route => route.path);
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const resumeForm = trimmedPathname.endsWith('resume');
    const devRedirect =
      (!environment.isLocalhost() &&
        !currentLocation.search.includes('skip')) ||
      currentLocation.search.includes('redirect');
    const goToStartPage = resumeForm || devRedirect;
    if (
      isInProgressPath(currentLocation.pathname, additionalSafePaths) &&
      goToStartPage
    ) {
      // We started on a page that isn't the first, so after we know whether
      //  we're logged in or not, we'll load or redirect as needed.
      this.shouldRedirectOrLoad = true;
    }
  }

  componentDidMount() {
    // When a user isn't logged in, the profile finishes loading before the component mounts
    if (!this.props.profileIsLoading && this.shouldRedirectOrLoad) {
      this.redirectOrLoad(this.props);
    }
  }

  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillReceiveProps(newProps) {
    // When a user is logged in, the profile finishes loading after the component
    //  has mounted, so we check here.
    // If we're done loading the profile, check to see if we should load or redirect
    if (
      this.props.profileIsLoading &&
      !newProps.profileIsLoading &&
      this.shouldRedirectOrLoad
    ) {
      this.redirectOrLoad(newProps);
    }

    const status = newProps.loadedStatus;
    if (status === LOAD_STATUSES.success) {
      // Redirect-time normalization: allow form to rewrite returnUrl (e.g. array-builder item page → summary) so resume lands on a stable page
      const returnUrlToUse =
        typeof newProps.formConfig?.normalizeReturnUrl === 'function'
          ? newProps.formConfig.normalizeReturnUrl(newProps.returnUrl)
          : newProps.returnUrl;
      const propsWithNormalizedReturnUrl = {
        ...newProps,
        returnUrl: returnUrlToUse,
      };

      if (
        newProps.currentLocation &&
        newProps.currentLocation.pathname.endsWith('resume')
      ) {
        newProps.router.replace(returnUrlToUse);
      } else if (newProps.formConfig.onFormLoaded) {
        // The onFormLoaded callback should handle navigating to the start of the form
        newProps.formConfig.onFormLoaded(propsWithNormalizedReturnUrl);
      } else {
        // Check that returnUrl is an active page. If not, return to first page
        // after intro page
        const isValidReturnUrl = checkValidPagePath(
          newProps.routes[newProps.routes.length - 1].pageList,
          newProps.formData,
          returnUrlToUse,
        );
        newProps.router.push(
          isValidReturnUrl
            ? returnUrlToUse
            : this.getFirstNonIntroPagePath(newProps),
        );
      }
      // Set loadedStatus in redux to not-attempted to not show the loading page
      newProps.setFetchFormStatus(LOAD_STATUSES.notAttempted);
    } else if (
      newProps.prefillStatus !== this.props.prefillStatus &&
      newProps.prefillStatus === PREFILL_STATUSES.unfilled
    ) {
      let newRoute;
      const { formConfig = {} } = newProps;
      const { saveInProgress = {} } = formConfig;
      if (
        newProps.isStartingOver &&
        typeof saveInProgress.restartFormCallback === 'function' &&
        restartShouldRedirect(formConfig.wizardStorageKey)
      ) {
        // Restart callback returns a new route
        newRoute = saveInProgress?.restartFormCallback();
      }

      // Form restart redirects to new route or the first page after the intro
      newProps.router.push(newRoute || this.getFirstNonIntroPagePath(newProps));
    } else if (
      status !== LOAD_STATUSES.notAttempted &&
      status !== LOAD_STATUSES.pending &&
      status !== this.props.loadedStatus &&
      !this.location.pathname.endsWith('/error')
    ) {
      let action = 'push';
      if (this.location.pathname.endsWith('resume')) {
        action = 'replace';
      }
      newProps.router[action](`${newProps.formConfig.urlPrefix || ''}error`);
    }
  }

  // should scroll up to top while user is waiting for form to load or save
  componentDidUpdate(oldProps) {
    if (
      (oldProps.loadedStatus !== this.props.loadedStatus &&
        this.props.loadedStatus === LOAD_STATUSES.pending) ||
      (oldProps.savedStatus !== this.props.savedStatus &&
        this.props.savedStatus === SAVE_STATUSES.pending)
    ) {
      scrollToTop('topScrollElement', getScrollOptions());
    }

    if (
      this.props.savedStatus !== oldProps.savedStatus &&
      this.props.savedStatus === SAVE_STATUSES.success
    ) {
      this.props.router.push(
        `${this.props.formConfig.urlPrefix || ''}form-saved`,
      );
    }
  }

  // I’m not convinced this is ever executed
  componentWillUnmount() {
    this.removeOnbeforeunload();
  }

  onbeforeunload = e => {
    const { currentLocation = {}, autoSavedStatus, formConfig } = this.props;

    const isCypressRunningInCI =
      typeof Cypress !== 'undefined' && Cypress.env('CI');

    // Disable browser window unload alert. This may prevent 40 minute timeout
    // errors in CI
    if (
      formConfig.dev?.disableWindowUnloadInCI &&
      (isCypressRunningInCI ||
        currentLocation.href?.startsWith('http://localhost'))
    ) {
      return null;
    }

    const { additionalRoutes = [] } = formConfig;
    const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const additionalSafePaths = additionalRoutes.map(route => route.path);
    let message;
    if (
      autoSavedStatus !== SAVE_STATUSES.success &&
      isInProgressPath(trimmedPathname, additionalSafePaths)
    ) {
      message = `Are you sure you wish to leave this ${appType}? All progress will be lost.`;
      // Chrome requires this to be set
      e.returnValue = message; // eslint-disable-line no-param-reassign
    }
    return message;
  };

  // eslint-disable-next-line class-methods-use-this
  getFirstNonIntroPagePath(props) {
    return getNextPagePath(
      props.routes[props.routes.length - 1].pageList,
      props.formData,
      `${props.formConfig?.urlPrefix || '/'}introduction`,
    );
  }

  removeOnbeforeunload = () => {
    window.removeEventListener('beforeunload', this.onbeforeunload);
    document.body.removeEventListener('click', this.checkExitFormLink);
  };

  // Allow va-link, va-button, or button (progress buttons) to leave form flow
  // without showing browser window unload alert
  checkExitFormLink = ({ target }) => {
    if (
      ['VA-LINK', 'VA-BUTTON', 'BUTTON'].includes(target.tagName) &&
      target.classList.contains('exit-form')
    ) {
      this.removeOnbeforeunload();
    }
  };

  redirectOrLoad(props) {
    // Stop a user that's been redirected from being redirected again after
    // logging in
    this.shouldRedirectOrLoad = false;

    const firstPagePath =
      props.routes[props.routes.length - 1].pageList[0].path;
    const firstNonIntroPagePath = this.getFirstNonIntroPagePath(props);
    // If we're logged in and have a saved / pre-filled form, load that
    if (props.isLoggedIn) {
      const currentForm = props.formConfig.formId;
      const isSaved = props.savedForms.some(
        savedForm => savedForm.form === currentForm,
      );
      const hasPrefillData = props.prefillsAvailable.includes(currentForm);

      if (isSaved) {
        props.fetchInProgressForm(
          currentForm,
          props.formConfig.migrations,
          false,
          props.formConfig.prefillTransformer,
        );
      } else if (props.skipPrefill) {
        // Just need to go to the page after the introduction
        props.router.replace(firstNonIntroPagePath);
      } else if (hasPrefillData) {
        props.fetchInProgressForm(
          currentForm,
          props.formConfig.migrations,
          true,
          props.formConfig.prefillTransformer,
        );
      } else {
        // No forms to load; go to the beginning
        // If the first page is not the intro and uses `depends`, this will probably break
        props.router.replace(firstPagePath);
      }
    } else {
      // Can't load a form; go to the beginning
      // If the first page is not the intro and uses `depends`, this will probably break
      props.router.replace(firstPagePath);
    }
  }

  render() {
    const { currentLocation, formConfig, children, loadedStatus } = this.props;
    const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    let content;
    const loadingForm =
      trimmedPathname.endsWith('resume') ||
      loadedStatus === LOAD_STATUSES.pending;
    if (
      (!formConfig.disableSave &&
        loadingForm &&
        this.props.prefillStatus === PREFILL_STATUSES.pending) ||
      (!formConfig.disableSave && this.shouldRedirectOrLoad)
    ) {
      content = (
        <va-loading-indicator
          label="Loading"
          message="Retrieving your profile information..."
        />
      );
    } else if (!formConfig.disableSave && loadingForm) {
      content = (
        <va-loading-indicator
          label="Loading"
          message={`Retrieving your saved ${appType}...`}
        />
      );
    } else if (
      !formConfig.disableSave &&
      this.props.savedStatus === SAVE_STATUSES.pending
    ) {
      content = (
        <va-loading-indicator
          label="Loading"
          message={`Saving your ${appType}...`}
        />
      );
    } else {
      content = (
        <this.FormApp formConfig={formConfig} currentLocation={currentLocation}>
          {children}
        </this.FormApp>
      );
    }

    return (
      <div>
        <Element name="topScrollElement" />
        {content}
      </div>
    );
  }
}

const mapDispatchToProps = {
  setFetchFormStatus,
  fetchInProgressForm,
};

export default withRouter(
  connect(
    getSaveInProgressState,
    mapDispatchToProps,
  )(RoutedSavableApp),
);

RoutedSavableApp.propTypes = {
  FormApp: PropTypes.any,
  autoSavedStatus: PropTypes.string,
  children: PropTypes.any,
  currentLocation: PropTypes.shape({
    href: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  formConfig: PropTypes.shape({
    additionalRoutes: PropTypes.array,
    customText: PropTypes.shape({
      appType: PropTypes.string,
    }),
    dev: PropTypes.shape({
      disableWindowUnloadInCI: PropTypes.bool,
    }),
    formOptions: PropTypes.shape({
      ignorePageUnloadAlertOnUrls: PropTypes.arrayOf(PropTypes.string),
    }),
    disableSave: PropTypes.bool,
    normalizeReturnUrl: PropTypes.func,
    urlPrefix: PropTypes.string,
  }),
  loadedStatus: PropTypes.string,
  location: PropTypes.object,
  prefillStatus: PropTypes.string,
  profileIsLoading: PropTypes.bool,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  savedStatus: PropTypes.string,
};

export { RoutedSavableApp };
