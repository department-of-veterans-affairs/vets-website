import React from 'react';
import moment from 'moment';
import Scroll from 'react-scroll';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import FormNav from './FormNav';
import FormTitle from './FormTitle';
import AskVAQuestions from './AskVAQuestions';
import {
  LOAD_STATUSES,
  PREFILL_STATUSES,
  SAVE_STATUSES,
  setFetchFormStatus,
  fetchInProgressForm
} from './save-load-actions';
import LoadingIndicator from '../components/LoadingIndicator';

import { isInProgress } from '../utils/helpers';

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
  }
});

/*
 * Primary component for a schema generated form app.
 */
class FormApp extends React.Component {
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
    const devRedirect = __BUILDTYPE__ !== 'development' || currentLocation.search.includes('redirect');
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
      newProps.router.push(newProps.routes[this.props.routes.length - 1].pageList[0].path);
    } else if (status !== LOAD_STATUSES.notAttempted
      && status !== LOAD_STATUSES.pending
      && status !== this.props.loadedStatus
      && !window.location.pathname.endsWith('/error')
    ) {
      newProps.router.push(`${newProps.formConfig.urlPrefix || ''}error`);
    } else if (newProps.savedStatus !== this.props.savedStatus &&
      newProps.savedStatus === SAVE_STATUSES.success) {
      newProps.router.push(`${newProps.formConfig.urlPrefix || ''}form-saved`);
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
  }

  // I’m not convinced this is ever executed
  componentWillUnmount() {
    this.removeOnbeforeunload();
  }

  onbeforeunload = e => {
    const { currentLocation } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');

    let message;
    if (isInProgress(trimmedPathname)) {
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
      const isPrefill = props.prefillsAvailable.includes(currentForm);
      const saveEnabled = !this.props.formConfig.disableSave;
      if (saveEnabled && (isSaved || isPrefill)) {
        props.fetchInProgressForm(currentForm, props.formConfig.migrations, isPrefill);
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
    const { currentLocation, formConfig, children, formData, loadedStatus } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const isIntroductionPage = trimmedPathname.endsWith('introduction');
    const isConfirmationPage = trimmedPathname.endsWith('confirmation');
    const GetFormHelp = formConfig.getHelp;
    let content;
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


    return (
      <div>
        <div className="row">
          <Element name="topScrollElement"/>
          <div className="usa-width-two-thirds medium-8 columns">
            {
              formConfig.title &&
              // If we’re on the introduction page, show the title if we’re actually on the loading screen
              (!isIntroductionPage || this.props.loadedStatus !== LOAD_STATUSES.notAttempted) &&
                <FormTitle title={formConfig.title} subTitle={formConfig.subTitle}/>
            }
            {content}
          </div>
        </div>
        {!isConfirmationPage && <AskVAQuestions>
          {!!GetFormHelp && <GetFormHelp/>}
        </AskVAQuestions>}
        <span className="js-test-location hidden" data-location={trimmedPathname} hidden></span>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loadedStatus: state.form.loadedStatus,
  savedStatus: state.form.savedStatus,
  prefillStatus: state.form.prefillStatus,
  returnUrl: state.form.loadedData.metadata.returnUrl,
  formData: state.form.data,
  isLoggedIn: state.user.login.currentlyLoggedIn,
  savedForms: state.user.profile.savedForms,
  prefillsAvailable: state.user.profile.prefillsAvailable,
  profileIsLoading: state.user.profile.loading
});

const mapDispatchToProps = {
  setFetchFormStatus,
  fetchInProgressForm
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormApp));

export { FormApp };
