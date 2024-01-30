import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';

import {
  startText,
  unauthStartText,
  customText,
} from '../content/saveInProgress';
import { filingDeadlineContent } from '../content/FilingDeadlines';

import NeedsToVerify from '../../shared/components/NeedsToVerify';
import {
  FACILITY_LOCATOR_URL,
  GET_HELP_REVIEW_REQUEST_URL,
  NOD_OPTIONS_URL,
} from '../../shared/constants';

export class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('h1');
    scrollToTop();
  }

  render() {
    const { route, loggedIn, isVerified, location } = this.props;
    const { formConfig, pageList } = route;
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
      ariaDescribedby: 'main-content',
    };

    // Without being LOA3 (verified), the prefill & contestable issues won't load
    const showVerifyLink = loggedIn && !isVerified;
    const pathname = location.basename;

    return (
      <div className="schemaform-intro">
        <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />
        {showVerifyLink ? (
          <NeedsToVerify pathname={pathname} />
        ) : (
          <SaveInProgressIntro {...sipOptions} />
        )}
        <h2>Follow these steps to request a Board Appeal</h2>
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
              You can’t request a Board Appeal if you’ve already requested one
              for this same claim.
            </p>
          </va-process-list-item>
          <va-process-list-item header="Gather your information">
            <p>Here’s what you’ll need to apply:</p>
            <ul>
              <li>Your mailing address</li>
              <li>
                The VA decision date for each issue you’d like us to review
                (this is the date on the decision notice you received physically
                in the mail)
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
                A Veterans Law Judge at the Board of Veterans’ Appeals will
                review your case. The amount of time it takes the Board to
                complete its review depends on which review option you choose.{' '}
                <a href={NOD_OPTIONS_URL}>
                  Read about the 3 Board Appeal options
                </a>
              </p>
            </va-additional-info>
          </va-process-list-item>
        </va-process-list>
        {showVerifyLink ? (
          <NeedsToVerify pathname={pathname} />
        ) : (
          <SaveInProgressIntro buttonOnly {...sipOptions} />
        )}
        <h2>What if I need help filling out my application?</h2>
        <p>
          If you need help requesting a Board Appeal, you can contact a VA
          regional office near you.
        </p>
        <a href={FACILITY_LOCATOR_URL}>Find a VA regional office near you</a>
        <p className="vads-u-margin-top--2">
          A Veteran Service Organization or VA-accredited representative or
          agent can also help you request a Board Appeal.
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
  }
}

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
