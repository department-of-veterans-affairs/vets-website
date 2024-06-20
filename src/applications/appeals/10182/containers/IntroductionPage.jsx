import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

import {
  startText,
  unauthStartText,
  customText,
} from '../content/saveInProgress';
import { filingDeadlineContent } from '../content/FilingDeadlines';

import {
  FACILITY_LOCATOR_URL,
  GET_HELP_REVIEW_REQUEST_URL,
  NOD_OPTIONS_URL,
} from '../../shared/constants';
import ShowAlertOrSip from '../../shared/components/ShowAlertOrSip';

const IntroductionPage = props => {
  useEffect(() => {
    focusElement('h1');
    scrollToTop();
  }, []);

  const { route, location } = props;
  const { formConfig, pageList } = route;
  const { formId, prefillEnabled, savedFormMessages, downtime } = formConfig;
  const sipOptions = {
    // See https://dsva.slack.com/archives/C04KW0B46N5/p1716415144602809 as for
    // why this ariaDescribedby is here & commented out
    // ariaDescribedby: 'main-content',
    downtime,
    // formConfig needed to update messages within the SaveInProgressIntro to
    // use 'request', but we don't need to pass the entire formConfig
    formConfig: { customText },
    formId,
    headingLevel: 2,
    hideUnauthedStartLink: true,
    messages: savedFormMessages,
    pageList,
    pathname: '/introduction',
    prefillEnabled,
    startText,
    unauthStartText,
    useActionLinks: true,
  };

  return (
    <div className="schemaform-intro">
      <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />

      <ShowAlertOrSip basename={location.basename} sipOptions={sipOptions} />

      <h2 className="vads-u-margin-top--2">
        Follow these steps to request a Board Appeal
      </h2>
      <va-process-list uswds>
        <va-process-list-item header="Check to be sure you can request a Board Appeal">
          {filingDeadlineContent}
          <p>You can request a Board Appeal for these claim decisions:</p>
          <ul>
            <li>An initial claim</li>
            <li>A Supplemental Claim</li>
            <li>A Higher-Level Review</li>
          </ul>
          <p>
            <strong>Note: </strong>
            You can’t request a Board Appeal if you’ve already requested one for
            this same claim.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Gather your information">
          <p>Here’s what you’ll need to apply:</p>
          <ul>
            <li>Your mailing address</li>
            <li>
              The VA decision date for each issue you’d like us to review (this
              is the date on the decision notice you received physically in the
              mail)
            </li>
          </ul>
        </va-process-list-item>
        <va-process-list-item header="Start your request">
          <p>
            We’ll take you through each step of the process. It should take
            about 30 minutes.
          </p>
          <va-additional-info trigger="What happens after you apply" uswds>
            <p>
              After you submit your request for a Board Appeal, you’ll get a
              confirmation message. You can print this for your records.
            </p>
            <p>
              A Veterans Law Judge at the Board of Veterans’ Appeals will review
              your case. The amount of time it takes the Board to complete its
              review depends on which review option you choose.{' '}
              <a href={NOD_OPTIONS_URL}>
                Read about the 3 Board Appeal options
              </a>
            </p>
          </va-additional-info>
        </va-process-list-item>
      </va-process-list>

      <ShowAlertOrSip
        basename={location.basename}
        sipOptions={sipOptions}
        bottom
      />

      <h2 className="vads-u-margin-top--2">
        What if I need help filling out my application?
      </h2>
      <p>
        If you need help requesting a Board Appeal, you can contact a VA
        regional office near you.
      </p>
      <a href={FACILITY_LOCATOR_URL}>Find a VA regional office near you</a>
      <p className="vads-u-margin-top--2">
        A Veteran Service Organization or VA-accredited representative or agent
        can also help you request a Board Appeal.
      </p>
      <a href={GET_HELP_REVIEW_REQUEST_URL}>
        Get help requesting a Board Appeal
      </a>
      <div className="omb-info--container vads-u-padding-left--0 vads-u-margin-top--4">
        <va-omb-info
          res-burden={30}
          omb-number="2900-0674"
          exp-date="2/28/2022"
        />
      </div>
    </div>
  );
};

IntroductionPage.propTypes = {
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      formId: PropTypes.string,
      title: PropTypes.string,
      subTitle: PropTypes.string,
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
      downtime: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
