import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function IntroductionPage(props) {
  const { route } = props;
  const { formConfig, pageList } = route;
  const { appType } = formConfig?.customText;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle
        title="File a CHAMPVA claim"
        subTitle="CHAMPVA Claim Form (VA Form 10-7959a)"
      />
      <p>
        Use this {appType} if you’re currently enrolled in The Civilian Health
        and Medical Program of the Department of Veterans Affairs (CHAMPVA) and
        want to file a claim for reimbursement.
      </p>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        What to know before you fill out this {appType}
      </h2>
      <ul>
        <li>
          You must file your claim within <b>1 year</b> of when you got the
          care. If you stayed at a hospital for care, you must file your claim
          within <b>1 year</b> of when you left the hospital.
        </li>
        <li>
          Each claim needs its own {appType}. If you need to submit more than
          one claim, you’ll need to submit a new {appType} for each claim.
        </li>
        <li>
          You’ll need to submit separate claims for each beneficiary, even if
          they’re members of the same family.
        </li>
        <li>
          You’ll also need to submit supporting documents with your claim, like
          an <b>itemized billing statement</b>, an{' '}
          <b>explanation of benefits</b> (EOB) from another insurance provider,
          or a <b>pharmacy receipt</b>.
        </li>
      </ul>

      <VaLink
        text="Find out which supporting documents to submit with your claim"
        href="https://www.va.gov/COMMUNITYCARE/programs/dependents/champva/champva-claim.asp"
      />
      <br />
      <br />
      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start the form"
        unauthStartText="Sign in to start your form"
        formConfig={formConfig}
      >
        Please complete the 10-7959A form to apply for CHAMPVA claim form.
      </SaveInProgressIntro>
      <va-omb-info
        res-burden={10}
        omb-number="2900-0219"
        exp-date="12/31/2027"
      />
    </article>
  );
}

IntroductionPage.propTypes = {
  route: PropTypes.object,
};
