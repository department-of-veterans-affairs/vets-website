import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import formConfig from '../config/form';
import UnverifiedPrefillAlert from '../components/UnverifiedPrefillAlert';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const IntroductionPage = props => {
  useEffect(() => {
    focusElement('h1');
  }, []);

  return (
    <div className="fsr-introduction schemaform-intro">
      <FormTitle title={'Request help with VA debt with VA Form 5655'} />
      <p className="subtitle">
        Equal to VA Form 5655 (Financial Status Report)
      </p>
      <SaveInProgressIntro
        startText="Submit a report to request help"
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
        Follow the steps below to request a waiver, compromise, or extended
        monthly payments for a VA debt.
      </h2>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h3 className="vads-u-font-size--h4">Prepare</h3>
            <div>
              To submit a request, you will need the following information for
              you and your spouse, if applicable.
            </div>
            <ul>
              <li>Employment history for the past two years</li>
              <li>
                Average monthly income, including gross salary, payroll
                deductions, and other income
              </li>
              <li>
                Average monthly household expenses, including rent, utilities,
                and additional living expenses
              </li>
              <li>
                Household assets, such as vehicles, savings bonds, real estate
                owned, and other assets
              </li>
              <li>
                Additional debts, including car payments, doctor bills, and
                credit card payments
              </li>
              <li>Bankruptcy documentation, if applicable</li>
            </ul>
            <h4 className="vads-u-font-size--h6">
              What if I need help with my application?
            </h4>
            <p>
              If you need help requesting help for your VA debt, you can contact
              your local Veterans Service Organization (VSO).{' '}
              <a href="https://www.va.gov/vso/">Learn about VSOs near you.</a>
            </p>
          </li>
          <li className="process-step list-two">
            <h3 className="vads-u-font-size--h4">Submit your request</h3>
            <div>
              These are the steps you can expect when submitting a request:
            </div>
            <ul>
              <li>Confirm your personal information</li>
              <li>
                Confirm or edit your mailing address, phone number, and email
                address
              </li>
              <li>Provide your average household income and expenses</li>
              <li>Provide your household assets</li>
              <li>Include additional debts and monthly bills</li>
              <li>
                Select a repayment option for each debt you need help with
              </li>
              <li>Identify whether you have adjudicated bankrupty</li>
              <li>Review and submit your request</li>
            </ul>
            <p>
              After submitting the request, you’ll get a confirmation message.
              You can print this for your records.
            </p>
            <p>
              Be sure to submit your report within 30 days of receiving a letter
              from us about your overpayment or debt. This will help to avoid
              late fees, interest, and other collection actions. If you’re
              requesting a waiver to stop collection, you must submit your
              request within 180 days for disability, education, or pension
              benefits.
            </p>
          </li>
          <li className="process-step list-three">
            <h3 className="vads-u-font-size--h4">Receive your decision</h3>
            <p>
              After we process your request, we’ll send you a letter with our
              decision. We’ll also tell you what to do next to resolve your
              debt.
            </p>
            <p>You can expect our decision within 45 days.</p>
            <h4 className="vads-u-font-size--h6">
              What if I have questions about my application?
            </h4>
            <p>
              If you have questions about payments, call us at{' '}
              <Telephone contact={CONTACTS.DMC} /> (or{' '}
              <Telephone
                contact={CONTACTS.DMC_OVERSEAS || '1-612-713-6415'}
                pattern={PATTERNS.OUTSIDE_US}
              />{' '}
              from overseas). We’re here Monday through Friday, 7:30 a.m. to
              7:00 p.m. ET.
            </p>
          </li>
        </ol>
        <SaveInProgressIntro
          buttonOnly
          startText="Submit a report to request help"
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
