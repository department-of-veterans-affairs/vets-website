import React from 'react';
import Scroll from 'react-scroll';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import SinglePageFormApp from './SinglePageFormApp';
import {
  LOAD_STATUSES,
  PREFILL_STATUSES,
  SAVE_STATUSES,
  setFetchFormStatus,
  fetchInProgressForm
} from '../../../../platform/forms/save-in-progress/actions';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import { isInProgress } from '../../../../platform/forms/helpers';
import { getSaveInProgressState } from '../../../../platform/forms/save-in-progress/selectors';

const Element = Scroll.Element;
const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true
  });
};

/*
 * Primary component for a schema generated form app.
 */
class RoutedSavableSinglePageFormApp extends React.Component {
  componentWillMount() {
    window.addEventListener('beforeunload', this.onbeforeunload);
    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }

    // If on the form’s single page, load saved form / prefill
    const { currentLocation } = this.props;
    const formInProgress = isInProgress(currentLocation.pathname);
    if (formInProgress) {
      // We started on the single form page, so after we know whether
      //  we're logged in or not, we'll load or redirect as needed.
      this.shouldLoadForm = true;
    }
  }

  componentDidMount() {
    // When a user isn't logged in, the profile finishes loading before the component mounts
    if (!this.props.profileIsLoading && this.shouldLoadForm) {
      this.loadForm(this.props);
    }
  }

  componentWillReceiveProps(newProps) {
    // When a user is logged in, the profile finishes loading after the component
    //  has mounted, so we check here.
    // If we're done loading the profile, check to see if we should load or redirect
    if (this.props.profileIsLoading && !newProps.profileIsLoading && this.shouldLoadForm) {
      this.loadForm(newProps);
    }

    const status = newProps.loadedStatus;
    if (status === LOAD_STATUSES.success && newProps.currentLocation && newProps.currentLocation.pathname.endsWith('resume')) {
      newProps.router.replace(newProps.returnUrl);
    } else if (status === LOAD_STATUSES.success) {
      newProps.router.push(newProps.returnUrl);
      // Set loadedStatus in redux to not-attempted to not show the loading page
      newProps.setFetchFormStatus(LOAD_STATUSES.notAttempted);
    } else if (newProps.prefillStatus !== this.props.prefillStatus
      && newProps.prefillStatus === PREFILL_STATUSES.unfilled) {
      newProps.router.push(newProps.routes[this.props.routes.length - 1].pageList[1].path);
    } else if (status !== LOAD_STATUSES.notAttempted
      && status !== LOAD_STATUSES.pending
      && status !== this.props.loadedStatus
      && !window.location.pathname.endsWith('/error')
    ) {
      let action = 'push';
      if (window.location.pathname.endsWith('resume')) {
        action = 'replace';
      }
      newProps.router[action](`${newProps.formConfig.urlPrefix || ''}error`);
    }
  }

  // should scroll up to top while user is waiting for form to load or save
  componentDidUpdate(oldProps) {
    if ((oldProps.loadedStatus !== this.props.loadedStatus &&
      this.props.loadedStatus === LOAD_STATUSES.pending)
      || ((oldProps.savedStatus !== this.props.savedStatus &&
      this.props.savedStatus === SAVE_STATUSES.pending))) {
      scrollToTop();
    }

    if (this.props.savedStatus !== oldProps.savedStatus &&
      this.props.savedStatus === SAVE_STATUSES.success) {
      this.props.router.push(`${this.props.formConfig.urlPrefix || ''}form-saved`);
    }
  }

  // I’m not convinced this is ever executed
  componentWillUnmount() {
    this.removeOnbeforeunload();
  }

  onbeforeunload = e => {
    const { currentLocation, autoSavedStatus } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');

    let message;
    if (autoSavedStatus !== SAVE_STATUSES.success && isInProgress(trimmedPathname)) {
      message = 'Are you sure you wish to leave this application? All progress will be lost.';
      // Chrome requires this to be set
      e.returnValue = message;     // eslint-disable-line no-param-reassign
    }
    return message;
  }

  loadForm(props) {
    // Stop a user that's been redirected to be redirected again after logging in
    this.shouldLoadForm = false;


    const firstPagePath = props.routes[props.routes.length - 1].pageList[0].path;
    // If we're logged in and have a saved / pre-filled form, load that
    if (props.isLoggedIn) {
      const currentForm = props.formConfig.formId;
      const isSaved = props.savedForms.some((savedForm) => savedForm.form === currentForm);
      const hasPrefillData = props.prefillsAvailable.includes(currentForm);
      if (isSaved || hasPrefillData) {
        props.fetchInProgressForm(currentForm, props.formConfig.migrations, !isSaved && hasPrefillData);
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
  }

  render() {
    const { currentLocation, formConfig, children, loadedStatus } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    let content;
    const loadingForm = trimmedPathname.endsWith('resume') || loadedStatus === LOAD_STATUSES.pending;
    if (!formConfig.disableSave && loadingForm && this.props.prefillStatus === LOAD_STATUSES.pending) {
      content = <LoadingIndicator message="Retrieving your profile information..."/>;
    } else if (!formConfig.disableSave && loadingForm) {
      content = <LoadingIndicator message="Retrieving your saved form..."/>;
    } else if (!formConfig.disableSave && this.props.savedStatus === SAVE_STATUSES.pending) {
      content = <LoadingIndicator message="Saving your form..."/>;
    } else if (!formConfig.disableSave && this.shouldLoadForm) {
      content = <LoadingIndicator message="Retrieving your profile information..."/>;
    } else {
      content = (
        <SinglePageFormApp formConfig={formConfig} currentLocation={currentLocation}>
          {children}
        </SinglePageFormApp>
      );
    }

    return (
      <div>
        <Element name="topScrollElement"/>
        {content}
      </div>
    );
  }
}

const mapDispatchToProps = {
  setFetchFormStatus,
  fetchInProgressForm
};

export default withRouter(connect(getSaveInProgressState, mapDispatchToProps)(RoutedSavableSinglePageFormApp));

export { RoutedSavableSinglePageFormApp };
