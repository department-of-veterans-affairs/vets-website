import React from 'react';
import { connect } from 'react-redux';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import { features } from 'applications/beta-enrollment/containers/BetaApp';
import { unregisterBeta } from 'applications/beta-enrollment/actions';
import { createIsServiceAvailableSelector } from 'platform/user/selectors';

class BetaTools extends React.Component {
  state = {
    showModal: false,
  };

  unregisterBeta = () => {
    this.props
      .unregisterBeta(features.hca2)
      .then(() => document.location.replace('/'));
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    if (!this.props.isEnrolled) return null;
    return (
      <div>
        <Modal visible={this.state.showModal} onClose={this.toggleModal}>
          <h4>
            <i className="fa fa-exclamation-triangle" />
            Are you sure?
          </h4>
          <p>You'll no longer see the new health care application.</p>
          <button onClick={this.unregisterBeta} className="usa-button-primary">
            Yes, Turn Off
          </button>
          <button onClick={this.toggleModal} className="usa-button-secondary">
            Cancel
          </button>
        </Modal>
        <h3>Beta tools</h3>
        <p>
          <i className="fa fa-check-circle" /> You have beta tools turned on.
        </p>
        <button
          type="button"
          className="va-button-link"
          onClick={this.toggleModal}
        >
          Turn off beta tools
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isEnrolled: createIsServiceAvailableSelector(features.hca2)(state),
});

const mapDispatchToProps = {
  unregisterBeta,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BetaTools);

export { BetaTools };
