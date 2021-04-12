import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import {
  CONTESTED_CLAIMS_URL,
  DECISION_REVIEWS_URL,
  FACILITY_LOCATOR_URL,
  GET_HELP_REQUEST_URL,
} from '../constants';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { formConfig, pageList } = this.props.route;
    const { formId, prefillEnabled, savedFormMessages } = formConfig;
    const sipOptions = {
      useActionLinks: true,
      hideUnauthedStartLink: true,
      formId,
      prefillEnabled,
      pageList,
      messages: savedFormMessages,
      startText: 'Start the Board Appeal request',
    };

    return (
      <div className="schemaform-intro">
        <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />
        <SaveInProgressIntro {...sipOptions} />
        <h2 className="vads-u-font-size--h3">
          Follow the steps below to request a Board Appeal.
        </h2>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h3 className="vads-u-font-size--h4">
                Determine your eligibility
              </h3>
              <p>A board appeal can be requested on:</p>
              <ul>
                <li>An initial claim decision</li>
                <li>A supplemental claim decision</li>
                <li>A Higher-Level Review claim decision</li>
              </ul>
              <p>
                A board appeal <strong>cannot</strong> be requested on a
                previous Board Appeal on the <strong>same</strong> claim.
              </p>
              <p>
                You have one year from the date on your decision letter to
                request a Board Appeal, unless you have a{' '}
                <a href={CONTESTED_CLAIMS_URL}>contested claim</a> (these are
                rare).
              </p>
              <h4>You’ll have to opt-in to the new decision review process</h4>
              <p className="vads-u-margin-bottom--0">
                If you received a VA decision before Febrauary 19, 2019, and you
                want to appeal your decision under the new decision review
                process, you’ll need to opt-in. When you fill out the request
                form, you’ll need to check an opt-in box. This withdraws your
                claim from the legacy appeal process (the process for decisions
                received before Febrauary 19, 2019). Your claim will move
                forward under the new process.
              </p>
            </li>
            <li className="process-step list-two">
              <h3 className="vads-u-font-size--h4">Prepare</h3>
              <p>To fill out this application, you’ll need your:</p>
              <ul>
                <li>Primary address</li>
                <li>
                  List of issues you disagree with and the VA decision date for
                  each
                </li>
                <li>Representative’s contact information (optional)</li>
              </ul>
              <h4>What if I need help filling out my application?</h4>
              <p>
                If you need help requesting a Board Appeal, you can contact a VA
                regional office and ask to speak to a representative. To find
                the nearest regional office, please call{' '}
                <Telephone contact={CONTACTS.VA_BENEFITS} /> {'or '}
                <a href={FACILITY_LOCATOR_URL}>
                  visit our facility locator tool
                </a>
                .
              </p>
              <p>
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
                Complete this Board Appeal application form. After submitting
                the form, you’ll get a confirmation message. You can print this
                for your records.
              </p>
            </li>
            <li className="process-step list-four">
              <h3 className="vads-u-font-size--h4">Board Review</h3>
              <p className="vads-u-margin-bottom--0">
                A Veterans Law Judge at The Board of Veteran appeals will review
                your case. Depending on which{' '}
                <a href={DECISION_REVIEWS_URL}>review option</a> you choose, it
                will take the Board a year or longer to make a decision on your
                case.
              </p>
            </li>
            <li className="process-step list-five">
              <h3 className="vads-u-font-size--h4">Decision</h3>
              <p>
                Once the Board has processed your claim, you’ll get a notice in
                the mail with their decision.
              </p>
            </li>
          </ol>
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
