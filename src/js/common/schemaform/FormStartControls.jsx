import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import ProgressButton from '../../common/components/form-elements/ProgressButton';
import Modal from '../../common/components/Modal';

class FormStartControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  componentWillReceiveProps = (newProps) => {
    if (!this.props.returnUrl && newProps.returnUrl) {
      // Navigate to the last page they were on
      this.props.router.push(newProps.returnUrl);
    }
  }

  goToBeginning = () => {
    this.props.router.push(this.props.startPage);
  }

  handleLoadPrefill = () => {
    if (this.props.prefillAvailable) {
      this.props.fetchInProgressForm(this.props.formId, this.props.migrations, true);
    } else {
      this.goToBeginning();
    }
  }

  handleLoadForm = () => {
    // If successful, this will set form.loadedData.metadata.returnUrl and will
    //  trickle down to this.props to be caught in componentWillReceiveProps
    this.props.fetchInProgressForm(this.props.formId, this.props.migrations);
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  startOver = () => {
    this.toggleModal();
    this.props.removeInProgressForm(this.props.formId, this.props.migrations);
  }

  render() {
    const { startOver } = this.props.messages || {};

    if (this.props.formSaved) {
      return (
        <div>
          <ProgressButton
              onButtonClick={this.handleLoadForm}
              buttonText="Resume previous application"
              buttonClass="usa-button-primary"/>
          {!this.props.resumeOnly && <ProgressButton
              onButtonClick={this.toggleModal}
              buttonText="Start over"
              buttonClass="usa-button-outline"
              afterText="»"/>}
          <Modal
              cssClass="va-modal-large"
              id="start-over-modal"
              onClose={this.toggleModal}
              visible={this.state.modalOpen}>
            <h4>{startOver || 'Starting over would erase your in progress form.'}</h4>
            <p>Are you sure you want to start over?</p>
            <ProgressButton
                onButtonClick={this.startOver}
                buttonText="Start over"
                buttonClass="usa-button-primary"/>
            <ProgressButton
                onButtonClick={this.toggleModal}
                buttonText="Cancel"
                buttonClass="usa-button-outline"/>
          </Modal>
        </div>
      );
    }

    return (
      <div>
        <ProgressButton
            onButtonClick={this.handleLoadPrefill}
            buttonText="Get Started"
            buttonClass="usa-button-primary"
            afterText="»"/>
      </div>
    );
  }
}

FormStartControls.propTypes = {
  formId: PropTypes.string.isRequired,
  migrations: PropTypes.array.isRequired,
  returnUrl: PropTypes.string,
  fetchInProgressForm: PropTypes.func.isRequired,
  removeInProgressForm: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  formSaved: PropTypes.bool.isRequired,
  prefillAvailable: PropTypes.bool.isRequired,
  startPage: PropTypes.string.isRequired,
  resumeOnly: PropTypes.bool
};

export default withRouter(FormStartControls);

export { FormStartControls };
