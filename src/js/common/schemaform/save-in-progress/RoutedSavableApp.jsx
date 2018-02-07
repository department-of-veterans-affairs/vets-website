import React from 'react';
import moment from 'moment';
import Scroll from 'react-scroll';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import FormNav from '../components/FormNav';
import FormTitle from '../components/FormTitle';
import AlertBox from '../../components/AlertBox';
import {
  LOAD_STATUSES,
  PREFILL_STATUSES,
  SAVE_STATUSES,
  setFetchFormStatus,
  fetchInProgressForm
} from './actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import { serviceStatus } from '../../containers/DowntimeNotification';

import { isInProgress } from '../../utils/helpers';
import { getSaveInProgressState } from './selectors';

const Element = Scroll.Element;
const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true
  });
};

moment.updateLocale('en', {
  meridiem: (hour) => {
    if (hour < 12) {
      return 'a.m.';
    }
    return 'p.m.';
  },
  monthsShort: [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May',
    'June',
    'July',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.'
  ]
});

/*
 * Primary component for a schema generated form app.
 */
class RoutedSavableApp extends React.Component {
  componentWillMount() {
    window.addEventListener('beforeunload', this.onbeforeunload);
    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }

    // If we start in the middle of a form, redirect to the beginning or load
    //  saved form / prefill
    // If we're in production, we'll redirect if we start in the middle of a form
    // In development, we won't redirect unless we append the URL with `?redirect`
    const { currentLocation } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const resumeForm = trimmedPathname.endsWith('resume');
    const devRedirect = (__BUILDTYPE__ !== 'development' && !currentLocation.search.includes('skip'))
      || currentLocation.search.includes('redirect');
    const goToStartPage = resumeForm || devRedirect;
    if (isInProgress(currentLocation.pathname) && goToStartPage) {
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

  componentWillReceiveProps(newProps) {
    // When a user is logged in, the profile finishes loading after the component
    //  has mounted, so we check here.
    // If we're done loading the profile, check to see if we should load or redirect
    if (this.props.profileIsLoading && !newProps.profileIsLoading && this.shouldRedirectOrLoad) {
      this.redirectOrLoad(newProps);
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

  redirectOrLoad(props) {
    // Stop a user that's been redirected to be redirected again after logging in
    this.shouldRedirectOrLoad = false;


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

  renderDowntimeAlert({ startTime, endTime }) {
    let headline, alertContent;
    if (endTime) {
      headline = `We won't be able to accept applications from ${startTime.format('MMMM Do, LT')} to ${endTime.format('MMMM Do, LT')}`;
      alertContent = (
        <p>We’re going to be making some updates to this application from {startTime.format('MMMM Do, LT')} to {endTime.format('MMMM Do, LT')}** During this time, you’ll still be able to fill out the application. And, if you’re signed in to Vets.gov, you’ll be able to save your information. But you won’t be able to submit your application until we’re finished with our updates. Please save your application and come back after {endTime.format('MMMM Do, LT')} to submit it.</p>
      );
    } else {
      headline = `Please save your application and come back to submit it after ${startTime.format('MMMM Do, LT')}`;
      alertContent = (
        <p>We’re making some updates to this application right now. You can still fill out the application. And, if you’re signed in to Vets.gov, you can save your information. But you won’t be able to submit your application until we’re finished with our updates. Please save your application and come back after {startTime.format('MMMM Do, LT')} to submit it.</p>
      );
    }
    return (
      <div className="form-warning-banner">
        <AlertBox
          headline={headline}
          content={alertContent}
          isVisible
          status="warning"/>
      </div>
    );
  }

  render() {
    const { currentLocation, formConfig, children, formData, loadedStatus, downtimeStatus } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const isIntroductionPage = trimmedPathname.endsWith('introduction');
    let content, downtimeAlert;
    const loadingForm = trimmedPathname.endsWith('resume') || loadedStatus === LOAD_STATUSES.pending;
    if (!formConfig.disableSave && loadingForm) {
      content = <LoadingIndicator message="Retrieving your saved form..."/>;
    } else if (!formConfig.disableSave && this.props.savedStatus === SAVE_STATUSES.pending) {
      content = <LoadingIndicator message="Saving your form..."/>;
    } else if (!formConfig.disableSave && this.shouldRedirectOrLoad) {
      content = <LoadingIndicator message="Retrieving your profile information..."/>;
    } else if (!isInProgress(trimmedPathname)) {
      content = children;
    } else {
      content = (
        <div>
          <FormNav formData={formData} formConfig={formConfig} currentPath={trimmedPathname}/>
          <div className="progress-box progress-box-schemaform">
            {children}
          </div>
        </div>
      );
    }

    if (downtimeStatus && ((downtimeStatus.status === serviceStatus.down) || (downtimeStatus.status === serviceStatus.downtimeApproaching))) {
      downtimeAlert = this.renderDowntimeAlert(downtimeStatus);
    }
    return (
      <div>
        <Element name="topScrollElement"/>
        {
          formConfig.title &&
          // If we’re on the introduction page, show the title if we’re actually on the loading screen
          (!isIntroductionPage || this.props.loadedStatus !== LOAD_STATUSES.notAttempted) &&
            <FormTitle title={formConfig.title} subTitle={formConfig.subTitle}/>
        }
        {downtimeAlert}
        {content}
      </div>
    );
  }
}

const mapDispatchToProps = {
  setFetchFormStatus,
  fetchInProgressForm
};

export default withRouter(connect(getSaveInProgressState, mapDispatchToProps)(RoutedSavableApp));

export { RoutedSavableApp };
