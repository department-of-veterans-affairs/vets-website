import React from 'react';
import PropTypes from 'prop-types';
import GetFormHelp from '../components/GetFormHelp';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import pages from '../wizard/pages';
import Wizard, {
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';

const WizardContainer = ({ setWizardStatus }) => {
  return (
    <div className="fsr-wizard row">
      <div className="usa-width-two-thirds medium-8 columns">
        <FormTitle
          title={'Request help with VA debt (VA Form 5655)'}
          subTitle={'Equal to VA Form 5655 (Financial Status Report)'}
        />
        <div className="wizard-container">
          <h2>Is this the form I need?</h2>
          <p>
            This form is for Veterans or service members who need help with debt
            related to VA disability compensation, education, or pension
            benefits. Answer a few questions to find out if this is the form you
            need. If not, we’ll guide you to the best way to get help.
          </p>
          <p>
            If you already know this is the form you need, you can go to the
            form now.
            <button
              type="button"
              className="va-button-link vads-u-display--inline-block skip-wizard-link"
              onClick={e => {
                e.preventDefault();
                setWizardStatus(WIZARD_STATUS_COMPLETE);
              }}
            >
              Request help with VA Form 5655
            </button>
          </p>
          <p>
            If you need help with a VA copay debt,{' '}
            <a href="https://www.va.gov/health-care/pay-copay-bill/financial-hardship/">
              learn how to request financial hardship assistance.
            </a>
          </p>
          <Wizard
            pages={pages}
            expander={false}
            setWizardStatus={setWizardStatus}
          />
        </div>
        <div className="help-container">
          <h2 className="help-heading">Need help?</h2>
          <GetFormHelp />
        </div>
      </div>
    </div>
  );
};

WizardContainer.propTypes = {
  setWizardStatus: PropTypes.func,
};

export default WizardContainer;
