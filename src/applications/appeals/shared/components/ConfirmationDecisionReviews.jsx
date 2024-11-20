import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import scrollTo from '@department-of-veterans-affairs/platform-utilities/scrollTo';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';

import { selectProfile } from '~/platform/user/selectors';

import { DateSubmitted } from './DateSubmitted';
import { IssuesSubmitted } from './IssuesSubmitted';
import { getIssuesListItems } from '../utils/issues';
import { renderFullName } from '../utils/data';
import { parseDate } from '../utils/dates';
import { FORMAT_READABLE_DATE_FNS } from '../constants';

export const ConfirmationDecisionReviews = ({
  pageTitle,
  alertTitle,
  alertContent,
  appType = 'claim',
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
        waitForRenderThenFocus('#main h2', alertRef.current);
      }
    },
    [alertRef],
  );

  const { submission, data } = form;
  const issues = data ? getIssuesListItems(data) : [];
  const submitDate = parseDate(
    submission?.timestamp || new Date(),
    FORMAT_READABLE_DATE_FNS,
  );

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
        <h2 className="vads-u-margin-top--0">{pageTitle}</h2>
      </div>

      <va-alert status="success" ref={alertRef} uswds>
        <h2 slot="headline">{alertTitle}</h2>
        <p>{alertContent}</p>
      </va-alert>

      <va-summary-box uswds class="vads-u-margin-top--2">
        <h3 slot="headline" className="vads-u-margin-top--0">
          Your information for this {appType}
        </h3>

        <h4>Your name</h4>
        {renderFullName(name)}
        {submitDate && (
          <DateSubmitted appType={appType} submitDate={submitDate} />
        )}
        <IssuesSubmitted issues={issues} />
      </va-summary-box>

      {children}
    </div>
  );
};

ConfirmationDecisionReviews.propTypes = {
  alertContent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  alertDescription: PropTypes.element,
  alertTitle: PropTypes.string,
  appType: PropTypes.string,
  children: PropTypes.array,
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
