import React from 'react';
import { connect } from 'react-redux';
import Modal from '@department-of-veterans-affairs/formation/Modal';
import { features } from '../../../beta-enrollment/containers/BetaApp';
import { unregisterBeta } from '../../../beta-enrollment/actions';

class BetaTools extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false
    };
  }
  unregisterBeta = () => {
    this.props.unregisterBeta(features.dashboard).then(() => document.location.replace('/'));
  }
  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  }
  render() {
    if (!this.props.isEnrolled) return null;
    return (
      <div>
        <Modal
          visible={this.state.showModal}
          onClose={this.toggleModal}>
          <h4><i className="fa fa-warning"/> Are you sure?</h4>
          <p>You'll no longer see the new dashboard, profile, and account pages.</p>
          <button onClick={this.unregisterBeta} className="usa-button-primary">Yes, Turn Off</button>
          <button onClick={this.toggleModal} className="usa-button-secondary">Cancel</button>
        </Modal>
        <h4>Beta tools</h4>
        <p><i className="fa fa-check-circle"/> Your have beta tools turned on.</p>
        <button
          type="button"
          className="va-button-link"
          onClick={this.toggleModal}>Turn off beta tools</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isEnrolled: state.user.profile.services.includes(features.dashboard)
  };
};

const mapDispatchToProps = {
  unregisterBeta
};

export default connect(mapStateToProps, mapDispatchToProps)(BetaTools);
export { BetaTools };
