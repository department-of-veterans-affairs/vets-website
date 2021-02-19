import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import formConfig from '../config/form';
import UnverifiedPrefillAlert from '../components/UnverifiedPrefillAlert';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

const IntroductionPage = props => {
  useEffect(() => {
    focusElement('h1');
  }, []);

  return (
    <div className="fsr-introduction schemaform-intro">
      <FormTitle
        title={'Request help with VA debt (VA Form 5655)'}
        subTitle={'Equal to VA Form 5655 (Financial Status Report)'}
      />
      <SaveInProgressIntro
        startText="Start your request now"
        unauthStartText="Sign in or create an account"
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        formConfig={formConfig}
        formId={props.formId}
        retentionPeriod="60 days"
        downtime={props.route.formConfig.downtime}
        prefillEnabled={props.route.formConfig.prefillEnabled}
        verifyRequiredPrefill={props.route.formConfig.verifyRequiredPrefill}
        unverifiedPrefillAlert={<UnverifiedPrefillAlert />}
      />
      <h2 className="vads-u-font-size--h3">
        Follow these steps to request help with a VA debt payment
      </h2>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h3 className="vads-u-font-size--h4">Prepare</h3>
            <p>
              You'll need this information for you (and your spouse if you’re
              married):
            </p>
            <ul>
              <li>
                <strong>Work history for the past 2 years. </strong>
                You'll need the employer name, start and end dates, and monthly
                income for each job.
              </li>
              <li>
                <strong>Income. </strong>
                This includes money you earn from a job, VA or Social Security
                benefits, or other sources. You’ll find the details you’ll need
                on a recent paycheck.
              </li>
              <li>
                <strong>Assets. </strong>
                These include cash, savings, stocks and bonds, real estate,
                cars, jewelry, and other items of value.
              </li>
              <li>
                <strong>Monthly living expenses. </strong>
                These include housing, food, and utilities (like gas,
                electricity, and water).
              </li>
              <li>
                <strong>Installment contracts or other debts. </strong>
                These include car loans, student loans, credit card debt, and
                other debts or purchase payment plans.
              </li>
              <li>
                <strong>Other living expenses. </strong>
                These include expenses like clothing, transportation, child
                care, or health care.
              </li>
              <li>
                <strong>If you've ever declared bankruptcy, </strong>
                you'll need any related documents.
              </li>
            </ul>
            <p>
              If you need help with your request,{' '}
              <a href="https://www.va.gov/vso/">
                contact a local Veterans Service Organization (VSO).
              </a>
            </p>
            <AdditionalInfo
              status="info"
              triggerText="Why does VA need all this information?"
            >
              <span>
                We want to make sure we fully understand your financial
                situation. If you’re married, we also need to understand your
                spouse’s financial situation. This helps us make the best
                decision on your request.
              </span>
            </AdditionalInfo>
          </li>
          <li className="process-step list-two">
            <h3 className="vads-u-font-size--h4">Submit your request</h3>
            <p>
              We’ll take you through each step of the process. It should take
              about 30 minutes.
            </p>

            <p>
              When you submit your request, you’ll get a confirmation message.
              You can print this for your records.
            </p>
            <p>
              <strong>Note: </strong>
              Submit your request within <strong>30 days</strong> of receiving a
              debt collection letter from us. This will help you avoid late
              fees, interest, and other collection actions.
            </p>
          </li>
          <li className="process-step list-three">
            <h3 className="vads-u-font-size--h4">
              Take any needed next steps to resolve the debt
            </h3>
            <p>
              Within 45 days of when you submit your request, we’ll send you
              this information by mail:
            </p>
            <ul>
              <li>Our decision on your request</li>
              <li>Any payments you may need to make, and how to make them</li>
              <li>How to appeal our decision if you disagree</li>
            </ul>
            <p>If you need to make any payments, be sure to pay on time.</p>
          </li>
        </ol>
        <SaveInProgressIntro
          buttonOnly
          startText="Start your request now"
          unauthStartText="Sign in or create an account"
          pageList={props.route.pageList}
          messages={props.route.formConfig.savedFormMessages}
          formConfig={formConfig}
          formId={props.formId}
          prefillEnabled={props.route.formConfig.prefillEnabled}
        />
      </div>
      <div className="omb-info--container">
        <OMBInfo resBurden={60} ombNumber="2900-0862" expDate="02/28/2022" />
      </div>
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
      prefillEnabled: PropTypes.bool,
    }),
    pageList: PropTypes.array.isRequired,
  }).isRequired,
  user: PropTypes.shape({}),
};

export default connect(mapStateToProps)(IntroductionPage);
