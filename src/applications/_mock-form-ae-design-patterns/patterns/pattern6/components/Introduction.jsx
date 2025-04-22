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

import ShowAlertOrSip from './ShowAlertOrSip';

const Introduction = props => {
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
      <FormTitle
        title="Marital Status Pattern Mock Form"
        subTitle="Pattern 6 - Marital Status"
      />

      <ShowAlertOrSip basename={location.basename} sipOptions={sipOptions} />

      <h2 className="vads-u-margin-top--2">
        Follow these steps to complete your marital status form
      </h2>
      <va-process-list uswds>
        <va-process-list-item header="Check if you need to fill out this form">
          <p>
            You may need to provide information about your marital status if
            you’re applying for VA benefits that take your family situation into
            account, such as:
          </p>
          <ul>
            <li>Health care eligibility</li>
            <li>Survivor benefits</li>
            <li>Education or housing benefits</li>
          </ul>
          <p>
            <strong>Note: </strong>
            You won’t need to complete this form if your marital status is
            already up to date in your VA profile.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Gather your information">
          <p>Here’s what you may need to fill out this form:</p>
          <ul>
            <li>
              Your current marital status (single, married, divorced, widowed)
            </li>
            <li>Dates of any current or previous marriages</li>
            <li>
              Spouse or former spouse names and, if applicable, their marital
              history
            </li>
            <li>
              Marriage certificates or divorce decrees (if required for
              verification)
            </li>
          </ul>
        </va-process-list-item>
        <va-process-list-item header="Start your application">
          <p>
            We’ll guide you through each section of the form. It should take
            about 30 minutes.
          </p>
          <va-additional-info
            trigger="What happens after you submit the form"
            uswds
          >
            <p>
              After you submit your marital status form, we’ll review your
              information and update your VA profile as needed.
            </p>
            <p>
              If we need more details or documents to verify your marital
              history, we’ll contact you with next steps.
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
        If you need help with the Marital Status form, you can contact a VA
        regional office near you.
      </p>
      <p className="vads-u-margin-top--2">
        A Veteran Service Organization or VA-accredited representative or agent
        can also help you.
      </p>
      <div className="omb-info--container vads-u-padding-left--0 vads-u-margin-top--4">
        <va-omb-info
          res-burden={30}
          omb-number="2900-0674"
          exp-date="2/28/2028"
        />
      </div>
    </div>
  );
};

Introduction.propTypes = {
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

export default Introduction;
