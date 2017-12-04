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
            content={<h4 className="usa-alert-heading">Thank you for your email address. We'll let you know when the application is working again.</h4>}
            isVisible
            status="success"/>
        </div>
      );
    } else {
      view = (
        <div>
          <h1>Printed Veteran ID Card</h1>
          <AlertBox
            content="We’re sorry. The Veteran ID Card system is having trouble handling the many requests for cards, and can’t accept your application right now. We’re working to fix the problem as fast as we can."
            isVisible
            status="warning"/>

          <h4>If you'd like us to let you know when the application is working again, please enter your email address below. Note: We'll use your email only to contact you about the Veteran ID Card. <a href="/privacy/">See our privacy policy</a>.</h4>

          <form onSubmit={this.handleSubmit}>
            <ErrorableTextInput errorMessage={this.props.errors && this.props.errors[0].title}
              label={<span>Email address</span>}
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
