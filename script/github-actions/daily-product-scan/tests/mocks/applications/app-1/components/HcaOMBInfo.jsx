/* eslint-disable react/sort-prop-types */
/* eslint-disable react/button-has-type */
import PropTypes from 'prop-types';
import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import HCAPrivacyActStatement from './HCAPrivacyActStatement';

class HcaOMBInfo extends React.Component {
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
          How much time we think you'll need to apply (called respondent
          burden): <strong>30 minutes</strong>
        </div>
        <div>
          OMB Control #: <strong>2900-0091</strong>
        </div>
        <div>
          Expiration date: <strong>06/30/2024</strong>
        </div>
        <div>
          <button className="va-button-link" onClick={this.openModal}>
            Privacy Act Statement
          </button>
        </div>
        <Modal
          cssClass="va-modal-large"
          contents={<HCAPrivacyActStatement />}
          id="omb-modal"
          visible={this.state.modalOpen}
          onClose={this.closeModal}
        />
      </div>
    );
  }
}

HcaOMBInfo.propTypes = {
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

export default HcaOMBInfo;
