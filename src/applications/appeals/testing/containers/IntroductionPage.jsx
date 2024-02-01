import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import scrollTo from 'platform/utilities/ui/scrollToTop';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';

import {
  FACILITY_LOCATOR_URL,
  GET_HELP_REVIEW_REQUEST_URL,
  SC_BASE_URL,
  HLR_BASE_URL,
  NOD_OPTIONS_URL,
} from '../../shared/constants';
import GetFormHelp from '../content/GetFormHelp';

const IntroductionPage = ({ route }) => {
  useEffect(() => {
    focusElement('h1');
    scrollTo('h1');
  });

  const { formConfig } = route; // pageList
  // const { formId, prefillEnabled, savedFormMessages, downtime } = formConfig;

  return (
    <div className="schemaform-intro vads-u-margin-left--1">
      <VaBreadcrumbs
        label="Breadcrumbs"
        class="vads-u-margin-left--neg1"
        breadcrumbList={[
          {
            href: '/decision-reviews',
            label: 'Decision review and appeals',
          },
          {
            href: '/decision-reviews/board-appeal',
            label: 'Board Appeals',
          },
          {
            href: '/decision-reviews/appeals-testing',
            label: 'Request a Board Appeal',
          },
        ]}
        uswds
      />

      <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />
      <p>
        Use this form if you wish to appeal 1 or more issues to the Veterans Law
        Judge at the Board of Veteran Appeals.{' '}
        <a href="/decision-reviews">Learn more about this process.</a>
      </p>
      <p>
        If you want to have additional evidence reviewed by a VA rater, submit a{' '}
        <a href={SC_BASE_URL}>Supplemental Claim</a>.
      </p>
      <p>
        If you want to have your claim reviewed by a VA senior reviewer, submit
        a <a href={HLR_BASE_URL}>Higher Level Review</a>.
      </p>
      <p>
        <strong>Note:</strong> You can only apply to one decision review at a
        time for each issue.
      </p>

      <p className="vads-u-margin-top--4">
        <a
          className="vads-c-action-link--green"
          href="/decision-reviews/appeals-testing/task-list"
        >
          Start the Board Appeal request
        </a>
      </p>

      <va-featured-content uswds>
        <h2 slot="headline">Can I request a Board Appeal?</h2>
        <p>
          You can submit this online form (VA Form 10182) to appeal a VA
          decision dated on or after February 19, 2019. The Board must receive
          your completed form <strong>within 1 year (365 days)</strong> from the
          date listed on your decision notice, unless one of these situations
          apply:
        </p>
        <ul>
          <li>
            <strong>If you have a contested claim</strong>
            <p>
              A contested claim is when 2 or more people are claiming the right
              to a benefit that only 1 person can claim. If our decision
              involves a contested claim, the Board must receive your completed
              form within 60 days from the date listed on your decision notice.
            </p>
          </li>
          <li>
            <strong>If you have a claim from the old appeals system</strong>
            <p>
              If you have a <strong>Statement of the Case (SOC)</strong> or a{' '}
              <strong>Supplemental Statement of the Case (SSOC)</strong> from
              the old appeals system{' '}
              <strong>dated on or after February 19, 2019</strong>, the Board
              must receive your completed form in one of these timeframes,
              whichever is later:
            </p>
            <ul>
              <li>
                <strong>Within 60 days</strong> from the date of the SOC or SSOC
                letter, <strong>or</strong>
              </li>
              <li>
                <strong>Within 1 year</strong> of the decision date by the
                agency of original jurisdiction
              </li>
            </ul>
            <p>
              Please understand that by listing any issues currently pending in
              the old system, you are specifically opting those issues into the
              new decision review process if you continue with this submission.
              We won’t continue to process your appeal in the old system.
            </p>
          </li>
        </ul>
      </va-featured-content>

      <h2 className="vads-u-margin-top--2">
        Steps to requesting a Board Appeal
      </h2>
      <va-process-list uswds>
        <va-process-list-item header="Verify information">
          <p>
            The form will auto-populate the information we have on your account.
            Double-check these are correct.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Specify issues">
          <p>
            The form will auto-populate the issues that we have on your account.
            You can select from this list, or add an issue if you have the
            decision date. Specify the area of disagreement for each of the
            issues you want us to review. You can also add additional
            information about your disagreement.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Select review option">
          <p>Select a Board review option:</p>
          <ul>
            <li>Request a direct review (quickest option)</li>
            <li>Submit new evidence (takes more time)</li>
            <li>Request a hearing (takes the longest time)</li>
          </ul>
          <p>
            <a href="/decision-reviews/board-appeal/">
              Learn more about each review option
            </a>
            .
          </p>
        </va-process-list-item>
        <va-process-list-item header="Apply">
          <p>
            Review the information you’ve entered, and submit the form online.
          </p>
          <va-additional-info trigger="What happens after I apply?" uswds>
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

      <div>
        <a
          className="vads-c-action-link--green"
          href="/decision-reviews/appeals-testing/task-list"
        >
          Start the Board Appeal request
        </a>
      </div>

      <h2>What if I need help filling out my application?</h2>
      <p>
        If you need help requesting a Board Appeal, you can contact a VA
        regional office near you.
      </p>
      <p>
        <a href={FACILITY_LOCATOR_URL}>Find a VA regional office near you</a>
      </p>
      <p>
        A Veteran Service Organization or VA-accredited representative or agent
        can also help you request a Board Appeal.
      </p>
      <p>
        <a href={GET_HELP_REVIEW_REQUEST_URL}>
          Get help requesting a Board Appeal
        </a>
      </p>
      <div className="omb-info--container vads-u-padding-left--0 vads-u-margin-top--4">
        <va-omb-info
          res-burden={30}
          omb-number="2900-0674"
          exp-date="3/31/2025"
          uswds
        />
        <p />
        <GetFormHelp />
      </div>
    </div>
  );
};

IntroductionPage.propTypes = {
  isVerified: PropTypes.bool,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
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

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
    isVerified: selectProfile(state)?.verified || false,
  };
}

export default connect(mapStateToProps)(IntroductionPage);
