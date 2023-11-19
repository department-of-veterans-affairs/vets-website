import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import recordEvent from 'platform/monitoring/record-event';
import FormFooter from 'platform/forms/components/FormFooter';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import {
  WIZARD_STATUS_COMPLETE,
  WIZARD_STATUS_RESTARTING,
} from 'platform/site-wide/wizard';

import Wizard from 'applications/static-pages/wizard';

import pages from '../../wizard/pages';
import { formConfigBase } from '../config/form';
import { getPageTitle, wrapWithBreadcrumb } from '../utils';
import {
  SAVED_SEPARATION_DATE,
  FORM_STATUS_BDD,
  DISABILITY_526_V2_ROOT_URL,
  WIZARD_STATUS,
} from '../constants';

const setWizardStatus = value => {
  sessionStorage.setItem(WIZARD_STATUS, value);
};

const WizardContainer = () => {
  useEffect(() => {
    focusElement('va-breadcrumbs');
    scrollToTop();
  });

  sessionStorage.removeItem(SAVED_SEPARATION_DATE);
  sessionStorage.removeItem(FORM_STATUS_BDD);
  if (sessionStorage.getItem(WIZARD_STATUS) === WIZARD_STATUS_RESTARTING) {
    // Ensure we clear the restarting state
    sessionStorage.removeItem(WIZARD_STATUS);
  }
  const title = getPageTitle();
  const formConfig = formConfigBase;
  return wrapWithBreadcrumb(
    title,
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <FormTitle title={title} subTitle={formConfig.subTitle} />
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
            href={`${DISABILITY_526_V2_ROOT_URL}/introduction`}
            className="vads-u-display--inline-block vads-u-margin-bottom--3 skip-wizard-link"
            onClick={() => {
              setWizardStatus(WIZARD_STATUS_COMPLETE);
              recordEvent({ event: 'howToWizard-skip' });
            }}
          >
            If you know VA Form 21-526EZ is right, apply now
          </a>
        </div>
        <FormFooter formConfig={formConfig} />
      </div>
    </div>,
  );
};

WizardContainer.propTypes = {
  setWizardStatus: PropTypes.func,
};

export default WizardContainer;
