import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  VaButton,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '../../monitoring/record-event';

import {
  WIZARD_STATUS,
  WIZARD_STATUS_RESTARTING,
} from '~/platform/site-wide/wizard';
import {
  CONTINUE_APP_DEFAULT_MESSAGE,
  START_NEW_APP_DEFAULT_MESSAGE,
  APP_TYPE_DEFAULT,
} from '../../forms-system/src/js/constants';

const FormStartControls = props => {
  const {
    formId,
    migrations,
    startPage,
    gaStartEventName,
    prefillAvailable,
    prefillTransformer,
    ariaLabel = null,
    ariaDescribedby = null,
    startText,
    formSaved,
    isExpired,
    resumeOnly,
  } = props;

  // get access to the formConfig object through this route
  const { formConfig } = props.routes?.[1] || props.formConfig || {};

  const [modalOpen, setModalOpen] = useState(false);

  const goToBeginning = () => {
    props.router.push(startPage);
  };

  const captureAnalytics = () =>
    gaStartEventName && recordEvent({ event: gaStartEventName });

  const handleLoadPrefill = () => {
    captureAnalytics();
    if (prefillAvailable) {
      props.fetchInProgressForm(
        // TODO: where does this come from?
        formId,
        migrations,
        true,
        prefillTransformer,
      );
    } else {
      goToBeginning();
    }
  };

  const handleLoadForm = () =>
    // If successful, this will set form.loadedData.metadata.returnUrl and will
    //  trickle down to this.props to be caught in componentWillReceiveProps
    props.fetchInProgressForm(formId, migrations);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const startOver = () => {
    captureAnalytics();
    toggleModal();
    props.removeInProgressForm(formId, migrations, prefillTransformer);

    // Wizard status needs an intermediate value between not-started &
    // complete to prevent infinite loops in the RoutedSavableApp
    sessionStorage.setItem(
      formConfig?.wizardStorageKey || WIZARD_STATUS,
      WIZARD_STATUS_RESTARTING,
    );
  };

  const {
    appType = APP_TYPE_DEFAULT,
    continueAppButtonText = CONTINUE_APP_DEFAULT_MESSAGE,
    startNewAppButtonText = START_NEW_APP_DEFAULT_MESSAGE,
  } = formConfig?.customText || {};

  if (formSaved) {
    return (
      <div>
        {!isExpired && (
          <VaButton
            onClick={handleLoadForm}
            text={continueAppButtonText}
            label={ariaLabel}
            data-testid="continue-your-application"
            uswds
          />
        )}
        {!resumeOnly && (
          <VaButton
            onClick={toggleModal}
            text={startNewAppButtonText}
            secondary={!isExpired}
            label={ariaLabel}
            uswds
          />
        )}
        <VaModal
          id="start-over-modal"
          status="warning"
          clickToClose
          modalTitle={`Starting over will delete your in-progress ${appType}.`}
          primaryButtonText={startNewAppButtonText}
          secondaryButtonText="Cancel"
          onCloseEvent={toggleModal}
          onPrimaryButtonClick={startOver}
          onSecondaryButtonClick={toggleModal}
          visible={modalOpen}
          uswds
        >
          {/* <h4>Starting over will delete your in-progress {appType}.</h4> */}
          <p>Are you sure you want to start over?</p>
        </VaModal>
      </div>
    );
  }

  return (
    <a
      href="#start"
      className="vads-c-action-link--green"
      onClick={event => {
        event.preventDefault();
        handleLoadPrefill();
      }}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
    >
      {startText}
    </a>
  );
};

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
