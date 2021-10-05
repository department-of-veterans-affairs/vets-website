import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import {
  FACILITY_LOCATOR_URL,
  GET_HELP_REQUEST_URL,
  BOARD_APPEAL_OPTIONS_URL,
} from '../constants';

import {
  startText,
  unauthStartText,
  customText,
} from '../content/saveInProgress';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { formConfig, pageList } = this.props.route;
    const { formId, prefillEnabled, savedFormMessages, downtime } = formConfig;
    const sipOptions = {
      useActionLinks: true,
      hideUnauthedStartLink: true,
      headingLevel: 2,
      formId,
      prefillEnabled,
      pageList,
      messages: savedFormMessages,
      startText,
      unauthStartText,
      downtime,
      formConfig: {
        // needed to update messages within the SaveInProgressIntro, but we
        // don't need to pass the entire formConfig
        customText,
      },
    };

    return (
      <div className="schemaform-intro">
        <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />
        <SaveInProgressIntro {...sipOptions} />
        <h2 className="vads-u-font-size--h3">
          Follow these steps to request a Board Appeal
        </h2>
        <AdditionalInfo triggerText="Find out about opting in if you have an older claim">
          <p>
            If you’re requesting a Board Appeal on an issue in a claim we
            decided before February 19, 2019, you’ll need to opt in to the new
            decision review process. To do this, you’ll check a box at a certain
            place in the form. This will move your issue from the old appeals
            process to the new decision review process.
          </p>
          <p className="vads-u-margin-bottom--0">
            Our new decision review process is part of the Appeals Modernization
            Act. When you opt in, you’re likely to get a faster decision.
          </p>
        </AdditionalInfo>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h3 className="vads-u-font-size--h4">
                Check to be sure you can request a Board Appeal
              </h3>
              <p>
                You can request a Board Appeal up to 1 year from the date on
                your decision notice. (Exception: if you have a contested claim,
                you have only 60 days from the date on your decision notice to
                request a Board Appeal.)
              </p>
              <p>You can request a Board Appeal for these claim decisions:</p>
              <ul>
                <li>An initial claim</li>
                <li>A Supplemental Claim</li>
                <li>A Higher-Level Review</li>
              </ul>
              <p>
                <strong>Note: </strong>
                You can’t request a Board Appeal if you’ve already requested one
                for this same claim.
              </p>
            </li>
            <li className="process-step list-two">
              <h3 className="vads-u-font-size--h4">Gather your information</h3>
              <p>Here’s what you’ll need to apply:</p>
              <ul>
                <li>Your mailing address</li>
                <li>
                  The VA decision date for each issue you’d like us to review
                  (this is the date on the decision notice you got in the mail)
                </li>
              </ul>
            </li>
            <li className="process-step list-three">
              <h3 className="vads-u-font-size--h4">Start your request</h3>
              <p>
                We’ll take you through each step of the process. It should take
                about 30 minutes.
              </p>
              <AdditionalInfo triggerText="What happens after you apply">
                <p>
                  After you submit your request for a Board Appeal, you’ll get a
                  confirmation message. You can print this for your records.
                </p>
                <p>
                  A Veterans Law Judge at the Board of Veterans’ Appeals will
                  review your case. The amount of time it takes the Board to
                  complete its review depends on which review option you choose.{' '}
                  <a href={BOARD_APPEAL_OPTIONS_URL}>
                    Read about the 3 Board Appeal options
                  </a>
                </p>
              </AdditionalInfo>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro buttonOnly {...sipOptions} />
        <h2 className="vads-u-font-size--h3">
          What if I need help filling out my application?
        </h2>
        <p>
          If you need help requesting a Board Appeal, you can contact a VA
          regional office near you.
        </p>
        <a href={FACILITY_LOCATOR_URL}>Find a VA regional office near you</a>
        <p className="vads-u-margin-top--2">
          A Veteran Service Organization or VA-accredited representative or
          agent can also help you request a Board Appeal.
        </p>
        <a href={GET_HELP_REQUEST_URL}>Get help requesting a Board Appeal</a>
        <div className="omb-info--container vads-u-padding-left--0 vads-u-margin-top--4">
          <OMBInfo resBurden={30} ombNumber="2900-0674" expDate="2/28/2022" />
        </div>
      </div>
    );
  }
}

export default IntroductionPage;
