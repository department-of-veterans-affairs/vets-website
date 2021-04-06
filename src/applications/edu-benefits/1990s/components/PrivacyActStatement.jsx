import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
// tests will fail if .jsx is not included above

const modalContents = () => (
  <div>
    <h3>Privacy Act Statement</h3>
    <p>
      <strong>Privacy Act Notice:</strong> The VA will not disclose information
      collected on this form to any source other than what has been authorized
      under the Privacy Act of 1974 or title 38, Code of Federal Regulations,
      section 1.576 for routine uses (e.g., the VA sends educational forms or
      letters with a veteran’s identifying information to the Veteran’s school
      or training establishment to (1) assist the veteran in the completion of
      claims forms or (2) for the VA to obtain further information as may be
      necessary from the school for VA to properly process the Veteran’s
      education claim or to monitor his or her progress during training) as
      identified in the VA system of records, 58VA21/22/28, Compensation,
      Pension, Education, and Vocational Rehabilitation and Employment Records -
      VA, and published in the Federal Register. Your obligation to respond is
      required to obtain or retain education benefits. Giving us your SSN
      account information is voluntary. Refusal to provide your SSN by itself
      will not result in the denial of benefits. The VA will not deny an
      individual benefits for refusing to provide his or her SSN unless the
      disclosure of the SSN is required by a Federal Statute of law enacted
      before January 1, 1975, and still in effect. The requested information is
      considered relevant and necessary to determine the maximum benefits under
      the law. While you do not have to respond, VA cannot process your claim
      for education assistance unless the information is furnished as required
      by existing law (38 U.S.C. 3471). The responses you submit are considered
      confidential (38 U.S.C. 5701). Any information provided by applicants,
      recipients, and others may be subject to verification through computer
      matching programs with other agencies.
    </p>
  </div>
);

class PrivacyActStatement extends React.Component {
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
    return (
      <div className="omb-info">
        <div>
          <button className="va-button-link" onClick={this.openModal}>
            Privacy Act Statement
          </button>
        </div>
        <Modal
          cssClass="va-modal-large"
          contents={modalContents()}
          id="omb-modal"
          visible={this.state.modalOpen}
          onClose={this.closeModal}
        />
      </div>
    );
  }
}

export default PrivacyActStatement;
