import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import FormFooter from 'platform/forms/components/FormFooter';

import GetFormHelp from '../../shared/components/GetFormHelp';
import {
  getAlreadySubmittedTitle,
  getAlreadySubmittedText,
  getAlertType,
  getSuccessAlertTitle,
  getSuccessAlertText,
  getInfoAlertTitle,
  getInfoAlertText,
  getNextStepsTextSecondParagraph,
  getNextStepsLinks,
} from '../config/helpers';
import { benefitPhrases, veteranBenefits } from '../definitions/constants';

export const ConfirmationPage = props => {
  useLayoutEffect(() => {
    focusElement('h2', null, 'va-alert');
    scrollToTop('topScrollElement');
  }, []);

  const { form } = props;
  const { submission, data } = form;

  const { veteranFullName } = data;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const expirationDate = new Date(
    submission.response?.expirationDate,
  ).toLocaleDateString('en-US', dateOptions);
  const alreadySubmittedIntents = {};
  if (submission.response?.compensationIntent) {
    alreadySubmittedIntents.compensation =
      submission.response.compensationIntent;
  }
  if (submission.response?.pensionIntent) {
    alreadySubmittedIntents.pension = submission.response.pensionIntent;
  }
  if (submission.response?.survivorIntent) {
    alreadySubmittedIntents.survivor = submission.response.survivorIntent;
  }

  const alreadySubmittedTitle = getAlreadySubmittedTitle(
    data,
    alreadySubmittedIntents,
  );
  const alreadySubmittedText = getAlreadySubmittedText(
    data,
    alreadySubmittedIntents,
    expirationDate,
  );
  const nextStepsTextSecondParagraph = getNextStepsTextSecondParagraph(
    data,
    alreadySubmittedIntents,
    expirationDate,
  );
  const nextStepsLinks = getNextStepsLinks(data);

  const alertType = getAlertType(data, alreadySubmittedIntents);
  const alertTitle =
    alertType === 'info'
      ? getInfoAlertTitle()
      : getSuccessAlertTitle(data, alreadySubmittedIntents);
  const alertText =
    alertType === 'info'
      ? getInfoAlertText(data, alreadySubmittedIntents)
      : getSuccessAlertText(data, alreadySubmittedIntents);

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      <va-alert
        close-btn-aria-label="Close notification"
        status={alertType}
        visible
      >
        <h2 slot="headline">{alertTitle}</h2>
        <p>{alertText}</p>
      </va-alert>
      <div className="inset">
        <h3 className="v.ads-u-margin-top--0">Your application information</h3>
        {veteranFullName && (
          <>
            <h4>Applicant</h4>
            <p>
              {veteranFullName.first} {veteranFullName.middle}{' '}
              {veteranFullName.last}
              {veteranFullName.suffix ? `, ${veteranFullName.suffix}` : null}
            </p>
          </>
        )}
        {confirmationNumber && (
          <>
            <h4>Confirmation number</h4>
            <p>{confirmationNumber}</p>
          </>
        )}
        {isValid(submitDate) && (
          <>
            <h4>Date submitted</h4>
            <p>{format(submitDate, 'MMMM d, yyyy')}</p>
          </>
        )}
        <h4>Confirmation for your records</h4>
        <p>You can print this confirmation page for your records</p>
        <button
          type="button"
          className="usa-button vads-u-margin-top--0 screen-only"
          onClick={window.print}
        >
          Print this page
        </button>
      </div>
      {alreadySubmittedTitle && alreadySubmittedText ? (
        <div>
          <h2>{alreadySubmittedTitle}</h2>
          <p>{alreadySubmittedText}</p>
        </div>
      ) : null}
      <div>
        <h2>What are my next steps?</h2>
        <p>You should complete and file your claim as soon as possible.</p>
        <p>{nextStepsTextSecondParagraph}</p>
        {nextStepsLinks.map(nextStep => {
          let href = '/';
          if (nextStep === veteranBenefits.COMPENSATION) {
            href =
              '/disability/file-disability-claim-form-21-526ez/introduction';
          } else if (nextStep === veteranBenefits.PENSION) {
            href = '/find-forms/about-form-21p-527ez/';
          } else if (nextStep === veteranBenefits.SURVIVOR) {
            href = '/find-forms/about-form-21p-534ez/';
          }

          return (
            <p key={nextStep}>
              <a
                className="vads-c-action-link--blue vads-u-margin-bottom--4"
                href={href}
              >
                Complete your {benefitPhrases[nextStep]}
              </a>
            </p>
          );
        })}
      </div>
      <a className="vads-c-action-link--green vads-u-margin-bottom--4" href="/">
        Go back to VA.gov
      </a>
      <div>
        <FormFooter formConfig={{ getHelp: GetFormHelp }} />
      </div>
    </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      veteranFullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
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
