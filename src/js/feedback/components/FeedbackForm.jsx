import React from 'react';
import PropTypes from 'prop-types';

import { focusElement } from '../../common/utils/helpers';
import AlertBox from '../../common/components/AlertBox';
import ErrorableTextarea from '../../common/components/form-elements/ErrorableTextarea';

class FeedbackForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      suppressDescriptionErrors: true
    };
  }

  componentDidMount() {
    // During testing, a shallow render won't render the React component "descriptionComp".
    // This is a safety check to make sure it exists.
    const descriptionId = this.descriptionComp && `#${this.descriptionComp.inputId}`;
    focusElement(descriptionId);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.formValues.shouldSendResponse && this.props.formValues.shouldSendResponse) {
      const emailId = this.emailComp && `#${this.emailComp.inputId}`;
      focusElement(emailId);
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.sendFeedback(this.props.formValues);
    // Set the redux error message
    this.props.setFormValues({ shouldSendResponse: null });
    // this.setState({ suppressResponseErrors: false });
    return null;
  }

  setEmail = ({ value: email, dirty }) => {
    if (dirty) this.setState({ suppressEmailErrors: false });
    this.props.setFormValues({ email });
  }

  setResponse = ({ value: shouldSendResponse }) => {
    this.setState({ suppressResponseErrors: true });
    this.props.setFormValues({ shouldSendResponse });
  }

  setDescription = ({ value: description, dirty }) => {
    if (dirty) this.setState({ suppressDescriptionErrors: false });
    this.props.setFormValues({ description });
  }

  descriptionErrorMessage = () => {
    return !this.state.suppressDescriptionErrors ? this.props.formErrors.description : '';
  }

  emailErrorMessage = () => {
    return !this.state.suppressEmailErrors ? this.props.formErrors.email : '';
  }

  responseErrorMessage = () => {
    return !this.state.suppressResponseErrors ? this.props.formErrors.shouldSendResponse : '';
  }

  render() {
  //  const { shouldSendResponse } = this.props.formValues;
    return (
      <form id="feedback-form" className="feedback-form" onSubmit={this.onSubmit}>
        <div className="va-flex">
          <div className="feedback-widget-form-container">
            <div className="usa-grid-full">

            </div>
            <div className="feedback-widget-desc-container">
              <ErrorableTextarea
                label="Tell us about your ideas to make Vets.gov better."
                name="description"
                onValueChange={this.setDescription}
                errorMessage={this.descriptionErrorMessage()}
                field={{ value: this.props.formValues.description, dirty: false }}
                ref={component => { this.descriptionComp = component; }}
                required/>
            </div>
            <div className="usa-grid-full">
              <div className="usa-width-two-thirds">
                <div className="feedback-submit-container">
                  <button
                    type="submit"
                    className="usa-button-secondary-inverse usa-width-one-fourth feedback-submit-button">
                    {this.props.requestPending ? <i className="fa fa-spin fa-spinner"/> : 'Send Us Your Ideas'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="feedback-widget-need-help-container">
            <div className="feedback-widget-need-help-inner">
              <h3>Need help?</h3>
              <p className="feedback-widget-title">Need help or to talk with someone right away? <a href="#">Get support from the Veterans Crisis Line</a>.</p>
              <p><b>Note:</b> We don't monitor the Vets.gov suggestion box at all hours. But our Veterans Crisis Line responders can support you, day and night.</p>
              Calls the Vets.gov Help Desk<br/>
              <a href="tel:18555747286">1-855-574-7286</a><br/>
              TTY:&nbsp;<a href="tel:+18008778339">1-800-877-8339</a><br/>
              Monday – Friday, 8:00 a.m. – 8:00 p.m. (<abbr title="eastern time">ET</abbr>)

            </div>
          </div>
        </div>
        {this.props.errorMessage && (
          <div className="feedback-error">
            <AlertBox status="error"
              onCloseAlert={this.props.clearError}
              headline={this.props.errorMessage.title}
              content={this.props.errorMessage.description}
              isVisible/>
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
  errorMessage: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.description
  }),
  requestPending: PropTypes.bool
};

export default FeedbackForm;
