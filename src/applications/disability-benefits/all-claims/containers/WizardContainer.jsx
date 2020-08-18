import React from 'react';
import PropTypes from 'prop-types';

import FormFooter from 'platform/forms/components/FormFooter';
import Wizard, {
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';

import pages from '../../wizard/pages';
import formConfig from '../config/form';

const WizardContainer = ({ setWizardStatus }) => (
  <div className="row">
    <div className="usa-width-two-thirds medium-8 columns">
      <h1>File for disability compensation</h1>
      <p>
        Equal to VA Form 21-526EZ (Application for Disability Compensation and
        Related Compensation Benefits).
      </p>
      <div className="wizard-container">
        <h2>Find out if this is the right form</h2>
        <p>
          Answer a few questions to confirm that this is the correct application
          21-526EZ or another application form to apply for the VA benefits you
          need.
        </p>
        <Wizard
          pages={pages}
          expander={false}
          setWizardStatus={setWizardStatus}
        />
        <h2>Already know this is the right form?</h2>
        <p>
          If you know VA Form 21-526EZ is correct, or if you were directd to
          complete this application, you can go straight to the application
          withouut answering the questions above.
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
  completed: PropTypes.func,
};

export default WizardContainer;
