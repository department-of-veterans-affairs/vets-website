import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/web-components/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

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
        <va-button onClick={this.openModal} text="Opt Out" />
        <VaModal
          clickToClose
          large
          id="opt-out-alert"
          onCloseEvent={this.closeModal}
          modalTitle="Are you sure you want to opt out?"
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
            <va-telephone
              class="help-phone-number-link"
              contact={CONTACTS.GI_BILL}
            />{' '}
            to opt back in.
          </p>
          <div>
            <a
              href="/education/opt-out-information-sharing/opt-out-form-0993"
              className="usa-button-primary"
            >
              Yes, I Want to Opt Out
            </a>
            <va-button onClick={this.closeModal} secondary text="Cancel" />
          </div>
        </VaModal>
      </div>
    );
  }
}
