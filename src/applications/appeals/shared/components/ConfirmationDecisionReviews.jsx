import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { selectProfile } from 'platform/user/selectors';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { waitForRenderThenFocus } from 'platform/utilities/ui';

import { DateSubmitted } from './DateSubmitted';
import { IssuesSubmitted } from './IssuesSubmitted';
import { getIssuesListItems } from '../utils/issues';
import { renderFullName } from '../utils/data';

export const ConfirmationDecisionReviews = ({
  pageTitle,
  alertTitle,
  children,
}) => {
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
  const submitDate = moment(submission?.timestamp);

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
        <h2>{pageTitle}</h2>
      </div>

      <va-alert status="success" ref={alertRef} uswds>
        <h2 slot="headline">{alertTitle}</h2>
        <p>
          When we’ve completed our review, we’ll mail you a decision packet with
          the details of our decision.
        </p>
      </va-alert>

      <va-summary-box uswds class="vads-u-margin-top--2">
        <h3 className="vads-u-margin-top--0">
          Your information for this claim
        </h3>

        <h4>Your name</h4>
        {renderFullName(name)}
        {submitDate.isValid() && <DateSubmitted submitDate={submitDate} />}
        <IssuesSubmitted issues={issues} />
      </va-summary-box>

      {children}
    </div>
  );
};

ConfirmationDecisionReviews.propTypes = {
  alertDescription: PropTypes.element,
  alertTitle: PropTypes.string,
  children: PropTypes.element,
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
  pageTitle: PropTypes.string,
};

export default ConfirmationDecisionReviews;
