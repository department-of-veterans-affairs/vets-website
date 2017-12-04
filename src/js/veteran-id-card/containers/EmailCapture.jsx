import React from 'react';
import { connect } from 'react-redux';
import { submitEmail, setEmail } from '../actions';
import AlertBox from '../../common/components/AlertBox';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';

class EmailCapture extends React.Component {

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitEmail(this.props.email.value);
  }

  validateEmailAddress(email) {
    return email.match(/[^@\s]+@([^@\s]+\.)+[^@\s]+/);
  }

  render() {
    let view;

    if (this.props.success) {
      view = (
        <div>
          <h1>Printed Veteran ID Card</h1>
          <AlertBox
            content={<h4 className="usa-alert-heading">Email received.  We will send you an email when the application is available again.</h4>}
            isVisible
            status="success"/>
        </div>
      );
    } else {
      view = (
        <div>
          <h1>Printed Veteran ID Card</h1>
          <AlertBox
            content="Thank you for your interest in the Veteran Identification Card! Currently, we are experiencing a high volume of traffic. We apologize, and want you to know we're working to fix the problem."
            isVisible
            status="warning"/>

          <h4>In the meantime, please enter your email address and we'll send an update when the Veteran Identification Card application is back online.</h4>

          <form onSubmit={this.handleSubmit}>
            <ErrorableTextInput errorMessage={this.props.errors && this.props.errors[0].title}
              label={<span>Email Address</span>}
              name="email"
              field={this.props.email}
              onValueChange={(update) => this.props.setEmail(update)}
              required/>
            <div>
              <button
                className="usa-button"
                disabled={this.props.errors || !this.props.email.dirty}
                type="submit">Submit</button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="usa-width-two-thirds medium-8 vet-id-email-capture">
            {view}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const emailState = state.idcard.emailForm;
  return {
    email: emailState.email,
    success: emailState.success,
    errors: emailState.errors,
    submitting: emailState.submitting,
  };
};

const mapDispatchToProps = {
  submitEmail,
  setEmail,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailCapture);
export { EmailCapture };
