import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import { formLinks } from '../../user-profile/helpers';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import ProgressButton from '../../common/components/form-elements/ProgressButton';
import Modal from '../../common/components/Modal';
import { removeInProgressForm } from '../../common/schemaform/sip-api';

export class ApplicationStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  removeForm = () => {
    this.toggleModal();
    removeInProgressForm(this.props.formId).then(() => {
      window.location.href = formLinks[this.props.formId];
    });
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  render() {
    const { formId, profile, login, applyText, titleText, showApplyButton } = this.props;

    if (login.currentlyLoggedIn && !profile.loading && profile.savedForms.some(({ form }) => form === formId)) {
      const formData = profile.savedForms.find(({ form }) => form === formId);
      const { last_updated: lastSaved, expires_at: expirationTime } = formData.metadata;
      const expirationDate = moment.unix(expirationTime).format('M/D/YYYY');
      const isExpired = moment(expirationDate).isBefore();

      if (!isExpired) {
        const lastSavedDateTime = moment.unix(lastSaved).format('M/D/YYYY [at] h:mm a');

        return (
          <div className="usa-alert usa-alert-info no-background-image sip-application-status">
            <h5 className="form-title saved">{titleText} in progress</h5>
            <span className="saved-form-item-metadata">Last saved on {lastSavedDateTime}</span>
            <br/>
            <p>
              <a className="usa-button-primary" href={`${formLinks[formId]}resume`}>
                Continue Your Application
              </a>
              <button className="usa-button-outline" onClick={this.toggleModal}>Start Over</button>
            </p>
            <p className="no-bottom-margin">Your saved application <strong>will expire on {expirationDate}.</strong></p>
            <Modal
              cssClass="va-modal-large"
              id="start-over-modal"
              onClose={this.toggleModal}
              visible={this.state.modalOpen}>
              <h4>Starting over will delete your in-progress form.</h4>
              <p>Are you sure you want to start over?</p>
              <ProgressButton
                onButtonClick={this.removeForm}
                buttonText="Yes, delete it"
                buttonClass="usa-button-primary"/>
              <ProgressButton
                onButtonClick={this.toggleModal}
                buttonText="No, keep it"
                buttonClass="usa-button-outline"/>
            </Modal>
          </div>
        );
      }
    }

    if (!profile.loading && showApplyButton) {
      return (
        <div className="sip-application-status">
          <a className="usa-button-primary va-button-primary" href={formLinks[formId]}>{applyText}</a>
        </div>
      );
    }

    if (profile.loading) {
      return (
        <div className="sip-application-status">
          <LoadingIndicator message="Checking your application status"/>
        </div>
      );
    }

    return null;
  }
}

ApplicationStatus.propTypes = {
  formId: PropTypes.string.isRequired,
  titleText: PropTypes.string.isRequired,
  applyText: PropTypes.string.isRequired,
  login: PropTypes.shape({
    currentlyLoggedIn: PropTypes.bool.isRequired
  }),
  profile: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    savedForms: PropTypes.array.isRequired
  })
};

function mapStateToProps(state) {
  const { login, profile } = state.user;

  return {
    login,
    profile
  };
}

export default connect(mapStateToProps)(ApplicationStatus);
