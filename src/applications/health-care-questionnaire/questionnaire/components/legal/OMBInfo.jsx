import PropTypes from 'prop-types';
import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
// tests will fail if .jsx is not included above

const modalContents = () => (
  <div>
    <h3>Privacy Act Statement</h3>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium
      dicta animi natus, corrupti voluptatum, eos dolore provident culpa vitae
      doloribus sed numquam, magni perspiciatis voluptatem beatae? Id voluptates
      nihil possimus?
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
    const { expDate } = this.props;

    return (
      <div className="omb-info">
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
   * form expiration date
   */
  expDate: PropTypes.string,
};

export default OMBInfo;
