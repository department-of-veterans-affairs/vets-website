import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import FormFooter from 'platform/forms/components/FormFooter';
import Wizard from 'applications/static-pages/wizard';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import pages from '../../wizard/pages';
import formConfig from '../config/form';
import { getPageTitle } from '../utils';
import {
  SAVED_SEPARATION_DATE,
  FORM_STATUS_BDD,
  DISABILITY_526_V2_ROOT_URL,
} from '../constants';

const WizardContainer = ({ setWizardStatus }) => {
  sessionStorage.removeItem(SAVED_SEPARATION_DATE);
  sessionStorage.removeItem(FORM_STATUS_BDD);
  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <h1>{getPageTitle()}</h1>
        <p>
          Equal to VA Form 21-526EZ (Application for Disability Compensation and
          Related Compensation Benefits).
        </p>
        <div className="wizard-container">
          <h2>Is this the form I need?</h2>
          <p>
            Use this form to file for disability benefits for an illness or
            injury that was caused by&mdash;or got worse because of&mdash;your
            active military service. If you’re still on active duty, you can
            file for disability benefits under the Benefits Delivery at
            Discharge program. This program allows you to file for benefits 180
            to 90 days before you leave the military.
          </p>
          <p>
            Not sure you’re eligible for VA disability benefits?{' '}
            <a href="/disability/eligibility/">
              Find out if you’re eligible for disability compensation
            </a>
          </p>
          <p>Answer a few questions to get started.</p>
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
          <a
            href={DISABILITY_526_V2_ROOT_URL}
            className="vads-u-display--inline-block vads-u-margin-bottom--3 skip-wizard-link"
            onClick={e => {
              e.preventDefault();
              recordEvent({ event: 'howToWizard-skip' });
              setWizardStatus(WIZARD_STATUS_COMPLETE);
            }}
          >
            If you know VA Form 21-526EZ is right, apply now
          </a>
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
