import React from 'react';
import Scroll from 'react-scroll';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import FormApp from 'platform/forms-system/src/js/containers/FormApp';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';

import {
  LOAD_STATUSES,
  PREFILL_STATUSES,
  SAVE_STATUSES,
  setFetchFormStatus,
  fetchInProgressForm,
} from './actions';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { isInProgressPath } from '../helpers';
import { getSaveInProgressState } from './selectors';
import environment from 'platform/utilities/environment';

const Element = Scroll.Element;
const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo(
    'topScrollElement',
    window.VetsGov.scroll || {
      duration: 500,
      delay: 0,
      smooth: true,
    },
  );
};

/*
 * Primary component for a schema generated form app.
 */
class RoutedSavableApp extends React.Component {
  constructor(props) {
    super(props);
    this.location = props.location || window.location;
  }
  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillMount() {
    window.addEventListener('beforeunload', this.onbeforeunload);
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
    if (
      status === LOAD_STATUSES.success &&
      newProps.currentLocation &&
      newProps.currentLocation.pathname.endsWith('resume')
    ) {
      newProps.router.replace(newProps.returnUrl);
    } else if (status === LOAD_STATUSES.success) {
      if (newProps.formConfig.onFormLoaded) {
        // The onFormLoaded callback should handle navigating to the start of the form
        newProps.formConfig.onFormLoaded(newProps);
      } else {
        newProps.router.push(newProps.returnUrl);
      }
      // Set loadedStatus in redux to not-attempted to not show the loading page
      newProps.setFetchFormStatus(LOAD_STATUSES.notAttempted);
    } else if (
      newProps.prefillStatus !== this.props.prefillStatus &&
      newProps.prefillStatus === PREFILL_STATUSES.unfilled
    ) {
      newProps.router.push(this.getFirstNonIntroPagePath(newProps));
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
      scrollToTop();
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
    const { currentLocation, autoSavedStatus, formConfig } = this.props;
    const { additionalRoutes = [] } = formConfig;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const additionalSafePaths = additionalRoutes.map(route => route.path);

    let message;
    if (
      autoSavedStatus !== SAVE_STATUSES.success &&
      isInProgressPath(trimmedPathname, additionalSafePaths)
    ) {
      message =
        'Are you sure you wish to leave this application? All progress will be lost.';
      // Chrome requires this to be set
      e.returnValue = message; // eslint-disable-line no-param-reassign
    }
    return message;
  };

  getFirstNonIntroPagePath(props) {
    return getNextPagePath(
      props.routes[props.routes.length - 1].pageList,
      props.formData,
      '/introduction',
    );
  }

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

  removeOnbeforeunload = () => {
    window.removeEventListener('beforeunload', this.onbeforeunload);
  };

  render() {
    const { currentLocation, formConfig, children, loadedStatus } = this.props;
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
        <LoadingIndicator message="Retrieving your profile information..." />
      );
    } else if (!formConfig.disableSave && loadingForm) {
      content = <LoadingIndicator message="Retrieving your saved form..." />;
    } else if (
      !formConfig.disableSave &&
      this.props.savedStatus === SAVE_STATUSES.pending
    ) {
      content = <LoadingIndicator message="Saving your form..." />;
    } else {
      content = (
        <FormApp formConfig={formConfig} currentLocation={currentLocation}>
          {children}
        </FormApp>
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

export { RoutedSavableApp };
