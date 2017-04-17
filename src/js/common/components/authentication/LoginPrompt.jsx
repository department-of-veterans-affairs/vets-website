import React from 'react';

class LoginPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  componentDidMount() {
    // event for google analytics that we prompted for login
    window.dataLayer.push({ event: 'login-prompt-displayed' });
  }

  handleLogin() {
    const myLoginUrl = this.props.loginUrl;
    const receiver = window.open(`${myLoginUrl}&op=signin`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  handleSignup() {
    const myLoginUrl = this.props.loginUrl;
    const receiver = window.open(`${myLoginUrl}&op=signup`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
    receiver.focus();
  }

  render() {
    return (
      <div className="row primary">
        <div className="medium-12 small-12 columns">
          <div className="react-conatiner">
            <h1>Sign In to Your Vets.gov Account</h1>
            <p>Vets.gov is a new VA website offering online services for Veterans.</p>
            <p>Sign in to:</p>
            <ul>
              <li>Refill a prescription.</li>
              <li>Send a secure message to your health care provider.</li>
              <li>Check the status of a disability or pension claim.</li>
            </ul>
            <p>
              <button className="usa-button-primary va-button-primary usa-button-big" onClick={this.handleLogin}><strong>Sign In</strong></button>
              <button className="va-button-secondary usa-button-big" onClick={this.handleSignup}><strong>Create Account</strong></button>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

LoginPrompt.propTypes = {
  loginUrl: React.PropTypes.string
};

export default LoginPrompt;
