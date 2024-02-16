import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import FormFooter from 'platform/forms/components/FormFooter';

import GetFormHelp from '../../shared/components/GetFormHelp';
import {
  hasActiveCompensationITF,
  hasActivePensionITF,
} from '../config/helpers';
import {
  veteranBenefits,
  survivingDependentBenefits,
} from '../definitions/constants';

export const ConfirmationPage = props => {
  useLayoutEffect(() => {
    focusElement('h2', null, 'va-alert');
    scrollToTop('topScrollElement');
  }, []);

  const { form } = props;
  const { submission, data } = form;

  const { statementOfTruthSignature } = data;
  const confirmationNumber = submission.response?.confirmationNumber;
  const submitDate = submission.timestamp;

  const activeSurvivorITF = submission.response?.survivorIntent;

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      {hasActiveCompensationITF({ formData: data }) &&
      hasActivePensionITF({ formData: data }) ? (
        <>
          <va-alert
            close-btn-aria-label="Close notification"
            status="warning"
            visible
          >
            <h2 slot="headline">
              You already have an intent to file on record
            </h2>
            <p className="vads-u-margin-bottom--0">
              Our records show that you already have an intent to file for
              disability compensation and for pension claims.
            </p>
          </va-alert>
          <div>
            <h2>What are my next steps?</h2>
            <p>You should complete and file your claims as soon as possible.</p>
            <p>
              Your intent to file for disability compensation expires on{' '}
              {data['view:activeCompensationITF'].expirationDate} and your
              intent to file for pension claims expires on{' '}
              {data['view:activePensionITF'].expirationDate}. You’ll need to
              file your claims by these dates to get retroactive payments
              (payments for the time between when you submit your intent to file
              and when we approve your claim).
            </p>
            <div>
              <a
                className="vads-c-action-link--blue vads-u-margin-bottom--4"
                href="/disability/file-disability-claim-form-21-526ez/introduction"
              >
                Complete your disability compensation claim
              </a>
            </div>
            <div>
              <a
                className="vads-c-action-link--blue vads-u-margin-bottom--4"
                href="/find-forms/about-form-21p-527ez/"
              >
                Complete your pension claim
              </a>
            </div>
          </div>
        </>
      ) : (
        <>
          <va-alert
            close-btn-aria-label="Close notification"
            status="success"
            visible
          >
            <h2 slot="headline">You’ve submitted your intent to file</h2>
            <p className="vads-u-margin-bottom--0">
              Your intent to file for{' '}
              {(data.benefitSelection[veteranBenefits.COMPENSATION] ||
                (hasActiveCompensationITF({ formData: data }) &&
                  !data.benefitSelection[veteranBenefits.PENSION])) &&
                'disability compensation'}
              {(data.benefitSelection[veteranBenefits.PENSION] ||
                (hasActivePensionITF({ formData: data }) &&
                  !data.benefitSelection[veteranBenefits.COMPENSATION])) &&
                (data.benefitSelection[veteranBenefits.COMPENSATION]
                  ? ' and pension'
                  : 'pension')}
              {data.benefitSelection[survivingDependentBenefits.SURVIVOR] &&
                'pension for survivors'}{' '}
              will expire in one year.
            </p>
          </va-alert>
          <div className="inset">
            <h3 className="vads-u-margin-top--1" slot="headline">
              Your submission information
            </h3>
            <dl>
              {statementOfTruthSignature && (
                <>
                  <dt>
                    <h4>Who submitted this form</h4>
                  </dt>
                  <dd>{statementOfTruthSignature}</dd>
                </>
              )}
              {confirmationNumber && (
                <>
                  <dt>
                    <h4>Confirmation number</h4>
                  </dt>
                  <dd>{confirmationNumber}</dd>
                </>
              )}
              {isValid(submitDate) && (
                <>
                  <dt>
                    <h4>Date submitted</h4>
                  </dt>
                  <dd>{format(submitDate, 'MMMM d, yyyy')}</dd>
                </>
              )}
              <dt>
                <h4>Confirmation for your records</h4>
              </dt>
              <dd>You can print this confirmation page for your records</dd>
            </dl>
            <va-button onClick={window.print} text="Print this page" />
          </div>
          {hasActiveCompensationITF({ formData: data }) &&
            data.benefitSelection[veteranBenefits.PENSION] && (
              <div>
                <h2>
                  You’ve already submitted an intent to file for disability
                  compensation
                </h2>
                <p>
                  Our records show that you already have an intent to file for
                  disability compensation. Your intent to file for disability
                  compensation expires on{' '}
                  {data['view:activeCompensationITF'].expirationDate}. You’ll
                  need to submit your claim by this date in order to receive
                  payments starting from your effective date.
                </p>
              </div>
            )}
          {hasActivePensionITF({ formData: data }) &&
            data.benefitSelection[veteranBenefits.COMPENSATION] && (
              <div>
                <h2>You’ve already submitted an intent to file for pension</h2>
                <p>
                  Our records show that you already have an intent to file for
                  pension. Your intent to file for pension expires on{' '}
                  {data['view:activePensionITF'].expirationDate}. You’ll need to
                  submit your claim by this date in order to receive payments
                  starting from your effective date.
                </p>
              </div>
            )}
          {activeSurvivorITF && (
            <div>
              <h2>
                You’ve already submitted an intent to file for pension for
                survivors
              </h2>
              <p>
                Our records show that you already have an intent to file for
                pension for survivors. Your intent to file for pension for
                survivors expires on {activeSurvivorITF.expirationDate}. You’ll
                need to submit your claim by this date in order to receive
                payments starting from your effective date.
              </p>
            </div>
          )}
          <div>
            <h2>What are my next steps?</h2>
            <p>You should complete and file your claims as soon as possible.</p>
            <p>
              {(hasActiveCompensationITF({ formData: data }) &&
                data.benefitSelection[veteranBenefits.PENSION]) ||
              (hasActivePensionITF({ formData: data }) &&
                data.benefitSelection[veteranBenefits.COMPENSATION]) ||
              (data.benefitSelection[veteranBenefits.COMPENSATION] &&
                data.benefitSelection[veteranBenefits.PENSION]) ? (
                <>
                  You’ll need to file your claims within 1 year to get
                  retroactive payments (payments for the time between when you
                  submit your intent to file and when we approve your claim).
                </>
              ) : (
                <>
                  Your intent to file for{' '}
                  {(hasActiveCompensationITF({ formData: data }) ||
                    data.benefitSelection[veteranBenefits.COMPENSATION]) &&
                    'disability compensation'}
                  {(hasActivePensionITF({ formData: data }) ||
                    data.benefitSelection[veteranBenefits.PENSION]) &&
                    'pension'}
                  {data.benefitSelection[survivingDependentBenefits.SURVIVOR] &&
                    'pension for survivors'}{' '}
                  expires one year from today. You’ll need to file your claim by
                  this date to get retroactive payments (payments for the time
                  between when you submit your intent to file and when we
                  approve your claim).
                </>
              )}
            </p>
            {(hasActiveCompensationITF({ formData: data }) ||
              data.benefitSelection[veteranBenefits.COMPENSATION]) && (
              <div>
                <a
                  className="vads-c-action-link--blue vads-u-margin-bottom--4"
                  href="/disability/file-disability-claim-form-21-526ez/introduction"
                >
                  Complete your disability compensation claim
                </a>
              </div>
            )}
            {(hasActivePensionITF({ formData: data }) ||
              data.benefitSelection[veteranBenefits.PENSION]) && (
              <div>
                <a
                  className="vads-c-action-link--blue vads-u-margin-bottom--4"
                  href="/find-forms/about-form-21p-527ez/"
                >
                  Complete your pension claim
                </a>
              </div>
            )}
            {data.benefitSelection[survivingDependentBenefits.SURVIVOR] && (
              <div>
                <a
                  className="vads-c-action-link--blue vads-u-margin-bottom--4"
                  href="/find-forms/about-form-21p-534ez/"
                >
                  Complete your pension for survivors claim
                </a>
              </div>
            )}
          </div>
          <a
            className="vads-c-action-link--green vads-u-margin-bottom--4"
            href="/"
          >
            Go back to VA.gov
          </a>
        </>
      )}
      <div>
        <FormFooter formConfig={{ getHelp: GetFormHelp }} />
      </div>
    </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      statementOfTruthSignature: PropTypes.string,
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      response: PropTypes.shape({
        confirmationNumber: PropTypes.string,
        expirationDate: PropTypes.string,
        compensationIntent: PropTypes.shape(),
        pensionIntent: PropTypes.shape(),
        survivorIntent: PropTypes.shape(),
      }),
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
