import React from 'react';
import Modal from '@department-of-veterans-affairs/formation/Modal';

export default class OptOutWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  render() {
    return (
      <div>
        <button
          className="usa-button-primary va-button-primary"
          onClick={this.openModal}
        >
          Opt Out
        </button>
        <Modal
          clickToClose
          cssClass="va-modal va-modal-large"
          id="opt-out-alert"
          onClose={this.closeModal}
          title="Are you sure you want to opt out?"
          visible={this.state.modalOpen}
        >
          <div>
            Here are some things that’ll change if you ask VA to not share your
            education benefits information with your school:
            <ul>
              <li>
                You’ll be responsible for giving this information to your
                school.
              </li>
              <li>
                If you transfer schools, you may also need to make sure your new
                school has your education benefits paperwork.
              </li>
            </ul>
          </div>

          <p>
            <strong>Please note:</strong> If you opt out and then change your
            mind, you’ll need to call the Education Call Center at{' '}
            <a className="help-phone-number-link" href="tel:+1-888-442-4551">
              1-888-442-4551
            </a>{' '}
            to opt back in.
          </p>
          <div>
            <a
              href="/education/opt-out-information-sharing/opt-out-form-0993"
              className="usa-button-primary"
            >
              Yes, I Want to Opt Out
            </a>
            <button className="usa-button-secondary" onClick={this.closeModal}>
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}
