import React from 'react';
import PropTypes from 'prop-types';

import AlertBox from '../../common/components/AlertBox';
import ErrorableTextarea from '../../common/components/form-elements/ErrorableTextarea';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import ErrorableCheckbox from '../../common/components/form-elements/ErrorableCheckbox';

class FeedbackForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      suppressDescriptionErrors: true,
      suppressEmailErrors: true
    };
  }

  setDescription = ({ value: description, dirty }) => {
    if (dirty) this.setState({ suppressDescriptionErrors: false });
    this.props.setFormValues({ description });
  }

  setEmail = ({ value: email, dirty }) => {
    if (dirty) this.setState({ suppressEmailErrors: false });
    this.props.setFormValues({ email });
  }

  sendFeedback = (event) => {
    event.preventDefault();
    if (this.props.formIsSubmittable) this.props.sendFeedback(this.props.formValues);
  }

  descriptionErrorMessage = () => {
    return !this.state.suppressDescriptionErrors ? this.props.formErrors.description : '';
  }

  emailErrorMessage = () => {
    return !this.state.suppressEmailErrors ? this.props.formErrors.email : '';
  }

  render() {
    return (
      <form id="feedback-form" className="feedback-form" onSubmit={this.sendFeedback} aria-hidden={!this.props.formIsVisible}>
        <h4 className="feedback-widget-title">Tell us what you think</h4>
        <div className="va-flex">
          <div className="feedback-widget-form-container">
            <div className="feedback-widget-desc-container">
              <ErrorableTextarea
                label="What can we do to make Vets.gov better?"
                name="description"
                onValueChange={this.setDescription}
                errorMessage={this.descriptionErrorMessage()}
                field={{ value: this.props.formValues.description, dirty: false }}
                required/>
            </div>
            <ErrorableCheckbox
              name="should-send-response"
              label="I would like to receive a response about my feedback."
              checked={this.props.formValues.shouldSendResponse}
              onValueChange={(shouldSendResponse) => this.props.setFormValues({ shouldSendResponse })}/>
            <div className="usa-grid-full">
              <div className="usa-width-two-thirds">
                {this.props.formValues.shouldSendResponse && (
                  <div className="feedback-email-container">
                    <ErrorableTextInput
                      label="Your email address"
                      name="email"
                      type="email"
                      field={{ value: this.props.formValues.email, dirty: false }}
                      onValueChange={this.setEmail}
                      errorMessage={this.emailErrorMessage()}
                      required/>
                  </div>
                )}
                <div className="feedback-submit-container">
                  <button
                    type="submit"
                    disabled={this.props.requestPending || !this.props.formIsSubmittable}
                    className="usa-button-primary usa-width-one-whole feedback-submit-button">
                    {this.props.requestPending ? <i className="fa fa-spin fa-spinner"/> : 'Send feedback'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="feedback-widget-need-help-container">
            <div className="feedback-widget-need-help-inner">
              <h3>Need help?</h3>
              Calls the Vets.gov Help Desk<br/>
              <a href="tel:18555747286">1-855-574-7286</a><br/>
              TTY:&nbsp;<a href="tel:+18008778339">1-800-877-8339</a><br/>
              Monday – Friday, 8:00 a.m. – 8:00 p.m. (<abbr title="eastern time">ET</abbr>)
            </div>
          </div>
        </div>
        {this.props.errorMessage && (
          <div className="feedback-error">
            <AlertBox status="error" onCloseAlert={this.props.clearError} content={this.props.errorMessage} isVisible/>
          </div>
        )}
      </form>
    );
  }

}

FeedbackForm.propTypes = {
  formIsSubmittable: PropTypes.bool,
  formErrors: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
  sendFeedback: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  requestPending: PropTypes.bool
};

export default FeedbackForm;
