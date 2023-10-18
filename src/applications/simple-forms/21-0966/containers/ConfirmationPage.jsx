import React from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import FormFooter from 'platform/forms/components/FormFooter';

import GetFormHelp from '../../shared/components/GetFormHelp';
import {
  getClaimType,
  getAlreadySubmittedIntentText,
  getAlreadySubmittedTitle,
  getAlreadySubmittedText,
} from '../config/helpers';
import { veteranBenefits } from '../definitions/constants';

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

    const title = 'You’ve submitted your intent to file request';
    const claimType = getClaimType(data);
    const expirationDate = new Date(
      submission.response?.expirationDate,
    ).toDateString();
    const expirationDateText = `Your intent to file for ${claimType} will expire on ${expirationDate}.`;
    const alreadySubmittedIntents = {
      compensation: !!submission.response?.compensationIntent?.status,
      pension: !!submission.response?.pensionIntent?.status,
      survivors: !!submission.response?.survivorsIntent?.status,
    };
    const alreadySubmittedIntentText = getAlreadySubmittedIntentText(
      data,
      alreadySubmittedIntents,
      expirationDate,
    );
    const alreadySubmittedTitle = getAlreadySubmittedTitle(
      data,
      alreadySubmittedIntents,
    );
    const alreadySubmittedText = getAlreadySubmittedText(
      data,
      alreadySubmittedIntents,
      expirationDate,
    );
    const benefitSelection = Object.keys(data.benefitSelection).filter(
      key => data.benefitSelection[key],
    );

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
          {benefitSelection.includes(veteranBenefits.compensation) &&
          benefitSelection.includes(veteranBenefits.pension) ? (
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
