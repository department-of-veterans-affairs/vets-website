import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { selectProfile } from 'platform/user/selectors';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
import { resetStoredSubTask } from 'platform/forms/sub-task';

import GetFormHelp from '../content/GetFormHelp';

import { DateSubmitted } from '../../shared/components/DateSubmitted';
import { IssuesSubmitted } from '../../shared/components/IssuesSubmitted';
import { getIssuesListItems } from '../../shared/utils/issues';

export const ConfirmationPage = () => {
  const alertRef = useRef(null);

  const form = useSelector(state => state.form || {});
  const name = useSelector(state => selectProfile(state)?.userFullName || {});

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        // delay focus for Safari
        waitForRenderThenFocus('h2', alertRef.current);
      }
    },
    [alertRef],
  );

  const { submission, data } = form;
  const issues = data ? getIssuesListItems(data) : [];
  const fullName = `${name.first} ${name.middle || ''} ${name.last}`;
  const submitDate = moment(submission?.timestamp);
  resetStoredSubTask();

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
        <h2>Application for Supplemental Claim</h2>
      </div>
      <va-alert status="success" ref={alertRef}>
        <h2 slot="headline">Thank you for filing a Supplemental Claim</h2>
        <p>
          When we’ve completed our review, we’ll mail you a decision packet with
          the details of our decision.
        </p>
      </va-alert>
      <div className="inset">
        <h3 className="vads-u-margin-top--0">
          Your information for this claim
        </h3>
        <h4>Your name</h4>
        {fullName ? (
          <div
            className="dd-privacy-hidden"
            data-dd-action-name="Veteran full name"
          >
            {name.first} {name.middle} {name.last}
            {name.suffix ? `, ${name.suffix}` : null}
          </div>
        ) : null}

        {submitDate.isValid() ? (
          <DateSubmitted submitDate={submitDate} />
        ) : null}
        <IssuesSubmitted issues={issues} />
      </div>
      <h3>What to expect next</h3>
      <p>
        If we need more information, we’ll contact you to tell you what other
        information you’ll need to submit. We’ll also tell you if we need to
        schedule an exam for you.
      </p>
      <p>
        When we’ve completed your review, we’ll mail you a decision packet with
        the details of our decision.{' '}
        <a href="/decision-reviews/after-you-request-review/">
          Learn more about what happens after you request a review
        </a>
        .
      </p>
      <p>
        If you requested a decision review and haven’t heard back from us yet,
        please don’t request another review. Call us instead.
      </p>
      <p>
        Note: You can choose to have a hearing at any point in the claims
        process. Contact us online through Ask VA to request a hearing.{' '}
        <a href="https://ask.va.gov/">Contact us through Ask VA</a>
      </p>
      <p>
        You can also call us at <va-telephone contact="8008271000" /> (
        <va-telephone contact="711" tty />
        ).
      </p>
      <a href="/track-claims/your-claims" className="usa-button">
        Track the status of your claim
      </a>
      <p />
      <h3 className="help-heading">Need help?</h3>
      <GetFormHelp />
    </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({}),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.instanceOf(Date),
    }),
  }),
  name: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }),
};

export default ConfirmationPage;
