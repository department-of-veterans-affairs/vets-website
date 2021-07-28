import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import FormFooter from 'platform/forms/components/FormFooter';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { WIZARD_STATUS_RESTARTING } from 'platform/site-wide/wizard';

import Wizard from 'applications/static-pages/wizard';

import pages from './pages';
import formConfig from '../config/form';
import { SAVED_CLAIM_TYPE, IS_PRODUCTION } from '../constants';
import {
  getHlrWizardStatus,
  removeHlrWizardStatus,
  setHlrWizardStatus,
} from '../wizard/utils';

const WizardContainer = ({ setWizardStatus }) => {
  const { title, subTitle } = formConfig;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
    scrollToTop();
  });

  sessionStorage.removeItem(SAVED_CLAIM_TYPE);
  if (getHlrWizardStatus() === WIZARD_STATUS_RESTARTING) {
    // Ensure we clear the restarting state
    removeHlrWizardStatus();
  }

  const wizard = (
    <>
      <FormTitle title={title} subTitle={subTitle} />
      <div className="wizard-container">
        <h2>Is this the form I need?</h2>
        <p>
          Use this form if you disagree with VA’s decision on your claim and
          want to request that a senior reviewer take a new look at your case
          and the evidence you provided. You can’t submit any new evidence with
          a Higher-Level Review.
        </p>
        <p>Answer a few questions to get started.</p>
        <Wizard
          pages={pages}
          expander={false}
          setWizardStatus={setWizardStatus}
        />
      </div>
    </>
  );

  return IS_PRODUCTION ? (
    wizard
  ) : (
    <article className="row">
      <div className="usa-width-two-thirds medium-8 columns vads-u-margin-bottom--2">
        {wizard}
      </div>
      <FormFooter formConfig={formConfig} />
    </article>
  );
};

WizardContainer.defaultProps = {
  setWizardStatus: setHlrWizardStatus,
};

WizardContainer.propTypes = {
  setWizardStatus: PropTypes.func.isRequired,
};

export default WizardContainer;
