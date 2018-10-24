import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import {
  formLinks,
  formDescriptions,
  formBenefits,
} from '../../../applications/personalization/profile360/util/helpers';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import ProgressButton from '@department-of-veterans-affairs/formation/ProgressButton';
import Modal from '@department-of-veterans-affairs/formation/Modal';
import { removeSavedForm } from '../../user/profile/actions';

export class ApplicationStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      loading: false,
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.profile.loading && !this.props.profile.loading) {
      clearTimeout(this.timeout);
    }
  }

  removeForm = formId => {
    this.setState({ modalOpen: false, loading: true });
    this.props
      .removeSavedForm(formId)
      // Swallow any errors and redirect anyway
      .catch(x => x)
      .then(() => {
        if (!this.props.stayAfterDelete) {
          window.location.href = formLinks[formId];
        } else {
          this.setState({ modalOpen: false, loading: false });
        }
      });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  render() {
    const {
      formIds,
      profile,
      login,
      applyHeading,
      applyText,
      showApplyButton,
      applyRender,
      formType,
      applyLink,
    } = this.props;
    if (profile.loading || this.state.loading) {
      const message = profile.loading
        ? 'Checking your application status.'
        : 'Deleting your form.';

      return (
        <div className="sip-application-status">
          <LoadingIndicator message={message} />
        </div>
      );
    }

    let savedForm;
    let { formId } = this.props;
    let multipleForms = false;
    if (formIds) {
      const matchingForms = profile.savedForms.filter(({ form }) =>
        formIds.has(form),
      );
      if (matchingForms.length) {
        savedForm = matchingForms.sort(
          ({ metadata }) => -1 * metadata.lastUpdated,
        )[0];
        formId = savedForm.form;
        multipleForms = matchingForms.length > 1;
      }
    } else {
      savedForm = profile.savedForms.find(
        ({ form }) => form === this.props.formId,
      );
    }

    if (login.currentlyLoggedIn && savedForm) {
      const {
        lastUpdated: lastSaved,
        expiresAt: expirationTime,
      } = savedForm.metadata;
      const expirationDate = moment.unix(expirationTime);
      const isExpired = expirationDate.isBefore();

      if (!isExpired) {
        const lastSavedDateTime = moment
          .unix(lastSaved)
          .format('M/D/YYYY [at] h:mm a');

        return (
          <div className="usa-alert usa-alert-info no-background-image sip-application-status">
            <h5 className="form-title saved">Your form is in progress</h5>
            <span className="saved-form-item-metadata">
              Your {formDescriptions[formId]} is in progress.
            </span>
            <br />
            <span className="saved-form-item-metadata">
              Your application was last saved on {lastSavedDateTime}
            </span>
            <br />
            <div className="expires-container">
              You can continue applying now, or come back later to finish your
              application. Your application{' '}
              <span className="expires">
                will expire on {expirationDate.format('M/D/YYYY')}.
              </span>
            </div>
            <p>
              <a
                className="usa-button-primary"
                href={`${formLinks[formId]}resume`}
              >
                Continue Your Application
              </a>
              <button
                className="usa-button-secondary"
                onClick={this.toggleModal}
              >
                Start a New Application
              </button>
            </p>
            {multipleForms && (
              <p className="no-bottom-margin">
                You have more than one in-progress {formType} form.{' '}
                <a href="/profile">
                  View and manage your forms on your Account page
                </a>
                .
              </p>
            )}
            <Modal
              cssClass="va-modal-large"
              id="start-over-modal"
              onClose={this.toggleModal}
              title="Starting over will delete your in-progress form."
              visible={this.state.modalOpen}
            >
              <p>Are you sure you want to start over?</p>
              <ProgressButton
                onButtonClick={() => this.removeForm(formId)}
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
        <div className="usa-alert usa-alert-warning no-background-image sip-application-status">
          <h5 className="form-title saved">Your form has expired</h5>
          <span className="saved-form-item-metadata">
            Your saved {formDescriptions[formId]} has expired. If you want to
            apply for {formBenefits[formId]}, please start a new application.
          </span>
          <br />
          <p>
            <button className="usa-button-primary" onClick={this.toggleModal}>
              Start a New Application
            </button>
          </p>
          {multipleForms && (
            <p className="no-bottom-margin">
              You have more than one in-progress {formType} form.{' '}
              <a href="/profile">
                View and manage your forms on your Account page
              </a>
              .
            </p>
          )}
          <Modal
            cssClass="va-modal-large"
            id="start-over-modal"
            onClose={this.toggleModal}
            title="Starting over will delete your in-progress form."
            visible={this.state.modalOpen}
          >
            <p>Are you sure you want to start over?</p>
            <ProgressButton
              onButtonClick={() => this.removeForm(formId)}
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

    if (showApplyButton && applyRender) {
      return applyRender();
    } else if (showApplyButton) {
      return (
        <div
          itemProp="steps"
          itemScope
          itemType="http://schema.org/HowToSection"
        >
          <h3 itemProp="name">{applyHeading}</h3>
          <div itemProp="itemListElement">
            {this.props.additionalText && <p>{this.props.additionalText}</p>}
            <div className="sip-application-status">
              <a
                className="usa-button-primary va-button-primary"
                href={formLinks[formId]}
              >
                {applyText}
              </a>
              {window.location.pathname.endsWith('eligibility/') && (
                <p>
                  <a href={applyLink}>Learn more about how to apply</a>.
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}

ApplicationStatus.propTypes = {
  formId: PropTypes.string,
  formType: PropTypes.string,
  applyHeading: PropTypes.string,
  applyLink: PropTypes.string,
  applyRender: PropTypes.func,
  applyText: PropTypes.string,
  additionalText: PropTypes.string,
  login: PropTypes.shape({
    currentlyLoggedIn: PropTypes.bool.isRequired,
  }),
  profile: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    savedForms: PropTypes.array.isRequired,
  }),
  stayAfterDelete: PropTypes.bool,
};

ApplicationStatus.defaultProps = {
  applyHeading: 'Ready to apply?',
};

function mapStateToProps(state) {
  const { login, profile } = state.user;

  return {
    login,
    profile,
  };
}

const mapDispatchToProps = {
  removeSavedForm,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApplicationStatus);
