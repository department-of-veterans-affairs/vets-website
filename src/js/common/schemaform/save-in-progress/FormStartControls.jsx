import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProgressButton from '@department-of-veterans-affairs/jean-pants/ProgressButton';
import Modal from '@department-of-veterans-affairs/jean-pants/Modal';

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

  goToIntroduction = () => {
    this.props.router.push('/introduction');
  }

  goToBeginning = () => {
    this.props.router.push(this.props.startPage);
  }

  handleLoadPrefill = () => {
    const { beforeStartForm } = this.props.form;
    if (beforeStartForm && this.props.prefillAvailable) {
      return this.prestartForm().then(() => this.props.fetchInProgressForm(this.props.formId, this.props.migrations, true, this.props.prefillTransformer));
    }
    if (this.props.prefillAvailable) {
      return this.props.fetchInProgressForm(this.props.formId, this.props.migrations, true, this.props.prefillTransformer);
    }
    return this.goToBeginning();
  }

  handleLoadForm = () => {
    const { beforeStartForm } = this.props.form;
    // If successful, this will set form.loadedData.metadata.returnUrl and will
    //  trickle down to this.props to be caught in componentWillReceiveProps
    if (beforeStartForm) {
      return this.prestartForm().then(() =>
        this.props.fetchInProgressForm(this.props.formId, this.props.migrations, true, this.props.prefillTransformer));
    }
    return this.props.fetchInProgressForm(this.props.formId, this.props.migrations);
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  startOver = () => {
    this.toggleModal();
    const { beforeStartForm } = this.props.form;
    if (beforeStartForm) {
      debugger;
      return this.prestartForm().then(() => this.props.removeInProgressForm(this.props.formId, this.props.migrations, this.props.prefillTransformer));
    }
    return this.props.removeInProgressForm(this.props.formId, this.props.migrations, this.props.prefillTransformer);
  }


  prestartForm = () => new Promise((resolve, reject) => {
    const { formId, migrations, prefillTransformer } = this.props;
    const formConfig = { formId, migrations, prefillTransformer };
    const { form: { beforeStartForm }, prestartForm } = this.props;
    return prestartForm(beforeStartForm, formConfig, resolve, reject);
  })

  authenticate = (e) => {
    e.preventDefault();
    this.props.toggleLoginModal(true);
  }

  render() {
    if (this.props.formSaved) {
      return (
        <div>
          <ProgressButton
            onButtonClick={this.handleLoadForm}
            buttonText="Continue Your Application"
            buttonClass="usa-button-primary no-text-transform"/>
          {!this.props.resumeOnly && <ProgressButton
            onButtonClick={this.toggleModal}
            buttonText="Start Over"
            buttonClass="usa-button-secondary"/>}
          <Modal
            cssClass="va-modal-large"
            id="start-over-modal"
            onClose={this.toggleModal}
            visible={this.state.modalOpen}>
            <h4>Starting over will delete your in-progress form.</h4>
            <p>Are you sure you want to start over?</p>
            <ProgressButton
              onButtonClick={this.startOver}
              buttonText="Start Over"
              buttonClass="usa-button-primary"/>
            <ProgressButton
              onButtonClick={this.toggleModal}
              buttonText="Cancel"
              buttonClass="usa-button-secondary"/>
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
          afterText="»"/>
      </div>
    );
  }
}


FormStartControls.propTypes = {
  prestartForm: PropTypes.func,
  form: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  handleLoadPrefill: PropTypes.func,
  migrations: PropTypes.array,
  returnUrl: PropTypes.string,
  fetchInProgressForm: PropTypes.func.isRequired,
  removeInProgressForm: PropTypes.func.isRequired,
  formSaved: PropTypes.bool.isRequired,
  prefillAvailable: PropTypes.bool.isRequired,
  startPage: PropTypes.string.isRequired,
  startText: PropTypes.string,
  resumeOnly: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    form: state.form
  };
}

function mapDispatchToProps(dispatch) {
  return {
    prestartForm: (beforeStartForm, config, onChange, resolve, reject) => {
      dispatch(beforeStartForm(config, onChange, resolve, reject));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormStartControls);

export { FormStartControls };
