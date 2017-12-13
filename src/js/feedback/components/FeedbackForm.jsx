import React from 'react';
import PropTypes from 'prop-types';
import AlertBox from '../../common/components/AlertBox';

const MIN_INPUT = 1;

class FeedbackForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      shouldSendResponse: false,
      description: '',
      email: ''
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.sendFeedback(this.state);
  }

  descriptionChanged = ({ target: { value: description } }) => {
    this.setState({ description });
  }

  shouldSendResponseChanged = ({ target: { checked: shouldSendResponse } }) => {
    this.setState({ shouldSendResponse });
  }

  emailChanged = ({ target: { value: email } }) => {
    this.setState({ email });
  }

  render() {
    let errorBanner = null;
    if (this.props.errorMessage) {
      errorBanner = (
        <div className="feedback-error">
          <AlertBox status="error" onCloseAlert={this.props.clearError} content={this.props.errorMessage} isVisible/>
        </div>
      );
    }

    let isFormValid = this.state.description.length >= MIN_INPUT;

    if (isFormValid && this.state.shouldSendResponse) {
      isFormValid = this.state.email.match(/[^@\s]+@([^@\s]+\.)+[^@\s]+/);
    }

    return (
      <form className="feedback-form" onSubmit={this.onSubmit}>
        <h4 className="feedback-widget-title">Tell us what you think</h4>
        <div className="row va-flex">
          <div className="feedback-widget-form">
            {errorBanner}
            <label htmlFor="description">What can we do to make Vets.gov better?</label>
            <textarea name="description" value={this.state.description} onChange={this.descriptionChanged}/>
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
        <input id="should-send-response" type="checkbox" value={this.state.shouldSendResponse} onChange={this.shouldSendResponseChanged}/>
        <label htmlFor="should-send-response">I would like to receive a response about my feedback.</label>
        <div className="usa-grid-full">
          <div className="usa-width-one-third">
            {this.state.shouldSendResponse ? (
              <div>
                <label htmlFor="email">Your email address</label>
                <input name="email" value={this.state.email} onChange={this.emailChanged}/>
              </div>
            ) : null}
            <button type="submit" disabled={this.props.requestPending || !isFormValid} className="usa-button-primary usa-width-one-whole">
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
  clearError: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  requestPending: PropTypes.bool
};

export default FeedbackForm;
