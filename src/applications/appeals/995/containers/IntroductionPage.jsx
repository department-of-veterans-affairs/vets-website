import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';

import NeedsToVerify from '../components/NeedsToVerify';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { isVerified, loggedIn, route, location } = this.props;
    const { formConfig, pageList } = route;
    const { formId, prefillEnabled, savedFormMessages } = formConfig;

    // Without being LOA3 (verified), the prefill & contestable issues won't load
    const showVerifyLink = loggedIn && !isVerified;
    const pathname = location.basename;

    const sipOptions = {
      formId,
      pageList,
      prefillEnabled,
      headingLevel: 2,
      hideUnauthedStartLink: true,
      messages: savedFormMessages,
      startText: 'Start your Claim',
      gaStartEventName: 'decision-reviews-va20-0996-start-form',
      testActionLink: true,
      useActionLinks: true,
    };

    return (
      <div className="schemaform-intro">
        <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />
        <p className="va-introtext">
          When you file a Supplemental Claim, you’re adding new evidence that’s
          relevant to your case or identifying new evidence you want us to
          gather for you. A reviewer will determine whether the new evidence
          changes the decision.
        </p>
        {loggedIn && showVerifyLink && <NeedsToVerify pathname={pathname} />}
        {loggedIn && !showVerifyLink && <SaveInProgressIntro {...sipOptions} />}
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow these steps to get started
        </h2>
        <p className="vads-u-margin-top--2">
          <a href="/resources/choosing-a-decision-review-option">
            Learn about choosing a decision review
          </a>
        </p>
        <va-process-list>
          <li>
            <h3>Check your eligibility</h3>
            <p>
              Make sure you meet our eligibility requirements for Supplemental
              Claims before you file.
            </p>
            <va-additional-info trigger="What are the eligibility requirements to file a Supplemental Claim?">
              <p>
                You can file a Supplemental Claim if you have new and relevant
                evidence that we didn't have when we reviewed your case before.
                You can file your claim anytime, but we recommend you file
                within 1 year from the date on your decision letter.
              </p>
              <p className="vads-u-padding-y--2">
                Note: You can’t file a Supplemental Claim if you have a
                fiduciary claim or a contested claim.
              </p>
              <p>
                <a href="/decision-reviews/fiduciary-claims">
                  Learn more about fiduciary claims
                </a>
              </p>
              <p className="vads-u-padding-top--2">
                <a href="/decision-reviews/contested-claims">
                  Learn more about contested claims
                </a>
              </p>
            </va-additional-info>
          </li>
          <li>
            <h3>Gather your information</h3>
            Here’s what you’ll need to apply:
            <ul>
              <li>
                New and relevant evidence. You can either submit new evidence
                (supporting documents) or identify new evidence you want us to
                gather for you.
              </li>
              <li>
                The decision date of any issue you want us to review. You can
                ask us to review more than 1 issue.
              </li>
              <li>
                The name and address of any medical facility you'd like us to
                request your records from.
              </li>
              <li>
                The dates you were treated at that private medical facility.
              </li>
            </ul>
            <va-additional-info trigger="Types of Evidence">
              <ul>
                <li>
                  Medical records from a VA medical center, another federal
                  health facility, or your private health care provider that
                  relate to your claimed condition or how it has gotten worse
                </li>
                <li>
                  Supporting statements from family, friends, coworkers, clergy,
                  or law enforcement personnel who know how and when your
                  illness or injury happened or how it has gotten worse
                </li>
              </ul>
            </va-additional-info>
          </li>
          <li className="vads-u-padding-bottom--0">
            <h3>Start your Supplemental Claim</h3>
            <p>
              We’ll take you through each step of the process. It should take
              about 15 minutes.
            </p>
            <va-additional-info trigger="What happens after I apply?">
              You don’t need to do anything while you’re waiting unless we
              contact you to ask for more information. If we schedule exams for
              you, be sure not to miss them.
            </va-additional-info>
          </li>
        </va-process-list>
        {!showVerifyLink && (
          <div className="sip-wrapper vads-u-margin-bottom--4">
            <SaveInProgressIntro {...sipOptions} buttonOnly={loggedIn} />
          </div>
        )}
        <va-omb-info
          res-burden="15"
          omb-number="2900-0862"
          exp-date="4/30/2024"
        />
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
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
      subTitle: PropTypes.string,
      title: PropTypes.string,
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
