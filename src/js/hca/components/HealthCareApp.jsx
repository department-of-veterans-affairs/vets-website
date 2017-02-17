import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash';
import classNames from 'classnames';

import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';

import environment from '../../common/helpers/environment';

import IntroductionSection from './IntroductionSection.jsx';
import SegmentedProgressBar from '../../common/components/SegmentedProgressBar';
import NavHeader from '../../common/components/NavHeader';
import FormTitle from '../../common/schemaform/FormTitle.jsx';
import ProgressButton from '../../common/components/form-elements/ProgressButton';
import { ensureFieldsInitialized, updateCompletedStatus, updateSubmissionStatus, updateSubmissionId, updateSubmissionTimestamp, setAttemptedSubmit } from '../actions';
import { veteranToApplication } from '../../common/model/veteran';
import { getScrollOptions } from '../../common/utils/helpers';
import * as validations from '../utils/validations';
import { chapters } from '../routes';

// TODO(awong): Find some way to remove code when in production. It might require System.import()
// and a promise.
// import PopulateVeteranButton from './debug/PopulateVeteranButton';
// import PerfPanel from './debug/PerfPanel';
// import RoutesDropdown from './debug/RoutesDropdown';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

class HealthCareApp extends React.Component {
  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkDependencies = this.checkDependencies.bind(this);
    this.getUrl = this.getUrl.bind(this);
    this.removeOnbeforeunload = this.removeOnbeforeunload.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.state = { hasAttemptedSubmit: false };
  }

  componentWillMount() {
    window.addEventListener('beforeunload', this.onbeforeunload); // eslint-disable-line scanjs-rules/call_addEventListener
  }

  componentWillUnmount() {
    this.removeOnbeforeunload();
  }

  onbeforeunload(e) {
    let message;
    if (this.props.location.pathname !== '/introduction') {
      message = 'Are you sure you wish to leave this application? All progress will be lost.';
      // Chrome requires this to be set
      e.returnValue = message;     // eslint-disable-line no-param-reassign
    }
    return message;
  }

  getUrl(direction, markAsComplete) {
    const routes = this.props.route.childRoutes;
    const paths = routes.map((d) => { return d.path; });
    const data = this.props.data;

    let currentPath = this.props.location.pathname;
    if (currentPath === '/') {
      currentPath = '/introduction';
    }
    const currentIndex = paths.indexOf(currentPath);
    const increment = direction === 'back' ? -1 : 1;

    let nextPath = '';
    for (let i = currentIndex; i >= 0 && i <= routes.length; i += increment) {
      const route = routes[i + increment];
      if (route) {
        // Check to see if we should skip the next route
        if (route.depends !== undefined && !this.checkDependencies(route.depends, data)) {
          if (markAsComplete) {
            this.props.onCompletedStatus(route.path);
          }
          continue;
        } else {
          nextPath = route.path;
          break;
        }
      }
    }

    return nextPath;
  }

  checkDependencies(depends, data) {
    const arr = _.isArray(depends) ? depends : [depends];
    for (let i = 0; i < arr.length; i++) {
      if (_.matches(arr[i])(data)) {
        return true;
      }
    }
    return false;
  }

  removeOnbeforeunload() {
    window.removeEventListener('beforeunload', this.onbeforeunload);
  }

  scrollToTop() {
    scroller.scrollTo('topScrollElement', getScrollOptions());
  }

  handleContinue() {
    const path = this.props.location.pathname;
    const formData = this.props.data;
    const sectionFields = this.props.uiState.sections[path].fields;

    this.props.onFieldsInitialized(sectionFields);
    if (validations.isValidSection(path, formData)) {
      this.context.router.push(this.getUrl('next', true));
      this.props.onCompletedStatus(path);
    }
    this.scrollToTop();
  }

  handleBack() {
    this.context.router.push(this.getUrl('back'));
    this.scrollToTop();
  }

  handleSubmit(e) {
    e.preventDefault();
    const veteran = this.props.data;
    const path = this.props.location.pathname;
    let apiUrl = `${window.VetsGov.api.url}/api/hca/v1/application`;
    let formSubmissionId;
    let timestamp;
    const testBuild = __BUILDTYPE__ === 'development' || __BUILDTYPE__ === 'staging';
    const submissionPost = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000, // 10 seconds
      body: veteranToApplication(veteran)
    };

    window.dataLayer.push({ event: 'submit-button-clicked' });
    const formIsValid = validations.isValidForm(veteran);

    // In order to test the new Rails API in staging, we are temporarily changing the
    // endpoints to submit to the new API. Keeping the same endpoints for production.
    if (testBuild) {
      // Allow e2e tests to override API URL
      // Remove the need for a separate code path here
      apiUrl = window.VetsGov.api.url === ''
        ? `${environment.API_URL}/v0/health_care_applications`
        : `${window.VetsGov.api.url}/v0/health_care_applications`;

      submissionPost.body = JSON.stringify({ form: submissionPost.body });
    }

    if (formIsValid && veteran.privacyAgreementAccepted) {
      this.props.onUpdateSubmissionStatus('submitPending');

      // POST data to endpoint
      fetch(apiUrl, submissionPost).then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        // remove event listener
        this.removeOnbeforeunload();

        response.json().then(data => {
          if (testBuild) {
            formSubmissionId = data.formSubmissionId;
            timestamp = data.timestamp;
          } else {
            formSubmissionId = data.response.formSubmissionId;
            timestamp = data.response.timeStamp;
          }

          this.props.onUpdateSubmissionStatus('applicationSubmitted', data);
          this.props.onCompletedStatus(path);
          this.props.onUpdateSubmissionId(formSubmissionId);
          this.props.onUpdateSubmissionTimestamp(timestamp);

          window.dataLayer.push({
            event: 'submission-successful',
            submissionID: formSubmissionId
          });
        });

        setTimeout(() => { // eslint-disable-line scanjs-rules/call_setTimeout
          this.context.router.push(this.getUrl('next'));
          this.scrollToTop();
        }, 1000);
      }).catch(error => {
        // TODO(crew): Pass meaningful errors to the client.
        setTimeout(() => { // eslint-disable-line scanjs-rules/call_setTimeout
          this.props.onUpdateSubmissionStatus('submitFailed', error);
        }, 5000);

        window.dataLayer.push({
          event: 'submission-failed',
          submissionError: error
        });
      });
    } else {
      // don't scroll if the form is valid but privacy box isn't checked
      if (!formIsValid) {
        this.scrollToTop();
        // TODO(crew): Decide on/add validation error message.
      } else {
        this.props.setAttemptedSubmit();
      }
    }
  }

  render() {
    let children = this.props.children;
    let buttons;
    let submitButton;
    let submitMessage;
    const submissionStatus = this.props.uiState.submission.status;

    if (children === null) {
      // This occurs if the root route is hit. Default to IntroductionSection.
      children = <IntroductionSection/>;
    }

    // TODO(crew): Move these buttons into sections.
    const backButton = (
      <ProgressButton
          onButtonClick={this.handleBack}
          buttonText="Back"
          buttonClass="usa-button-outline"
          beforeText="«"/>
    );

    const nextButton = (
      <ProgressButton
          onButtonClick={this.handleContinue}
          buttonText="Continue"
          buttonClass="usa-button-primary"
          afterText="»"/>
    );

    if (submissionStatus === false) {
      submitButton = (
        <ProgressButton
            onButtonClick={this.handleSubmit}
            buttonText="Submit Application"
            buttonClass="usa-button-primary"/>
      );
    } else if (submissionStatus === 'submitPending') {
      submitButton = (
        <ProgressButton
            onButtonClick={this.handleSubmit}
            buttonText="Sending..."
            buttonClass="usa-button-disabled"/>
      );
    } else if (submissionStatus === 'applicationSubmitted') {
      submitButton = (
        <ProgressButton
            onButtonClick={this.handleSubmit}
            buttonText="Submitted"
            buttonClass="hca-button-green"
            beforeText="&#10003;"/>
      );
    } else {
      submitMessage = (<div className="usa-alert usa-alert-error">
        <div className="usa-alert-body">
          <span><strong>Due to a system error, we weren't able to process your application. Please try again later.</strong></span>
          <span>We apologize for the inconvenience. If you'd like to complete this form by phone, please call 877-222-VETS (8387) and press 2, M-F 7:00 a.m.to 7:00 p.m. (CST), Sat 9:00 a.m. to 5:30 p.m. (CST).</span>
        </div>
      </div>);
      submitButton = (
        <ProgressButton
            onButtonClick={this.handleSubmit}
            buttonText="Send Failed"
            buttonClass="usa-button-secondary hca-button-disabled"
            beforeText="x"/>
      );
    }

    if (this.props.location.pathname === '/review-and-submit') {
      buttons = (<div>
        <div className="row progress-buttons">
          <div className="small-6 medium-5 columns">
            {backButton}
          </div>
          <div className="small-6 medium-5 columns">
            {submitButton}
          </div>
          <div className="small-1 medium-1 end columns">
            <div className={this.state ? 'spinner' : 'hidden'}>&nbsp;</div>
          </div>
        </div>
        <div className="row">
          <div className="medium-12 columns">
          {submitMessage}
          </div>
        </div>
      </div>);
    } else if (this.props.location.pathname === '/introduction') {
      buttons = (
        <div className="row progress-buttons">
          <div className="small-6 medium-5 columns">
            <ProgressButton
                onButtonClick={this.handleContinue}
                buttonText="Get Started"
                buttonClass="usa-button-primary"
                afterText="»"/>
          </div>
        </div>
      );
    } else if (this.props.location.pathname === '/submit-message') {
      buttons = (
        <div className="row progress-buttons">
          <div className="small-6 medium-5 columns">
            {/* TODO: Figure out where this button should take the user. */}
            <a href="/">
              <button className="usa-button-primary">Back to Main Page</button>
            </a>
          </div>
        </div>
      );
    } else {
      buttons = (
        <div className="row progress-buttons">
          <div className="small-6 medium-5 columns">
            {backButton}
          </div>
          <div className="small-6 medium-5 end columns">
            {nextButton}
          </div>
        </div>
      );
    }

    // This no longer works
    // let devPanel = undefined;
    // if (__DEV__) {
    //   const queryParams = _.fromPairs(
    //     window.location.search.substring(1).split('&').map((v) => { return v.split('='); }));
    //   if (queryParams.devPanel === '1') {
    //     devPanel = (
    //       <div className="row">
    //         <RoutesDropdown/>
    //         <PopulateVeteranButton/>
    //         <PerfPanel/>
    //       </div>
    //     );
    //   }
    // }

    // Until we come up with a common code base between this and the schemaform
    //  forms, the following is borrowed from NavHeader
    let step;
    chapters.forEach((chapter, index) => {
      if (chapter.pages.some(page => page.path === this.props.location.pathname)) {
        step = index + 1;
      }
    });

    let contentClass = classNames(
      'progress-box',
      'progress-box-schemaform',
      // Align the intro and confirmation content with the title
      { 'intro-content': _.includes(['/introduction', '/submit-message'], this.props.location.pathname) }
    );

    return (
      <div>
        <div className="row">
          <Element name="topScrollElement"/>
          {/*
          <div className="medium-4 columns show-for-medium-up">
            <Nav
                data={this.props.data}
                pages={this.props.uiState.sections}
                chapters={chapters}
                currentUrl={this.props.location.pathname}/>
          </div>
          */}
          <div className="medium-8 columns">
            <FormTitle title="Apply online for health care with the 10-10ez" subTitle="OMB No. 2900-0091"/>
            <div>
              {!_.includes(['/introduction', '/submit-message'], this.props.location.pathname) && <SegmentedProgressBar total={chapters.length} current={step}/>}
              <div className="schemaform-chapter-progress">
                <NavHeader path={this.props.location.pathname} chapters={chapters} className="nav-header-schemaform"/>
              </div>
            </div>
            <div className={contentClass}>
            {/* TODO: Figure out why <form> adds fields to url, and change action to reflect actual action for form submission. */}
              <div className="form-panel">
                {children}
                {buttons}
              </div>
            </div>
          </div>
        </div>
        <span className="js-test-location hidden" data-location={this.props.location.pathname} hidden></span>
      </div>
    );
  }
}

HealthCareApp.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    data: state.veteran,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateSubmissionStatus: (value) => {
      dispatch(updateSubmissionStatus(value));
    },
    onUpdateSubmissionId: (value) => {
      dispatch(updateSubmissionId(value));
    },
    onUpdateSubmissionTimestamp: (value) => {
      dispatch(updateSubmissionTimestamp(value));
    },
    onFieldsInitialized: (field) => {
      dispatch(ensureFieldsInitialized(field));
    },
    onCompletedStatus: (route) => {
      dispatch(updateCompletedStatus(route));
    },
    setAttemptedSubmit: (...args) => {
      dispatch(setAttemptedSubmit(...args));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(HealthCareApp);
export { HealthCareApp };
