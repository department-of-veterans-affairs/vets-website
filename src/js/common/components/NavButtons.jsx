import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';

import { getActivePages, getScrollOptions, scrollAndFocus } from '../utils/helpers';

import ProgressButton from '@department-of-veterans-affairs/jean-pants/ProgressButton';

const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', getScrollOptions());
};

const scrollToFirstError = () => {
  setTimeout(() => {
    const errorEl = document.querySelector('.usa-input-error, .input-error-date');
    if (errorEl) {
      scrollAndFocus(errorEl);
    }
  }, 100);
};

export default class NavButtons extends React.Component {
  constructor(props) {
    super(props);
    this.handleContinue = this.handleContinue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findNeighbor = this.findNeighbor.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
  }
  handleContinue(nextPath) {
    if (this.props.path === '/introduction' || this.props.isValid) {
      this.props.onNavigate(nextPath);
      this.props.onComplete(this.props.path);
      scrollToTop();
    } else if (!this.props.isValid) {
      this.props.dirtyPage(this.props.path);
      scrollToFirstError();
    }
  }
  handleSubmit() {
    this.props.onAttemptedSubmit();

    if (this.props.canSubmit) {
      this.props.onSubmit();
    }
  }
  goBack() {
    this.props.onNavigate(this.findNeighbor(-1));
    scrollToTop();
  }
  goForward() {
    this.handleContinue(this.findNeighbor(1));
  }
  findNeighbor(increment) {
    const { pages, path, data } = this.props;
    const filtered = getActivePages(pages, data);
    const currentIndex = filtered.map(page => page.name).indexOf(path);
    const index = currentIndex + increment;
    return filtered[index].name;
  }
  render() {
    const { submission, path } = this.props;

    const backButton = (
      <ProgressButton
        onButtonClick={this.goBack}
        buttonText="Back"
        buttonClass="usa-button-secondary"
        beforeText="«"/>
    );

    const nextButton = (
      <ProgressButton
        onButtonClick={this.goForward}
        buttonText="Continue"
        buttonClass="usa-button-primary"
        afterText="»"/>
    );

    let buttons;
    if (path.endsWith('review-and-submit')) {
      let submitButton;
      let submitMessage;

      if (submission.status === false) {
        submitButton = (
          <ProgressButton
            onButtonClick={this.handleSubmit}
            buttonText="Submit Application"
            buttonClass="usa-button-primary"/>
        );
      } else if (submission.status === 'submitPending') {
        submitButton = (
          <ProgressButton
            onButtonClick={this.handleSubmit}
            buttonText="Sending..."
            disabled
            buttonClass="usa-button-disabled"/>
        );
      } else if (submission.status === 'applicationSubmitted') {
        submitButton = (
          <ProgressButton
            onButtonClick={this.handleSubmit}
            buttonText="Submitted"
            disabled
            buttonClass="form-button-green"
            beforeText="&#10003;"/>
        );
      } else if (submission.status === 'clientError') {
        submitButton = (
          <ProgressButton
            onButtonClick={this.handleSubmit}
            buttonText="Submit Application"
            buttonClass="usa-button-primary"/>
        );
        submitMessage = (
          <div className="usa-alert usa-alert-error schemaform-failure-alert">
            <div className="usa-alert-body">
              <p className="schemaform-warning-header"><strong>We’re sorry, there was an error connecting to Vets.gov.</strong></p>
              <p>Please check your Internet connection and try again. If the problem persists, please contact the Vets.gov Help Desk.</p>
            </div>
          </div>
        );
      } else {
        submitMessage = (
          <div className="usa-alert usa-alert-error">
            <div className="usa-alert-body">
              <p><strong>There is currently an issue with submitting this form. We apologize for the inconvenience.</strong></p>
              <p>Please call <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).</p>
            </div>
          </div>
        );
        submitButton = (
          <ProgressButton
            onButtonClick={this.handleSubmit}
            buttonText="Send Failed"
            disabled
            buttonClass="usa-button-secondary form-button-disabled"
            beforeText="x"/>
        );
      }

      buttons = (<div>
        <div className="row form-progress-buttons">
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
          <div className="columns">
            {submitMessage}
          </div>
        </div>
      </div>);
    } else if (path.endsWith('submit-message')) {
      buttons = (
        <div className="row">
          <div className="small-12 medium-5 columns">
            <a href="/">
              <button className="usa-button-primary">Back to Main Page</button>
            </a>
          </div>
        </div>
      );
    } else if (path.endsWith('introduction')) {
      buttons = (
        <div className="row">
          <div className="small-12 medium-5 columns">
            <ProgressButton
              onButtonClick={this.goForward}
              buttonText="Get Started"
              buttonClass="usa-button-primary"
              afterText="»"/>
          </div>
        </div>
      );
    } else {
      buttons = (
        <div className="row form-progress-buttons">
          <div className="small-6 medium-5 columns">
            {backButton}
          </div>
          <div className="small-6 medium-5 end columns">
            {nextButton}
          </div>
        </div>
      );
    }

    return buttons;
  }
}

NavButtons.propTypes = {
  pages: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  data: PropTypes.object,
  isValid: PropTypes.bool.isRequired,
  canSubmit: PropTypes.bool.isRequired,
  submission: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  onNavigate: PropTypes.func,
  onComplete: PropTypes.func,
  dirtyPage: PropTypes.func,
  onAttemptedSubmit: PropTypes.func
};
