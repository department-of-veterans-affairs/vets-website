import PropTypes from 'prop-types';
import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
// tests will fail if .jsx is not included above

const modalContents = minutes => (
  <div>
    <h3>Privacy Act Statement</h3>
    <p>
      <strong>Respondent Burden:</strong> We need this information to determine
      your ability to participate in the VET TEC High Technology Pilot Program,
      38 U.S.C. 3702 (d) and 38 CFR 36.4344. Title 38, United States Code,
      allows us to ask for this information. We estimate that you will need an
      average of {minutes} minutes to review the instructions, find the
      information, and complete this form. The VA cannot conduct or sponsor a
      collection of information unless a valid OMB control number is displayed.
      You are not required to respond to a collection of information if this
      number is not displayed. Valid OMB control numbers can be located on the
      OMB Internet Page at{' '}
      <a href="www.reginfo.gov/public/do/PRAMain">
        www.reginfo.gov/public/do/PRAMain
      </a>
      . If desired, you can call <a href="+18008271000">1-800-827-1000</a> to
      get information on where to send comments or suggestions about this form.
    </p>
    <p>
      <strong>Privacy Act Notice:</strong> § 116 of Public Law 115-48 authorizes
      VA to implement a 5-year pilot program that proves eligible Veterans the
      opportunity to enroll in high technology programs of education that
      provide training and skills sought by employers in relevant high
      technology fields or industries. Accelerated Learning Programs targeted
      for VET TEC are generally less than 10 months in duration, offered by
      organizations which are not institutions of higher learning, and do not
      lead to a degree. They are designed to provide students the requisite
      training in demand by employers seeking to source IT talent. Also this
      form will be used to collect certain information from interested
      applicants to be used in VA reports to Congress that will help determine
      if the program should continue. While you do not have to respond, VA
      cannot process your claim for education assistance unless the information
      is furnished as required by Public Law 115-48. The responses you submit
      are considered confidential (38 U.S.C. 5701). Any information provided by
      applicants, recipients, and others may be subject to verification through
      computer matching programs with other agencies.
    </p>
  </div>
);

class OMBInfo extends React.Component {
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
    const { resBurden, ombNumber, expDate } = this.props;

    return (
      <div className="omb-info">
        <div>
          Respondent burden: <strong>{resBurden} minutes</strong>
        </div>
        <div>
          OMB Control #: <strong>{ombNumber}</strong>
        </div>
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
          contents={modalContents(resBurden)}
          id="omb-modal"
          visible={this.state.modalOpen}
          onClose={this.closeModal}
        />
      </div>
    );
  }
}

OMBInfo.propTypes = {
  /**
   * respondent burden, length of time usually in minutes
   */
  resBurden: PropTypes.number,

  /**
   * OMB control number / form number
   */
  ombNumber: PropTypes.string,

  /**
   * form expiration date
   */
  expDate: PropTypes.string,
};

export default OMBInfo;
