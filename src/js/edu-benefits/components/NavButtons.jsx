import React from 'react';

// TODO update this when progress button moves
import ProgressButton from '../../hca/components/ProgressButton';

export default class NavButtons extends React.Component {
  constructor(props) {
    super(props);
    this.handleContinue = this.handleContinue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleContinue(nextPath) {
    if (this.props.path === '/introduction' || this.props.isValid) {
      this.props.onNavigate(nextPath);
      this.props.onComplete(this.props.path);
    } else if (!this.props.isValid) {
      this.props.dirtyFields(this.props.path);
    }
  }
  handleSubmit() {
    if (this.props.isValid) {
      this.props.onSubmit();
    }
  }
  render() {
    const { submission, sections, path } = this.props;
    const currentIndex = sections.indexOf(path);
    const nextPath = currentIndex + 1 < sections.length ? sections[currentIndex + 1] : null;
    const previousPath = currentIndex - 1 >= 0 ? sections[currentIndex - 1] : null;

    const goBack = () => this.props.onNavigate(previousPath);
    const goForward = () => this.handleContinue(nextPath);

    const backButton = (
      <ProgressButton
          onButtonClick={goBack}
          buttonText="Back"
          buttonClass="usa-button-outline"
          beforeText="«"/>
    );

    const nextButton = (
      <ProgressButton
          onButtonClick={goForward}
          buttonText="Continue"
          buttonClass="usa-button-primary"
          afterText="»"/>
    );

    if (path === '/review-and-submit') {
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
              buttonClass="usa-button-disabled"/>
        );
      } else if (submission.status === 'applicationSubmitted') {
        submitButton = (
          <ProgressButton
              onButtonClick={this.handleSubmit}
              buttonText="Submitted"
              buttonClass="form-button-green"
              beforeText="&#10003;"/>
        );
      } else {
        submitMessage = (<div className="usa-alert usa-alert-error">
          <p><strong>Due to a system error, we weren't able to process your application. Please try again later.</strong></p>
          <p>We apologize for the inconvenience. If you'd like to complete this form by phone, please call 877-222-VETS (8387) and press 2, M-F 7:00 a.m.to 7:00 p.m. (CST), Sat 9:00 a.m. to 5:30 p.m. (CST).</p>
        </div>);
        submitButton = (
          <ProgressButton
              onButtonClick={this.handleSubmit}
              buttonText="Send Failed"
              buttonClass="usa-button-secondary form-button-disabled"
              beforeText="x"/>
        );
      }

      return (<div>
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
    } else if (path === '/submit-message') {
      return (
        <div className="row progress-buttons">
          <div className="small-6 medium-5 columns">
            {/* TODO: Figure out where this button should take the user. */}
            <a href="/">
              <button className="usa-button-primary">Back to Main Page</button>
            </a>
          </div>
        </div>
      );
    } else if (path === '/introduction') {
      return (
        <div className="row progress-buttons">
          <div className="small-6 medium-5 columns">
            <ProgressButton
                onButtonClick={goForward}
                buttonText="Get Started"
                buttonClass="usa-button-primary"
                afterText="»"/>
          </div>
        </div>
      );
    }

    return (
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
}

NavButtons.propTypes = {
  path: React.PropTypes.string.isRequired,
  isValid: React.PropTypes.bool,
  sections: React.PropTypes.array.isRequired,
  submission: React.PropTypes.object.isRequired,
  onSubmit: React.PropTypes.func,
  onNavigate: React.PropTypes.func,
  onComplete: React.PropTypes.func,
  dirtyFields: React.PropTypes.func
};
