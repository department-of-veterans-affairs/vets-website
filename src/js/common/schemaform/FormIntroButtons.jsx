import React from 'react';
import PropTypes from 'prop-types';

import ProgressButton from '../../common/components/form-elements/ProgressButton';
import Modal from '../../common/components/Modal';

class FormIntroButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  componentWillReceiveProps = (newProps) => {
    if (!this.props.returnUrl && newProps.returnUrl) {
      // Navigate to the last page they were on
      // TODO: The props haven't updated with the metadata yet...
      this.props.router.push(newProps.returnUrl);
      // TODO: Handle this scenario:
      //  1) I fill out some information and save my progress.
      //  2) The form is updated and a field I've not filled out yet gets moved
      //     to a page I have already completed.
      //  3) I load my saved progress.
      //  4) I should be put in the page with the missing information.
    }
  }

  goToBeginning = () => {
    this.props.router.push(this.props.route.pageList[1].path);
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
    if (this.props.formSaved) {
      return (
        <div>
          <ProgressButton
              onButtonClick={this.handleLoadForm}
              buttonText="Resume previous application"
              buttonClass="usa-button-primary"/>
          <ProgressButton
              onButtonClick={this.toggleModal}
              buttonText="Start over"
              buttonClass="usa-button-outline"
              afterText="»"/>
          <Modal
              cssClass="va-modal-large"
              id="start-over-modal"
              onClose={this.toggleModal}
              visible={this.state.modalOpen}>
            <h4>Starting over would erase all your previous information.</h4>
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
            buttonText="Continue"
            buttonClass="usa-button-primary"
            afterText="»"/>
      </div>
    );
  }
}

FormIntroButtons.propTypes = {
  route: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  migrations: PropTypes.array.isRequired,
  returnUrl: PropTypes.string,
  fetchInProgressForm: PropTypes.func.isRequired,
  removeInProgressForm: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  formSaved: PropTypes.bool.isRequired,
  prefillAvailable: PropTypes.bool.isRequired
};

export default FormIntroButtons;
