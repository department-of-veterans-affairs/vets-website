import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import { isLoggedIn, selectProfile } from 'platform/user/selectors';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';

export const IntroductionPage = ({ route }) => {
  const { formConfig, pageList } = route;
  const loggedIn = useSelector(isLoggedIn);
  // LOA3 Verified?
  const isVerified = useSelector(
    state => selectProfile(state)?.verified || false,
  );
  const hasInProgressForm = useSelector(state =>
    selectProfile(state)?.savedForms?.some(
      form => form.form === route.formConfig.formId,
    ),
  );

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const pbbFormsRequireLoa3 = useToggleValue(TOGGLE_NAMES.pbbFormsRequireLoa3);

  const renderIfVeteranContent = authenticated => {
    const prefix = authenticated ? 'You’ll' : 'If you’re the Veteran, you’ll';
    const body = 'need to report income and assets for these individuals:';
    // Combining prefix and body here for screen reader clarity
    const text = `${prefix} ${body}`;

    return (
      <>
        <p>{text}</p>
        <ul>
          <li>
            Yourself, <strong>and</strong>
          </li>
          <li>
            Your spouse (unless you live apart, and you are estranged, and you
            do not contribute to your spouse’s support), <strong>and</strong>
          </li>
          <li>
            Your child or children (unless you do not have custody or contribute
            to your child’s or children’s support)
          </li>
        </ul>
      </>
    );
  };

  const renderAccordionContent = () => (
    <va-accordion>
      <va-accordion-item header="If you’re the Veteran" level="3">
        {renderIfVeteranContent()}
      </va-accordion-item>
      <va-accordion-item header="If you’re the surviving spouse" level="3">
        <p>
          If you’re the surviving spouse, you’ll need to report income and
          assets for these individuals:
        </p>
        <ul>
          <li>
            Yourself, <strong>and</strong>
          </li>
          <li>
            Your child or children (unless you do not have custody or not
            contribute to your child’s or children’s support)
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item
        header="If you’re the surviving child or custodian of a surviving child"
        level="3"
      >
        <p>
          If you’re the surviving child or custodian of a surviving child,
          you’ll need to report income and assets for these individuals:
        </p>
        <ul>
          <li>
            Yourself and/or the surviving child, <strong>and</strong>
          </li>
          <li>
            The child’s custodian (unless the child’s custodian is an
            institution), <strong>and</strong>
          </li>
          <li>The custodian’s spouse</li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="If you’re the parent" level="3">
        <p>
          If you’re the parent, you’ll need to report income and assets for
          these individuals:
        </p>
        <ul>
          <li>
            Yourself, <strong>and</strong>
          </li>
          <li>
            Your spouse (The Veteran’s other parent should file a separate
            claim.)
          </li>
        </ul>
        <p>
          <strong>Note: </strong> Parents’ DIC claimants don’t need to report or
          provide documentation of their assets.
        </p>
      </va-accordion-item>
    </va-accordion>
  );

  return (
    <article className="schemaform-intro">
      <FormTitle
        title="Submit income and asset statement to support your claim"
        subTitle="Pension or DIC income and asset statement (VA Form 21P-0969)"
      />
      <p className="va-introtext">
        Complete this form if you need to report or verify income and net worth
        to support your Claim for Pension or Parents’ Dependency Indemnity
        Compensation (DIC).
      </p>
      <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
        What to know before you fill out this form
      </h2>
      <p>There are different reasons why you may need to submit this form:</p>
      <ul>
        <li>
          As a supporting form requested by your Application for Veterans
          Pension (VA21P-527 or VA21P-527EZ), <strong>or</strong>
        </li>
        <li>
          As a supporting form requested by your DIC, Survivors’ Pension, and/or
          Accrued Benefits (VA21P-534 or 21P-534EZ), <strong>or</strong>
        </li>
        <li>
          You have an overflow of assets, <strong>or</strong>
        </li>
        <li>
          You need to report an irregular or unusual change in your income
          assets
        </li>
      </ul>
      <div className="vads-u-margin-y--2">
        <va-link
          href="/pension/eligibility/"
          text="Find out if you’re eligible for Veterans Pension benefits"
        />
      </div>
      {!loggedIn && (
        <div className="vads-u-margin-y--2">
          <va-link
            href="/family-and-caregiver-benefits/survivor-compensation/dependency-indemnity-compensation/#am-i-eligible-for-va-dic-as-a-"
            text="Find out if you’re eligible for VA Dependency and Indemnity
          Compensation (DIC)"
          />
        </div>
      )}
      <va-additional-info trigger="What we consider an asset">
        Assets include the fair market value of all property that you own, minus
        the amount of any mortgages you may have. Assets don’t include your or
        your dependents’ primary residence and lot (up to 2 acres).
      </va-additional-info>
      <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
        What you’ll need to report
      </h2>
      {loggedIn ? renderIfVeteranContent() : renderAccordionContent()}

      <va-additional-info
        class="vads-u-margin-y--3"
        trigger="What we consider child custody"
      >
        We define child custody for pension purposes in 38 C.F.R.§ 3.57(d).
        Natural or adoptive parent has custody of a child unless custody is
        legally removed. For pension purposes, a child who has attained age 18
        remains in the custody of the person who had custody before the child
        turned 18 unless custody is legally removed.
      </va-additional-info>

      {/* Only show the verify alert if all of the following are true:
        - the user is logged in
        - the feature toggle is enabled
        - the user is NOT LOA3 verified
        - the user does not have an in-progress form (we want LOA1 users to be
          able to continue their form)
      */}
      {loggedIn && pbbFormsRequireLoa3 && !isVerified && !hasInProgressForm ? (
        <>
          <VerifyAlert />
          <p>
            If you don’t want to verify your identity right now, you can still
            download and complete the PDF version of this application.
          </p>
          <p className="vads-u-margin-bottom--4">
            <va-link
              href="https://www.vba.va.gov/pubs/forms/VBA-21P-0969-ARE.pdf"
              download
              filetype="PDF"
              text="Get VA Form 21P-0969 form to download"
              pages="11"
            />
          </p>
        </>
      ) : (
        <SaveInProgressIntro
          hideUnauthedStartLink={pbbFormsRequireLoa3}
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Income and Asset Statement application"
        />
      )}
      <div className="vads-u-margin-top--2">
        <va-omb-info
          res-burden={30}
          omb-number="2900-0829"
          exp-date="11/30/2026"
        />
      </div>
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    pageList: PropTypes.array,
    formConfig: PropTypes.shape({
      formId: PropTypes.string,
      downtime: PropTypes.object,
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
    }),
  }),
};

export default IntroductionPage;
