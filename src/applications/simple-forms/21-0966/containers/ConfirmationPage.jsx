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
  confirmationPageFormBypassed,
  confirmationPageAlertStatus,
  confirmationPageAlertHeadline,
  confirmationPageAlertParagraph,
  confirmationPageNextStepsParagraph,
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

  const formData = {
    ...data,
    benefitSelection: {
      [veteranBenefits.COMPENSATION]:
        data.benefitSelection?.[veteranBenefits.COMPENSATION] ||
        data.benefitSelectionCompensation,
      [veteranBenefits.PENSION]:
        data.benefitSelection?.[veteranBenefits.PENSION] ||
        data.benefitSelectionPension,
      [survivingDependentBenefits.SURVIVOR]:
        data.benefitSelection?.[survivingDependentBenefits.SURVIVOR],
    },
  };

  const { statementOfTruthSignature } = formData;
  const confirmationNumber = submission.response?.confirmationNumber;
  const submitDate = submission.timestamp;

  // Re-enable and incorporate if needed for certain flows
  // const activeSurvivorITF = submission.response?.survivorIntent;

  return (
    <>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      <va-alert
        close-btn-aria-label="Close notification"
        status={confirmationPageAlertStatus(formData)}
        visible
      >
        <h2 slot="headline">{confirmationPageAlertHeadline(formData)}</h2>
        <p className="vads-u-margin-bottom--0">
          {confirmationPageAlertParagraph(formData)}
        </p>
      </va-alert>
      {!confirmationPageFormBypassed(formData) && (
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
      )}
      {!confirmationPageFormBypassed(formData) && (
        <>
          {hasActiveCompensationITF({ formData }) &&
            formData.benefitSelection[veteranBenefits.PENSION] && (
              <div>
                <h2>
                  You’ve already submitted an intent to file for disability
                  compensation
                </h2>
                <p>
                  Our records show that you already have an intent to file for
                  disability compensation. Your intent to file for disability
                  compensation expires on{' '}
                  {format(
                    new Date(
                      formData['view:activeCompensationITF'].expirationDate,
                    ),
                    'MMMM d, yyyy',
                  )}
                  .
                </p>
              </div>
            )}
          {hasActivePensionITF({ formData }) &&
            formData.benefitSelection[veteranBenefits.COMPENSATION] && (
              <div>
                <h2>
                  You’ve already submitted an intent to file for pension claims
                </h2>
                <p>
                  Our records show that you already have an intent to file for
                  pension claims. Your intent to file for pension claims expires
                  on{' '}
                  {format(
                    new Date(formData['view:activePensionITF'].expirationDate),
                    'MMMM d, yyyy',
                  )}
                  .
                </p>
              </div>
            )}
        </>
      )}
      <div>
        <h2>What are my next steps?</h2>
        {confirmationPageNextStepsParagraph(formData) ? (
          <>
            <p>You should complete and file your claims as soon as possible.</p>
            <p>{confirmationPageNextStepsParagraph(formData)}</p>
          </>
        ) : (
          <p>
            You should complete and file your claims as soon as possible. If you
            complete and file your claim before the intent to file expires and
            we approve your claim, you may be able to get retroactive payments.
            Retroactive payments are payments for the time between when we
            processed your intent to file and when we approved your claim.
          </p>
        )}
      </div>
      {(hasActiveCompensationITF({ formData }) ||
        formData.benefitSelection[veteranBenefits.COMPENSATION]) && (
        <div>
          <a
            className="vads-c-action-link--blue vads-u-margin-y--2"
            href="/disability/file-disability-claim-form-21-526ez/introduction"
          >
            Complete your disability compensation claim
          </a>
        </div>
      )}
      {(hasActivePensionITF({ formData }) ||
        formData.benefitSelection[veteranBenefits.PENSION]) && (
        <div>
          <a
            className="vads-c-action-link--blue vads-u-margin-y--2"
            href="/find-forms/about-form-21p-527ez/"
          >
            Complete your pension claim
          </a>
        </div>
      )}
      {formData.benefitSelection[survivingDependentBenefits.SURVIVOR] && (
        <div>
          <a
            className="vads-c-action-link--blue vads-u-margin-y--2"
            href="/find-forms/about-form-21p-534ez/"
          >
            Complete your pension for survivors claim
          </a>
        </div>
      )}
      {!confirmationPageFormBypassed(formData) && (
        <a className="vads-c-action-link--green vads-u-margin-y--2" href="/">
          Go back to VA.gov
        </a>
      )}
      <div>
        <FormFooter formConfig={{ getHelp: GetFormHelp }} />
      </div>
    </>
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
