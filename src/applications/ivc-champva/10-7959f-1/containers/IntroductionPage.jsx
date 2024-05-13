import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Link } from 'react-router';

const IntroductionPage = props => {
  const { route } = props;
  const { formConfig, pageList } = route;

  const firstPage = pageList[1]?.path;

  useEffect(
    () => {
      focusElement('.va-nav-breadcrumbs-list');
    },
    [props],
  );

  return (
    <article className="schemaform-intro">
      <FormTitle
        title="Register for the Foreign Medical Program (FMP)"
        subTitle="FMP Registration Form (VA Form 10-7959f-1)"
      />
      <p>
        If you’re a Veteran who gets medical care outside the U.S. for a
        service-connected condition, we may cover the cost of your care. Use
        this form to register for the Foreign Medical Program.
      </p>
      <va-process-list uswds="false" class="process-list">
        <h3>What to know before you fill out this form</h3>
        <ul>
          <li>
            You’ll need your Social Security number or your VA file number.
          </li>
          <li>
            After you register, we’ll send you a benefits authorization letter.
            This letter will list your service-connected conditions that we’ll
            cover. Then you can file FMP claims for care related to the covered
            conditions.
          </li>
        </ul>
      </va-process-list>
      <VaAlert status="info" visible uswds>
        <h2>Sign in now to save time and save your work in progress</h2>
        <p>Here’s how signing in now helps you:</p>
        <ul>
          <li>
            We can fill in some of your information for you to save you time.
          </li>
          <li>
            You can save your work in progress. You’ll have 60 days from when
            you start, or make updates, to come back and finish it.
          </li>
        </ul>
        <p>
          <strong>Note:</strong> You can sign in after you start your
          registration form. But you’ll lose any information you already filled
          in.
        </p>
        <SaveInProgressIntro
          buttonOnly
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          unauthStartText="Sign in to start your form"
          hideUnauthedStartLink
        />
        <p className="vads-u-margin-top--2">
          <Link to={firstPage}>Start your form without signing in</Link>
        </p>
      </VaAlert>
      <p />
      <va-omb-info
        res-burden={4}
        omb-number="2900-0648"
        exp-date="03/31/2027"
      />
    </article>
  );
};

export default IntroductionPage;
