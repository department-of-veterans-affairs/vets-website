import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  VaButton,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import recordEvent from 'platform/monitoring/record-event';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_RESTARTING,
} from 'platform/site-wide/wizard';
import {
  CONTINUE_APP_DEFAULT_MESSAGE,
  START_NEW_APP_DEFAULT_MESSAGE,
  APP_TYPE_DEFAULT,
} from '../../forms-system/src/js/constants';

class FormStartControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  // /* eslint-disable-next-line camelcase */
  // UNSAFE_componentWillReceiveProps = newProps => {
  //   if (!this.props.returnUrl && newProps.returnUrl) {
  //     // TODO: Remove this; it doesn't actually run
  //     // The redirect is instead done in RoutedSavableApp
  //     // Navigate to the last page they were on
  //     this.props.router.push(newProps.returnUrl);
  //   }
  // };

  goToBeginning = () => {
    this.props.router.push(this.props.startPage);
  };

  captureAnalytics = () =>
    this.props.gaStartEventName &&
    recordEvent({ event: this.props.gaStartEventName });

  handleLoadPrefill = () => {
    this.captureAnalytics();
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
    this.setState(prevState => ({ modalOpen: !prevState.modalOpen }));
  };

  startOver = () => {
    this.captureAnalytics();
    this.toggleModal();
    this.props.removeInProgressForm(
      this.props.formId,
      this.props.migrations,
      this.props.prefillTransformer,
    );

    const { formConfig = {} } =
      this.props.routes?.[1] || this.props.formConfig || {};
    // Wizard status needs an intermediate value between not-started &
    // complete to prevent infinite loops in the RoutedSavableApp
    sessionStorage.setItem(
      formConfig?.wizardStorageKey || WIZARD_STATUS,
      WIZARD_STATUS_RESTARTING,
    );
  };

  render() {
    // get access to the formConfig object through this route
    const { formConfig } =
      this.props.routes?.[1] || this.props.formConfig || {};
    const {
      appType = APP_TYPE_DEFAULT,
      continueAppButtonText = CONTINUE_APP_DEFAULT_MESSAGE,
      startNewAppButtonText = START_NEW_APP_DEFAULT_MESSAGE,
    } = formConfig?.customText || {};
    const { ariaLabel = null, ariaDescribedby = null } = this.props;

    if (this.props.formSaved) {
      return (
        <div>
          {!this.props.isExpired && (
            <VaButton
              onClick={this.handleLoadForm}
              text={continueAppButtonText}
              label={ariaLabel}
              data-testid="continue-your-application"
            />
          )}
          {!this.props.resumeOnly && (
            <VaButton
              onClick={this.toggleModal}
              text={startNewAppButtonText}
              secondary={!this.props.isExpired}
              label={ariaLabel}
            />
          )}
          <Modal
            cssClass="va-modal-large"
            id="start-over-modal"
            onClose={this.toggleModal}
            visible={this.state.modalOpen}
          >
            <h4>Starting over will delete your in-progress {appType}.</h4>
            <p>Are you sure you want to start over?</p>
            <VaButtonPair
              primaryLabel={startNewAppButtonText}
              onPrimaryClick={this.startOver}
              secondaryLabel="Cancel"
              onSecondaryClick={this.toggleModal}
            />
          </Modal>
        </div>
      );
    }
    const { startText } = this.props;

    return (
      <a
        href="#start"
        className="vads-c-action-link--green"
        onClick={event => {
          event.preventDefault();
          this.handleLoadPrefill();
        }}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
      >
        {startText}
      </a>
    );
  }
}

FormStartControls.propTypes = {
  fetchInProgressForm: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  formSaved: PropTypes.bool.isRequired,
  prefillAvailable: PropTypes.bool.isRequired,
  removeInProgressForm: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  startPage: PropTypes.string.isRequired,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      startNewAppButtonText: PropTypes.string,
      continueAppButtonText: PropTypes.string,
    }),
  }),
  gaStartEventName: PropTypes.string,
  handleLoadPrefill: PropTypes.func,
  isExpired: PropTypes.bool,
  migrations: PropTypes.array,
  prefillTransformer: PropTypes.func,
  resumeOnly: PropTypes.bool,
  returnUrl: PropTypes.string,
  routes: PropTypes.array,
  startText: PropTypes.string,
  testActionLink: PropTypes.bool,
};

FormStartControls.defaultProps = {
  startText: 'Get Started',
  gaStartEventName: 'login-successful-start-form',
  testActionLink: false,
  formConfig: {
    customText: {
      startNewAppButtonText: '',
      continueAppButtonText: '',
    },
  },
  ariaLabel: null,
  ariaDescribedby: null,
};

export default withRouter(FormStartControls);

export { FormStartControls };
