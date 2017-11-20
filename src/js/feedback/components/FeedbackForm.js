import React from 'react';
import PropTypes from 'prop-types';

class FeedbackForm extends React.Component {

    constructor(){
      super();
      this.feedbackChanged = this.feedbackChanged.bind(this);
      this.shouldSendResponseChanged = this.shouldSendResponseChanged.bind(this);
      this.emailChanged = this.emailChanged.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.state = {
        shouldSendResponse: false,
        feedback: '',
        email: ''
      };
    }

    feedbackChanged({ target: { value: feedback }}){
      this.setState({ feedback });
    }

    shouldSendResponseChanged({ target: { checked: shouldSendResponse }}){
      this.setState({ shouldSendResponse });
    }

    emailChanged({ target: { value: email }}){
      this.setState({ email });
    }

    onSubmit(event){
      event.preventDefault();
      this.props.sendFeedback(this.state);
    }

    render(){
      return (
        <form className="feedback-form" onSubmit={this.onSubmit}>
          <h4 className="feedback-widget-title">Tell us what you think</h4>
          <label htmlFor="feedback">What can we do to make Vets.gov better?</label>
          <div className="row va-flex">
            <div className="feedback-widget-form">
              <textarea name="feedback" value={this.state.feedback} onChange={this.feedbackChanged}/>
            </div>
            <div className="feedback-widget-need-help">
              <div className="feedback-widget-need-help-inner">
                <h3>Need help?</h3>
                Calls the Vets.gov Help Desk<br/>
                <a href="tel:18555747286">1-855-574-7286</a><br/>
                TTY:&nbsp;<a href="tel:+18008778339">1-800-877-8339</a><br/>
                Monday – Friday, 8:00 a.m. – 8:00 p.m. (<abbr title="eastern time">ET</abbr>)
              </div>
            </div>
          </div>
          <input id="should-send-response" type="checkbox" value={this.state.shouldSendResponse} onChange={this.shouldSendResponseChanged} />
          <label htmlFor="should-send-response">I would like to receive a response about my feedback.</label>
          <div className="usa-grid-full">
            <div className="usa-width-one-third">
              {this.state.shouldSendResponse ? (
                <div>
                  <label htmlFor="email">Your email address</label>
                  <input name="email" value={this.state.email} onChange={this.emailChanged}/>
                </div>
              ) : null}
              <button type="submit" disabled={this.props.requestPending} className="usa-button-primary usa-width-one-whole">
                {this.props.requestPending ? <i className="fa fa-spin fa-spinner"/> : 'Send feedback'}
              </button>
            </div>
          </div>
        </form>
      );
    }
  }

  FeedbackForm.propTypes = {
    sendFeedback: PropTypes.func.isRequired,
    requestPending: PropTypes.bool
  };

  export default FeedbackForm
