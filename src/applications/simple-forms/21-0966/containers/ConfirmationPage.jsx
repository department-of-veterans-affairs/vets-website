import React from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import FormFooter from 'platform/forms/components/FormFooter';

import GetFormHelp from '../../shared/components/GetFormHelp';
import {
  preparerIsSurvivingDependant,
  preparerIsThirdPartyToASurvivingDependant,
} from '../config/helpers';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }

  render() {
    const { form } = this.props;
    const { submission, data } = form;

    const { fullName } = data;
    const submitDate = submission.timestamp;
    const confirmationNumber = submission.response?.confirmationNumber;

    let title = 'You’ve submitted your intent to file request';
    let claimType;
    let expirationDate;
    let expirationDateText;
    const alreadySubmittedIntents = {
      compensation: !!submission.response?.compensationIntent?.status,
      pension: !!submission.response?.pensionIntent?.status,
    };
    let alreadySubmittedIntentText;
    let alreadySubmittedTitle;
    let alreadySubmittedText;
    switch (data.benefitSelection) {
      case 'Compensation':
        claimType = 'disability compensation claim';
        expirationDate = new Date(
          new Date().setFullYear(new Date().getFullYear() + 1),
        ).toDateString();
        expirationDateText = `Your intent to file for ${claimType} will expire on ${expirationDate}.`;
        if (alreadySubmittedIntents.compensation) {
          alreadySubmittedIntentText = `Our records show that you already have an intent to file for a disability compensation claim and it will expire on ${expirationDate}.`;
        }
        break;
      case 'Pension':
        if (
          preparerIsSurvivingDependant({ formData: data }) ||
          preparerIsThirdPartyToASurvivingDependant({ formData: data })
        ) {
          claimType = 'pension claim for survivors';
        } else {
          claimType = 'pension claim';
        }
        expirationDate = new Date(
          new Date().setFullYear(new Date().getFullYear() + 1),
        ).toDateString();
        expirationDateText = `Your intent to file for ${claimType} will expire on ${expirationDate}.`;
        if (alreadySubmittedIntents.pension) {
          alreadySubmittedIntentText = `Our records show that you already have an intent to file for a ${claimType} and it will expire on ${expirationDate}.`;
        }
        break;
      case 'Compensation,Pension':
        claimType = 'disability compensation and pension claims';
        expirationDate = new Date(
          new Date().setFullYear(new Date().getFullYear() + 1),
        ).toDateString();
        expirationDateText = `Your intent to file for ${claimType} will expire on ${expirationDate}.`;
        if (submission.response?.compensationIntent?.status === 'active') {
          title = `You’ve submitted your intent to file request for a pension claim`;
          alreadySubmittedTitle =
            'You’ve already submitted an intent to file for a disability compensation claim';
          alreadySubmittedText = `Our records show that you already have an Intent to File (ITF) for disability compensation. Your intent to file for disability compensation expires on ${expirationDate}. You’ll need to submit your claim by this date in order to receive payments starting from your effective date.`;
          expirationDateText = `Your intent to file will expire on ${expirationDate}.`;
        } else if (submission.response?.pensionIntent?.status === 'active') {
          title = `You’ve submitted your intent to file request for a disability compensation claim`;
          alreadySubmittedTitle =
            'You’ve already submitted an intent to file for a pension claim';
          alreadySubmittedText = `Our records show that you already have an Intent to File (ITF) for pension. Your intent to file for disability compensation expires on ${expirationDate}. You’ll need to submit your claim by this date in order to receive payments starting from your effective date.`;
          expirationDateText = `Your intent to file will expire on ${expirationDate}.`;
        }

        if (
          alreadySubmittedIntents.compensation &&
          alreadySubmittedIntents.pension
        ) {
          alreadySubmittedIntentText =
            'Our records show that you already have an intent to file for disability compensation and for pension claims.';
        }
        break;
      default:
        claimType = 'boop';
        expirationDate = 'beep';
    }

    return (
      <div>
        <div className="print-only">
          <img
            src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
            alt="VA logo"
            width="300"
          />
        </div>
        {alreadySubmittedIntentText ? (
          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            visible
          >
            <h2 slot="headline">You've already submitted an intent to file</h2>
            <p>{alreadySubmittedIntentText}</p>
          </va-alert>
        ) : (
          <va-alert
            close-btn-aria-label="Close notification"
            status="success"
            visible
          >
            <h2 slot="headline">{title}</h2>
            <p>{expirationDateText}</p>
          </va-alert>
        )}
        <div className="inset">
          <h3 className="vads-u-margin-top--0">Your application information</h3>
          {fullName ? (
            <>
              <h4>Applicant</h4>
              <p>
                {fullName.first} {fullName.middle} {fullName.last}
                {fullName.suffix ? `, ${fullName.suffix}` : null}
              </p>
            </>
          ) : null}

          {confirmationNumber ? (
            <>
              <h4>Confirmation number</h4>
              <p>{confirmationNumber}</p>
            </>
          ) : null}

          {isValid(submitDate) ? (
            <>
              <h4>Date submitted</h4>
              <p>{format(submitDate, 'MMMM d, yyyy')}</p>
            </>
          ) : null}

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
          <p>
            Your intent to file for {claimType} expires on {expirationDate}.
            You’ll need to file your claim by this date to get retroactive
            payments (payments for the time between when you submit your intent
            to file and when we approve your claim).
          </p>
          {data.benefitSelection === 'Compensation,Pension' ? (
            <ul style={{ listStyleType: 'none' }}>
              <li>
                <a
                  className="vads-c-action-link--green vads-u-margin-bottom--4"
                  href="/"
                >
                  Complete your disability compensation claim
                </a>
              </li>
              <li>
                <a
                  className="vads-c-action-link--green vads-u-margin-bottom--4"
                  href="/"
                >
                  Complete your pension claim
                </a>
              </li>
            </ul>
          ) : (
            <a
              className="vads-c-action-link--green vads-u-margin-bottom--4"
              href="/"
            >
              Complete your {claimType}
            </a>
          )}
        </div>
        <a
          className="vads-c-action-link--green vads-u-margin-bottom--4"
          href="/"
        >
          Go back to VA.gov
        </a>
        <div>
          <FormFooter formConfig={{ getHelp: GetFormHelp }} />
        </div>
      </div>
    );
  }
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
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
