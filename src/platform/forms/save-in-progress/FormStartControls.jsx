import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import ProgressButton from '@department-of-veterans-affairs/formation-react/ProgressButton';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

class FormStartControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  componentWillReceiveProps = newProps => {
    if (!this.props.returnUrl && newProps.returnUrl) {
      // Navigate to the last page they were on
      this.props.router.push(newProps.returnUrl);
    }
  };

  goToBeginning = () => {
    this.props.router.push(this.props.startPage);
  };

  captureAnalytics = () =>
    this.props.gaStartEventName &&
    window.dataLayer.push({ event: this.props.gaStartEventName });

  handleLoadPrefill = () => {
    this.captureAnalytics();
    // temp hack to fix the fact that the START button doesn't work
    // this.goToBeginning();
    if (this.props.prefillAvailable) {
      this.props.fetchInProgressForm(
        // TODO: where does this come from?
        this.props.formId,
        this.props.migrations,
        true,
        this.props.prefillTransformer,
      );
    } else {
      this.goToBeginning();
    }
  };

  handleLoadForm = () =>
    // If successful, this will set form.loadedData.metadata.returnUrl and will
    //  trickle down to this.props to be caught in componentWillReceiveProps
    this.props.fetchInProgressForm(this.props.formId, this.props.migrations);

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  startOver = () => {
    this.captureAnalytics();
    this.toggleModal();
    this.props.removeInProgressForm(
      this.props.formId,
      this.props.migrations,
      this.props.prefillTransformer,
    );
  };

  render() {
    if (this.props.formSaved) {
      return (
        <div>
          {!this.props.isExpired && (
            <ProgressButton
              onButtonClick={this.handleLoadForm}
              buttonText="Continue Your Application"
              buttonClass="usa-button-primary no-text-transform"
            />
          )}
          {!this.props.resumeOnly && (
            <ProgressButton
              onButtonClick={this.toggleModal}
              buttonText="Start a New Application"
              buttonClass={
                this.props.isExpired
                  ? 'usa-button-primary'
                  : 'usa-button-secondary'
              }
            />
          )}
          <Modal
            cssClass="va-modal-large"
            id="start-over-modal"
            onClose={this.toggleModal}
            visible={this.state.modalOpen}
          >
            <h4>Starting over will delete your in-progress form.</h4>
            <p>Are you sure you want to start over?</p>
            <ProgressButton
              onButtonClick={this.startOver}
              buttonText="Start a New Application"
              buttonClass="usa-button-primary"
            />
            <ProgressButton
              onButtonClick={this.toggleModal}
              buttonText="Cancel"
              buttonClass="usa-button-secondary"
            />
          </Modal>
        </div>
      );
    }

    return (
      <div>
        <ProgressButton
          onButtonClick={this.handleLoadPrefill}
          buttonText={this.props.startText || 'Get Started'}
          buttonClass="usa-button-primary schemaform-start-button"
          afterText="»"
        />
      </div>
    );
  }
}

FormStartControls.propTypes = {
  formId: PropTypes.string.isRequired,
  handleLoadPrefill: PropTypes.func,
  migrations: PropTypes.array,
  returnUrl: PropTypes.string,
  fetchInProgressForm: PropTypes.func.isRequired,
  removeInProgressForm: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  formSaved: PropTypes.bool.isRequired,
  // prefillAvailable = whether the form can be pre-filled
  prefillAvailable: PropTypes.bool.isRequired,
  startPage: PropTypes.string.isRequired,
  startText: PropTypes.string,
  resumeOnly: PropTypes.bool,
  gaStartEventName: PropTypes.string,
};

export default withRouter(FormStartControls);

export { FormStartControls };
