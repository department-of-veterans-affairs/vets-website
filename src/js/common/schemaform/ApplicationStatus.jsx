import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import { formLinks, formTitles } from '../../user-profile/helpers';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import ProgressButton from '../../common/components/form-elements/ProgressButton';
import Modal from '../../common/components/Modal';
import { removeFormApi } from '../../common/schemaform/sip-api';

export class ApplicationStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      loading: false
    };

    moment.updateLocale('en', {
      meridiem: (hour) => {
        if (hour < 12) {
          return 'a.m.';
        }
        return 'p.m.';
      }
    });
  }

  removeForm = () => {
    this.setState({ modalOpen: false, loading: true });
    removeFormApi(this.props.formId)
      // Swallow any errors and redirect anyway
      .catch(x => x)
      .then(() => {
        window.location.href = formLinks[this.props.formId];
      });
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  render() {
    const { formId, profile, login, applyText, showApplyButton } = this.props;

    if (profile.loading || this.state.loading) {
      const message = profile.loading
        ? 'Checking your application status.'
        : 'Deleting your form.';

      return (
        <div className="sip-application-status">
          <LoadingIndicator message={message}/>
        </div>
      );
    }

    const savedForm = profile.savedForms.find(({ form }) => form === formId);

    if (login.currentlyLoggedIn && savedForm) {
      const { last_updated: lastSaved, expires_at: expirationTime } = savedForm.metadata;
      const expirationDate = moment.unix(expirationTime);
      const isExpired = expirationDate.isBefore();

      const [firstLetter, ...restOfTitle] = formTitles[formId];
      const cardTitle = `${firstLetter.toUpperCase()}${restOfTitle.join('')} application in progress`;

      if (!isExpired) {
        const lastSavedDateTime = moment.unix(lastSaved).format('M/D/YYYY [at] h:mm a');

        return (
          <div className="usa-alert usa-alert-info no-background-image sip-application-status">
            <h5 className="form-title saved">{cardTitle}</h5>
            <span className="saved-form-item-metadata">Last saved on {lastSavedDateTime}</span>
            <br/>
            <p>
              <a className="usa-button-primary" href={`${formLinks[formId]}resume`}>
                Continue Your Application
              </a>
              <button className="usa-button-outline" onClick={this.toggleModal}>Start Over</button>
            </p>
            <p className="no-bottom-margin">Your saved application <strong>will expire on {expirationDate.format('M/D/YYYY')}.</strong></p>
            <Modal
              cssClass="va-modal-large"
              id="start-over-modal"
              onClose={this.toggleModal}
              visible={this.state.modalOpen}>
              <h4>Starting over will delete your in-progress form.</h4>
              <p>Are you sure you want to start over?</p>
              <ProgressButton
                onButtonClick={this.removeForm}
                buttonText="Start Over"
                buttonClass="usa-button-primary"/>
              <ProgressButton
                onButtonClick={this.toggleModal}
                buttonText="Cancel"
                buttonClass="usa-button-outline"/>
            </Modal>
          </div>
        );
      }
    }

    if (showApplyButton) {
      return (
        <div className="sip-application-status">
          <a className="usa-button-primary va-button-primary" href={formLinks[formId]}>{applyText}</a>
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
