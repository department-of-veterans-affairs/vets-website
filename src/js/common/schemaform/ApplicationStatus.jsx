import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import { formLinks, formTitles } from '../../user-profile/helpers';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import ProgressButton from '../../common/components/form-elements/ProgressButton';
import Modal from '../../common/components/Modal';
import { removeSavedForm } from '../../user-profile/actions';

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
      },
      monthsShort: [
        'Jan.',
        'Feb.',
        'Mar.',
        'Apr.',
        'May',
        'June',
        'July',
        'Aug.',
        'Sept.',
        'Oct.',
        'Nov.',
        'Dec.'
      ]
    });
  }

  removeForm = (formId) => {
    this.setState({ modalOpen: false, loading: true });
    this.props.removeSavedForm(formId)
      // Swallow any errors and redirect anyway
      .catch(x => x)
      .then(() => {
        if (!this.props.stayAfterDelete) {
          window.location.href = formLinks[formId];
        } else {
          this.setState({ modalOpen: false, loading: false });
        }
      });
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  render() {
    const { formIds, profile, login, applyText, showApplyButton, applyRender, formType, applyLink } = this.props;
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

    let savedForm;
    let formId;
    let multipleForms = false;
    if (formIds) {
      const matchingForms = profile.savedForms.filter(({ form }) => formIds.has(form));
      if (matchingForms.length) {
        savedForm = matchingForms.sort(({ metadata }) => -1 * metadata.last_updated)[0];
        formId = savedForm.form;
        multipleForms = matchingForms.length > 1;
      }
    } else {
      savedForm = profile.savedForms.find(({ form }) => form === this.props.formId);
      formId = savedForm ? savedForm.form : null;
    }

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
              <button className="usa-button-secondary" onClick={this.toggleModal}>Start Over</button>
            </p>
            <p className="no-bottom-margin">Your saved application <strong>will expire on {expirationDate.format('M/D/YYYY')}.</strong></p>
            {multipleForms && <p className="no-bottom-margin">You have more than one in-progress {formType} form. <a href="/profile">View and manage your forms on your Account page</a>.</p>}
            <Modal
              cssClass="va-modal-large"
              id="start-over-modal"
              onClose={this.toggleModal}
              visible={this.state.modalOpen}>
              <h4>Starting over will delete your in-progress form.</h4>
              <p>Are you sure you want to start over?</p>
              <ProgressButton
                onButtonClick={() => this.removeForm(formId)}
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
    }

    if (showApplyButton && applyRender) {
      return applyRender();
    } else if (showApplyButton) {
      return (
        <div itemScope itemType="http://schema.org/Question">
          <h3 itemProp="name">Ready to apply?</h3>
          <div itemProp="acceptedAnswer" itemScope itemType="http://schema.org/Answer">
            <div itemProp="text">
              {this.props.additionalText && <p>{this.props.additionalText}</p>}
              <div className="sip-application-status">
                <a className="usa-button-primary va-button-primary" href={formLinks[formId]}>{applyText}</a>
                {window.location.pathname.endsWith('eligibility/') && <p><a href={applyLink}>Learn more about the application process.</a></p>}
              </div>
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
  applyLink: PropTypes.string,
  applyRender: PropTypes.func,
  applyText: PropTypes.string,
  additionalText: PropTypes.string,
  login: PropTypes.shape({
    currentlyLoggedIn: PropTypes.bool.isRequired
  }),
  profile: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    savedForms: PropTypes.array.isRequired
  }),
  stayAfterDelete: PropTypes.bool
};

function mapStateToProps(state) {
  const { login, profile } = state.user;

  return {
    login,
    profile
  };
}

const mapDispatchToProps = {
  removeSavedForm
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationStatus);
