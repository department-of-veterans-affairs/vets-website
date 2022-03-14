import PropTypes from 'prop-types';
import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
// tests will fail if .jsx is not included above

const modalContents = () => (
  <div>
    <h3 className="privacy-heading">Privacy Act Statement</h3>
    <p className="privacy-content">
      We ask you to provide the information in this questionnaire to help with
      your medical care (under law 38 U.S.C. Chapter 17). It’s your choice if
      you want to provide this information. If you choose not to provide this
      information, it may make it harder for us to prepare for your visit. But
      it won’t have any effect on your eligibility for any VA benefits or
      services. We may use and share the information you provide in this
      questionnaire in the ways we’re allowed to by law. We may make a “routine
      use” disclosure of the information as outlined in the Privacy Act system
      of records notice in "24VA10A7 Patient Medical Record – VA” and following
      the Veterans Health Administration (VHA) Notice of Privacy Practices.
    </p>
  </div>
);

class PrivacyAct extends React.Component {
  constructor(props) {
    super(props);

    this.state = { modalOpen: false };
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    const { expDate } = this.props;

    return (
      <div className="omb-info" role="main">
        <div>
          Expiration date: <strong>{expDate}</strong>
        </div>
        <div>
          <button className="va-button-link" onClick={this.openModal}>
            Privacy Act Statement
          </button>
        </div>
        <Modal
          cssClass="va-modal-large"
          contents={modalContents()}
          id="privacy-act-modal"
          visible={this.state.modalOpen}
          onClose={this.closeModal}
        />
      </div>
    );
  }
}

PrivacyAct.propTypes = {
  /**
   * form expiration date
   */
  expDate: PropTypes.string,
};

export default PrivacyAct;
