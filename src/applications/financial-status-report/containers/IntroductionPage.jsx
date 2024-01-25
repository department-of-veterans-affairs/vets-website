import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import recordEvent from 'platform/monitoring/record-event';
import formConfig from '../config/form';
import UnverifiedPrefillAlert from '../components/shared/UnverifiedPrefillAlert';
import { WIZARD_STATUS } from '../wizard/constants';
import manifest from '../manifest.json';
import { clearJobIndex } from '../utils/session';

const IntroductionPage = ({ route, formId }) => {
  useEffect(() => {
    focusElement('h1');
    clearJobIndex();
  }, []);

  return (
    <div className="fsr-introduction schemaform-intro">
      <FormTitle
        title="Request help with VA debt for overpayments and copay bills"
        subTitle="Financial Status Report (VA Form 5655)"
      />
      <SaveInProgressIntro
        startText="Start your request now"
        unauthStartText="Sign in or create an account"
        messages={route.formConfig.savedFormMessages}
        pageList={route.pageList}
        formConfig={formConfig}
        formId={formId}
        retentionPeriod="60 days"
        downtime={route.formConfig.downtime}
        prefillEnabled={route.formConfig.prefillEnabled}
        verifyRequiredPrefill={route.formConfig.verifyRequiredPrefill}
        unverifiedPrefillAlert={<UnverifiedPrefillAlert />}
        hideUnauthedStartLink
      />
      <h2 className="vads-u-font-size--h3">
        Follow these steps to request help
      </h2>
      <p>
        If you don’t think this is the right form for you,
        <a
          href={manifest.rootUrl}
          onClick={() => {
            sessionStorage.removeItem(WIZARD_STATUS);
            recordEvent({ event: 'howToWizard-start-over' });
          }}
          className="vads-u-margin-left--0p5"
        >
          go back and answer questions again
        </a>
        .
      </p>
      <va-process-list
        uswds
        class="vads-u-margin-left--neg2 vads-u-padding-bottom--0"
      >
        <va-process-list-item header="Prepare">
          <p>
            You’ll need this information for you (and your spouse if you’re
            married):
          </p>
          <ul>
            <li>
              <strong>Work history for the past 2 years.</strong> You’ll need
              the employer’s name, start and end dates, and monthly income for
              each job.
            </li>
            <li>
              <strong>Income.</strong> This includes earned money from a job, VA
              or Social Security benefits, or other sources. You’ll find the
              details you’ll need on a recent pay stub or statement.
            </li>
            <li>
              <strong>Assets.</strong> This includes available cash (not in a
              bank).
            </li>
          </ul>
          <p>
            We may also ask you to share this information for you and your
            spouse (if you’re married):
          </p>
          <ul>
            <li>
              <strong>Additional assets.</strong> This includes cash in a
              checking or savings account, stocks and bonds, real estate, cars,
              jewelry, and other items of value.
            </li>
            <li>
              <strong>Monthly living expenses.</strong> These include housing,
              food, and utilities (like gas, electricity, and water).
            </li>
            <li>
              <strong>Installment contracts or other debts.</strong> These
              include car loans, student loans, credit card debt, and other
              debts or purchase payment plans.
            </li>
            <li>
              <strong>Other living expenses.</strong> These include expenses
              like clothing, transportation, child care, or health care.
            </li>
            <li>
              <strong>If you’ve ever declared bankruptcy,</strong> you’ll need
              any related documents.
            </li>
          </ul>
          <p>
            If you need help with your request,{' '}
            <a href="https://www.va.gov/vso/">
              contact a local Veterans Service Organization (VSO).
            </a>
          </p>
          <va-alert status="info" uswds visible>
            <p className="vads-u-margin-top--0p25">
              <strong>Why do we ask for this information?</strong>
            </p>
            <p>
              We want to make sure we fully understand your financial situation.
              If you’re married, we also need to understand your spouse’s
              financial situation. This helps us make the best decision on your
              request. We will not take collections on your household assets.
            </p>
            <p className="vads-u-margin-bottom--0">
              <strong>Note:</strong> We keep this information confidential. We
              won’t use or share this information to collect on your income or
              any assets.
            </p>
          </va-alert>
        </va-process-list-item>
        <va-process-list-item header="Submit your request">
          <p>
            We’ll take you through each step of the process. It should take
            about 60 minutes.
          </p>

          <p>
            When you submit your request, you’ll get a confirmation message. You
            can print this for your records.
          </p>
          <p>
            <strong>Note:</strong>
            Submit your request within <strong>30 days</strong> of receiving a
            debt collection letter from us. This will help you avoid late fees,
            interest, and other collection actions.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Follow-up">
          <p>
            After we review your request, we’ll send you this information by
            mail:
          </p>
          <ul>
            <li>Our decision on your request</li>
            <li>Any payments you may need to make, and how to make them</li>
            <li>How to appeal our decision if you disagree</li>
          </ul>
          <p>If you need to make any payments, be sure to pay on time.</p>
        </va-process-list-item>
      </va-process-list>

      <SaveInProgressIntro
        buttonOnly
        startText="Start your request now"
        unauthStartText="Sign in or create an account"
        pageList={route.pageList}
        messages={route.formConfig.savedFormMessages}
        formConfig={formConfig}
        formId={formId}
        prefillEnabled={route.formConfig.prefillEnabled}
        hideUnauthedStartLink
      />

      <va-omb-info
        res-burden={60}
        omb-number="2900-0165"
        exp-date="11/30/2026"
        class="vads-u-margin-top--2"
      />
    </div>
  );
};

const mapStateToProps = state => ({
  formId: state.form.formId,
  user: state.user,
});

IntroductionPage.propTypes = {
  formId: PropTypes.string.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      downtime: PropTypes.object,
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
      verifyRequiredPrefill: PropTypes.string,
    }),
    pageList: PropTypes.array.isRequired,
  }).isRequired,
  user: PropTypes.shape({}),
};

export default connect(mapStateToProps)(IntroductionPage);
