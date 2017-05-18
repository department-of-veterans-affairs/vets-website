import React from 'react';

const headerContents = () => (
  <div>
    <h1>Manage your VA Health Care Through Vets.gov</h1>
    Accept the terms and conditions on vets.gov to:
    <ul>
      <li>Refill VA prescriptions</li>
      <li>View your VA electronic health records</li>
      <li>Send secure messages to your health care team</li>
    </ul>
  </div>
);

const termsTitle = () => {
  return '';
};

const termsContents = () => (
  <div>
    <p><strong>Terms and Conditions for Medical Information</strong></p>
    <p>The Department of Veterans Affairs (VA) owns and manages the website Vets.gov. Vets.gov allows you to use online tools that display parts of your personal health information. This health information is only displayed on Vets.gov—the information is stored on VA protected federal computer systems and networks. VA supports the secure storage and transmission of all information on Vets.gov.</p>

    <p><strong>Medical Disclaimer</strong></p>
    <p>The medical and health content displayed on Vets.gov is intended for use as an informative tool by the user. It is not intended to be, and should not be used in any way as, a substitute for professional medical advice. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. The accuracy of the information provided is not guaranteed. The user acknowledges the information is not meant to diagnose a health condition or disease and is not meant to develop a health treatment plan.</p>

    <p><strong>Your VA Health Records</strong></p>
    <p>VA is committed to keeping your health information private. The portions of your VA health records seen in Vets.gov are electronic copies of your official VA health records. Your VA health records remains the official and authoritative VA health records. If you disagree with the content of your health records, contact your facility Release of Information Office or facility Privacy Officer.</p>

    <p>By using Vets.gov, you are requesting and giving VA permission to release to you all or a portion of your personal health information maintained by VA through Vets.gov.</p>

    <p>If your health information is not available on Vets.gov, you need to contact your facility Release of Information Office or facility Privacy Officer.</p>

    <p>To learn more, read the VHA Notice of Privacy Practices.</p>

    <p><strong>Secure Messages</strong></p>
    <p>Secure messaging is to be used only for non-urgent, non-life threatening communication with your health care team. If you have an urgent or life threatening issue, call 911 or go to the nearest emergency room.</p>

    <p>Secure messages will be reviewed by your health care team or the administrative team you select (such as the billing office). Secure messages may be copied into your VA health records by a member of your VA health care team.</p>

    <p>When you use secure messaging, you are expected to follow certain standards of conduct. Violations may result in being blocked from using secure messaging. Unacceptable conduct includes, but is not limited to using secure messaging to send profane or threatening messages or other inappropriate uses as determined by your health care facility</p>

    <p><strong>Privacy</strong></p>
    <p>You must agree to these Terms and Conditions to use personal health tools on Vets.gov. By agreeing to these terms and conditions you are also agreeing to your responsibilities as stated in the Vets.gov Privacy Policy.</p>
  </div>
);

const footerContents = () => (
  <div></div>
);

const yesContents = () => {
  return 'Yes I agree with the terms and conditions for medical information';
};

const noContents = () => {
  return null;
};

class CreateMHVAccountPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAnswer = this.handleAnswer.bind(this);
    this.state = {};
  }

  componentWillMount() {
    this.setState({ scrolledToBottom: false, yesSelected: false });
  }

  handleSubmit() {
    // In here we need to POST to
    // /v0/terms_and_conditions/mhvac/versions/latest/user_data
    // to accept the terms, and then we need to let the RequiredTermsAcceptanceView
    // display its children.
  }

  handleScroll(event) {
    const ct = event.currentTarget;
    if ((ct.scrollTop + ct.offsetHeight) >= ct.scrollHeight) {
      this.setState({ scrolledToBottom: true, yesSelected: this.state.yesSelected });
    }
  }

  handleAnswer(event) {
    if (event.currentTarget.value === 'yes' && event.currentTarget.checked) {
      this.setState({ scrolledToBottom: this.state.scrolledToBottom, yesSelected: true });
    }
  }

  render() {
    let submitButton = <button className="usa-button-disabled" disabled>Submit</button>;
    if (this.state.scrolledToBottom && this.state.yesSelected) {
      submitButton = <button className="usa-button" onClick={this.handleSubmit}>Submit</button>;
    }

    let noRadio = (<div>
      <input type="radio" name="form-selection" id="form-no" value="no" onChange={this.handleAnswer}/>
      <label htmlFor="form-no">
        {noContents()}
      </label>
    </div>);

    if (noContents() === null) {
      noRadio = <div></div>;
    }

    return (
      <div className="row primary terms-acceptance">
        <div className="small-12 columns usa-content">
          {headerContents()}
          <h1>{termsTitle()}</h1>
          <div className="terms-box">
            <div className="terms-head">
              Scroll to read the full terms and conditions to continue
            </div>
            <div className="terms-scroller" onScroll={this.handleScroll}>
              {termsContents()}
            </div>
          </div>
          <div className="form-radio-buttons">
            <input type="radio" name="form-selection" id="form-yes" value="yes" onChange={this.handleAnswer}/>
            <label htmlFor="form-yes">
              {yesContents()}
            </label>
            {noRadio}
          </div>
          <div>
            {footerContents()}
          </div>
          <div>
            {submitButton}
            <button className="usa-button-outline">Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateMHVAccountPrompt;
