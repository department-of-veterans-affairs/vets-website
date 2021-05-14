import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import {
  CONTESTED_CLAIMS_URL,
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
          Follow the steps below to request a Board Appeal.
        </h2>
        <strong>
          If you're requesting a Board Appeal on an issue in a claim we decided
          before February 19, 2019
        </strong>
        <p className="vads-u-margin-bottom--0">
          You'll need to opt in to the new decision review process by checking a
          box when you fill out the application. This moves your issue from the
          old appeals process to the new decision review process. As part of the
          Appeals Modernization Act, our new process means you'll likely get a
          faster decision.
        </p>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h3 className="vads-u-font-size--h4">
                Check to be sure you can request a Board Appeal
              </h3>
              <p>
                You can request a Board Appeal up to 1 year from the date on
                your decision notice. You'll have 60 days if you have a{' '}
                <a href={CONTESTED_CLAIMS_URL}>contested claim</a> (these are
                rare).
              </p>
              <p>You can request a Board Appeal for these claim decision.</p>
              <ul>
                <li>An initial claim decision</li>
                <li>A supplemental claim decision</li>
                <li>A Higher-Level Review claim decision</li>
              </ul>
              <p>
                <strong>Note: </strong>
                You can't request a Board Appeal if you've already requested one
                for this same claim.
              </p>
            </li>
            <li className="process-step list-two">
              <h3 className="vads-u-font-size--h4">Prepare</h3>
              <p>Here's what you’ll need to apply:</p>
              <ul>
                <li>Mailing address</li>
                <li>
                  List of issues you disagree with and the VA decision date for
                  each
                </li>
                <li>Representative’s contact information (optional)</li>
              </ul>
              <h4 className="vads-u-font-size--h5">
                What if I need help filling out my application?
              </h4>
              <p>
                If you need help requesting a Board Appeal, you can contact a VA
                regional office near you.
              </p>
              <a href={FACILITY_LOCATOR_URL}>
                Find a VA regional office near you
              </a>
              <p className="vads-u-margin-top--2">
                A Veteran Service Organization or VA-accredited representative
                or agent can also help you request a Board Appeal.
              </p>
              <a href={GET_HELP_REQUEST_URL}>
                Get help requesting a Board Appeal
              </a>
            </li>
            <li className="process-step list-three">
              <h3 className="vads-u-font-size--h4">Apply</h3>
              <p>
                Complete this Board Appeal application form. After you submit
                the application, you’ll get a confirmation message. You can
                print this for your records.
              </p>
            </li>
          </ol>
          <h3>Our review and decision process</h3>
          <p>
            A Veterans Law Judge at the Board of Veteran's Appeals will review
            your case. Depending on which{' '}
            <a href={BOARD_APPEAL_OPTIONS_URL}>review option</a> you choose, it
            will take the Board a year or longer to make a decision on your
            case.
          </p>
          <p>
            After the Board has made a decision on your case, you'll get a
            decision notice in the mail.
          </p>
        </div>
        <SaveInProgressIntro buttonOnly {...sipOptions} />
        <div className="omb-info--container vads-u-padding-left--0">
          <OMBInfo resBurden={30} ombNumber="290-0674" expDate="2/28/2022" />
        </div>
      </div>
    );
  }
}

export default IntroductionPage;
