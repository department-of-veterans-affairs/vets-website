import React from 'react';
import PropTypes from 'prop-types';

import FormFooter from 'platform/forms/components/FormFooter';
import Wizard, {
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';

import pages from '../../wizard/pages';
import formConfig from '../config/form';
import { getPageTitle } from '../utils';

const WizardContainer = ({ setWizardStatus }) => (
  <div className="row">
    <div className="usa-width-two-thirds medium-8 columns">
      <h1>{getPageTitle()}</h1>
      <p>
        Equal to VA Form 21-526EZ (Application for Disability Compensation and
        Related Compensation Benefits).
      </p>
      <div className="wizard-container">
        <h2>Find out if this is the right form</h2>
        <p>
          This application is for veterans and service members to seek
          disability compensation for an illness or injury that was caused
          by&mdash;or got worse because of&mdash;your active military service.
          Compensation may include financial support and other benefits like
          health care. To see if this is the right form for you, please answer a
          few questions.
        </p>
        <Wizard
          pages={pages}
          expander={false}
          setWizardStatus={setWizardStatus}
        />
        <h2>Already know this is the right form?</h2>
        <p>
          If you know VA Form 21-526EZ is correct, or if you were directed to
          complete this application, you can go straight to the application
          without answering the questions above.
        </p>
        <button
          type="button"
          className="va-button-link vads-u-display--inline-block vads-u-margin-bottom--3 skip-wizard-link"
          onClick={e => {
            e.preventDefault();
            setWizardStatus(WIZARD_STATUS_COMPLETE);
          }}
        >
          If you know VA Form 21-526EZ is right, apply now
        </button>
      </div>
      <FormFooter formConfig={formConfig} />
    </div>
  </div>
);

WizardContainer.propTypes = {
  setWizardStatus: PropTypes.func,
};

export default WizardContainer;
