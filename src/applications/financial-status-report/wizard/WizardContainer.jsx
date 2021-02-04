import React from 'react';
import PropTypes from 'prop-types';
import FormFooter from 'platform/forms/components/FormFooter';
import formConfig from '../config/form';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import pages from '../wizard/pages';
import Wizard, {
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';

const FORM_STATUS_BDD = 'formStatusBdd';

const WizardContainer = ({ setWizardStatus }) => {
  sessionStorage.removeItem(FORM_STATUS_BDD);
  return (
    <div className="fsr-wizard row">
      <div className="usa-width-two-thirds medium-8 columns">
        <FormTitle title={'Request help with VA debt with VA Form 5655'} />
        <p className="subtitle">
          Equal to VA Form 5655 (Financial Status Report)
        </p>
        <div className="wizard-container">
          <h2>Is this the form I need?</h2>
          <p>
            Answer a few questions to find out if VA Form 5655 is the right form
            for you. If you’re a dependent or family member, you might need to
            request repayment assistance using a different version of the
            Financial Status Report.
          </p>
          <p>
            If you already know this is the correct form, you can go directly to
            the online form without answering questions.{' '}
            <a href="#">
              Request financial assistance for VA repayments with the Financial
              Status Report.
            </a>
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
};

WizardContainer.propTypes = {
  setWizardStatus: PropTypes.func,
};

export default WizardContainer;
