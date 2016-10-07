import React from 'react';
import Scroll from 'react-scroll';

import { getActivePages } from '../utils/helpers';

import ProgressButton from '../../common/components/form-elements/ProgressButton';

const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
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
    } else if (!this.props.isValid) {
      this.props.dirtyPage(this.props.path);
    }
  }
  handleSubmit() {
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
    scrollToTop();
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
          buttonClass="usa-button-outline"
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
    if (path === '/review-and-submit') {
      let submitButton;
      let submitMessage;

      if (submission.status === false) {
        submitButton = (
          <ProgressButton
              disabled={!this.props.canSubmit}
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
      } else {
        submitMessage = (
          <div className="usa-alert usa-alert-error">
            <div className="usa-alert-body">
              <p><strong>Due to a system error, we weren't able to process your application. Please try again later.</strong></p>
              <p>We apologize for the inconvenience. If you'd like to complete this form by phone, please call 877-222-VETS (8387) and press 2, M-F 7:00 a.m.to 7:00 p.m. (CST), Sat 9:00 a.m. to 5:30 p.m. (CST).</p>
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
    } else if (path === '/submit-message') {
      buttons = (
        <div className="row form-progress-buttons">
          <div className="small-6 medium-5 columns">
            <a href="/">
              <button className="usa-button-primary">Back to Main Page</button>
            </a>
          </div>
        </div>
      );
    } else if (path === '/introduction') {
      buttons = (
        <div className="row form-progress-buttons">
          <div className="small-6 medium-5 columns">
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
  pages: React.PropTypes.array.isRequired,
  path: React.PropTypes.string.isRequired,
  data: React.PropTypes.object,
  isValid: React.PropTypes.bool.isRequired,
  canSubmit: React.PropTypes.bool.isRequired,
  submission: React.PropTypes.object.isRequired,
  onSubmit: React.PropTypes.func,
  onNavigate: React.PropTypes.func,
  onComplete: React.PropTypes.func,
  dirtyPage: React.PropTypes.func
};
