import React from 'react';
import Modal from '../Modal';

const modalTitle = () => (
  'Terms and Conditions to Refill VA Prescription, Message Your Health Care Team, or Get Your VA Electronic Health Records'
);

const modalButtonContents = () => (
  <div>
    <button className="usa-button-gray" href="">I have read and accept the terms</button>
    <button className="usa-button-outline" href="">Disagree</button>
  </div>
);

const modalContents = () => (
  <div>
    <p><strong>Terms and Conditions for Medical Information</strong></p>
    <p>The Department of Veterans Affairs (VA) owns and manages the website Vets.gov. Vets.gov allows you to use online tools that display some/portions/parts of your personal health information. This health information is only displayed on Vets.gov—the information is stored on VA protected federal computer systems and networks. VA supports the secure storage and transmission of all information on Vets.gov. (Need to say you can’t see everything!)</p>

    <p><strong>Medical Disclaimer</strong></p>
    <p>The medical and health content displayed on Vets.gov is intended for use as an informative tool by the user. It is not intended to be, and should not be used in any way as, a substitute for professional medical advice. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. The accuracy of the information provided is not guaranteed. The user acknowledges the information is not meant to diagnose a health condition or disease and is not meant to develop a health treatment plan.</p>

    <p><strong>Your VA Health Records</strong></p>
    <p>VA is committed to keeping your health information private. The portions of your VA health records seen in Vets.gov are electronic copies of your official VA health records. Your VA health records remains the official and authoritative VA health records. If you disagree with the content of your health records, contact your facility Release of Information Office or facility Privacy Officer.</p>

    <p>Access to your health information may only be given to an agency or an individual as permitted by law and policy as outlined in the VHA Notice of Privacy Practices. When VA releases information, it provides only the minimum amount of information requested. (Confirm with Amy why we put this) (This doesn’t apply to the Veteran under right of action. Do this from the standpoint of—there are various privacy rights regarding your health records, to learn more read that notice. Less about releases and disclosures.)</p>

    <p>By using Vets.gov, you are requesting and giving VA permission to release to you all or a portion of your personal health information maintained by VA through Vets.gov.</p>

    <p>If your health information is not available on Vets.gov, you need to contact your facility Release of Information Office or facility Privacy Officer.</p>

    <p><strong>Secure Messages</strong></p>
    <p>Secure messaging is to be used only for non-urgent, non-life threatening communication with your health care team. If you have an urgent or life threatening issue, call 911 or go to the nearest emergency room.</p>

    <p>Secure messages will be reviewed by your health care team or the administrative team you select (such as the billing office). Secure messages may be copied into your VA health records by a member of your VA health care team.</p>

    <p>When you use secure messaging, you are expected to follow certain standards of conduct. Violations may result in being blocked from using secure messaging. Unacceptable conduct includes, but is not limited to using secure messaging to send profane or threatening messages or other inappropriate uses as determined by your health care facility</p>

    <p><strong>Privacy</strong></p>
    <p>You must agree to these Terms and Conditions to use personal health tools on Vets.gov. By agreeing to these terms and conditions you are also agreeing to your responsibilities as stated in the Vets.gov Privacy Policy.</p>
  </div>
);

class CreateMHVAccountPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  render() {
    return (
      <div className="row primary">
        <div className="small-12 columns usa-content">
          <h1>Manage Your VA Health Care Through Vets.gov</h1>
          <p>Accept the terms and conditions on Vets.gov to:</p>
          <ul>
            <li>Refill VA prescriptions</li>
            <li>View your VA electronic health records</li>
            <li>Send secure messages to your health care team</li>
          </ul>
          <p>
            To do this, you need to review and accept our
            <a onClick={this.openModal}>
              &nbsp;terms and conditions for medical information.
            </a>
          </p>
          <div className="form-radio-buttons">
            <input type="radio" name="form-selection" id="form-yes" value="yes"/>
            <label htmlFor="form-yes">
              Yes, I agree to review and accept the Vets.gov terms and conditions for medical information.
            </label>
            <input type="radio" name="form-selection" id="form-no" value="no"/>
            <label htmlFor="form-no">
              No, I don't agree with the Vets.gov terms and conditions for medical information.
            </label>
          </div>
          <p>
            <strong>Please note:</strong> without agreeing to the terms and conditions,
            Vets.gov can't provide you access to refill VA prescriptions, view VA electronic
            health records, or send secure messages to your health care team. You can change
            your decision at any time by visiting your profile page.
          </p>
        </div>
        <Modal
            cssClass="va-modal-large"
            contents={modalContents()}
            buttonContents={modalButtonContents()}
            title={modalTitle()}
            id="omb-modal"
            visible={this.state.modalOpen}
            onClose={() => this.closeModal()}/>
      </div>
    );
  }
}

CreateMHVAccountPrompt.propTypes = {
};

export default CreateMHVAccountPrompt;
