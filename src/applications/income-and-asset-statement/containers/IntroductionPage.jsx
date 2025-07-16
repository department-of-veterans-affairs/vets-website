import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

export const IntroductionPage = ({ route }) => {
  const loggedIn = useSelector(isLoggedIn);
  const { formConfig, pageList } = route;

  useEffect(() => {
    focusElement('h1');
  }, []);

  const renderIfVeteranContent = () => (
    <>
      <p>You’ll need to report income and assets for these individuals:</p>
      <ul>
        <li>
          Yourself, <strong>and</strong>
        </li>
        <li>
          Your spouse (unless you live apart, and you are estranged, and you do
          not contribute to your spouse’s support), <strong>and</strong>
        </li>
        <li>
          Your child or children (unless you do not have custody or contribute
          to your child’s or children’s support)
        </li>
      </ul>
    </>
  );

  const renderAccordionContent = () => (
    <va-accordion>
      <va-accordion-item header="If you’re the Veteran" level="3">
        {renderIfVeteranContent()}
      </va-accordion-item>
      <va-accordion-item header="If you’re the surviving spouse" level="3">
        <p>You’ll need to report income and assets for these individuals:</p>
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
        <p>You’ll need to report income and assets for these individuals:</p>
        <ul>
          <li>
            Yourself and/or the surviving child, <strong>and</strong>
          </li>
          <li>
            the child’s custodian (unless the child’s custodian is an
            institution), <strong>and</strong>
          </li>
          <li>the custodian’s spouse</li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="If you’re the parent" level="3">
        <p>You’ll need to report income and assets for these individuals:</p>
        <ul>
          <li>
            Yourself, <strong>and</strong>
          </li>
          <li>
            Your spouse (even if your spouse is the Veteran’s other parent. If
            your spouse is the Veteran’s other parent, you should file separate
            claims.)
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
          As a supporting form requested by your DIC, Survivors’ Pension and/or
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

      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start the Income and Asset Statement application"
      />

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
      downtime: PropTypes.object,
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
    }),
  }),
};

export default IntroductionPage;
