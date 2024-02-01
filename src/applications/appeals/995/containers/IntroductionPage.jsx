import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import environment from 'platform/utilities/environment';

import NeedsToVerify from '../../shared/components/NeedsToVerify';
import MissingInfo from '../components/MissingInfo';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('h1');
    scrollToTop();
  }

  render() {
    const {
      isVerified,
      loggedIn,
      route,
      location,
      canApply,
      hasDob,
    } = this.props;
    const { formConfig, pageList } = route;
    const { formId, prefillEnabled, savedFormMessages, downtime } = formConfig;

    // Without being LOA3 (verified), the prefill & contestable issues won't load
    const showVerifyLink = loggedIn && !isVerified;
    // Missing SSN or DOB
    const showMissingInfo = loggedIn && (!canApply || !hasDob);
    const pathname = location.basename;

    const sipOptions = {
      formId,
      pageList,
      prefillEnabled,
      downtime,
      headingLevel: 2,
      hideUnauthedStartLink: true,
      messages: savedFormMessages,
      startText: 'Start your Claim',
      gaStartEventName: 'decision-reviews-va20-0995-start-form',
      useActionLinks: true,
    };

    // Check LOA3 first, then check canApply (true when LOA3 & has SSN)
    return (
      <div className="schemaform-intro">
        <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />
        <p className="va-introtext">
          If you disagree with our decision on your claim, a Supplemental Claim
          may be an option for you.
        </p>
        {showVerifyLink && <NeedsToVerify pathname={pathname} />}
        {showMissingInfo &&
          !showVerifyLink && <MissingInfo hasSsn={canApply} hasDob={hasDob} />}
        {loggedIn &&
          !showVerifyLink &&
          !showMissingInfo && <SaveInProgressIntro {...sipOptions} />}
        <h2>Follow these steps to get started</h2>
        <va-process-list uswds>
          <va-process-list-item header="Check your eligibility">
            <p>
              You can file a Supplemental Claim if you meet at least 1 of these
              requirements:
            </p>
            <ul>
              <li>
                You have new and relevant evidence that we didn’t consider
                before, <strong>or</strong>
              </li>
              <li>
                You have a condition that we now consider presumptive (such as
                under the{' '}
                <a href="/resources/the-pact-act-and-your-va-benefits/">
                  PACT Act
                </a>
                )
              </li>
            </ul>
            <va-additional-info trigger="What’s a presumptive condition?" uswds>
              <div>
                <p className="vads-u-margin-top--0">
                  For some conditions, we automatically assume (or “presume”)
                  that your service caused your condition. We call these
                  “presumptive conditions.”
                </p>
                <p>
                  If you have a presumptive condition, you don’t need to prove
                  that your service caused the condition. You only need to meet
                  the service requirements for the presumption.
                </p>
                <p className="vads-u-margin-bottom--0">
                  <a href="/resources/the-pact-act-and-your-va-benefits/">
                    Learn more about the PACT act
                  </a>
                </p>
              </div>
            </va-additional-info>
            <p>
              You can file a Supplemental Claim if you have new and relevant
              evidence that we didn’t have when we reviewed your case before.
              You can file your claim anytime, but we recommend you file within
              1 year from the date on your decision letter.
            </p>
            <p>
              <strong>Note:</strong> You can’t file a Supplemental Claim if you
              have a fiduciary claim or a contested claim.
            </p>
            <p>
              <a href="/decision-reviews/fiduciary-claims">
                Learn more about fiduciary claims
              </a>
            </p>
            <p>
              <a href="/decision-reviews/contested-claims">
                Learn more about contested claims
              </a>
            </p>
            <p>
              If you don’t think this is the right form for you, you can go back
              to answer the questions again.
            </p>
            <p>
              <a href={`${formConfig.rootUrl}/start`}>
                Go back to the questions
              </a>
            </p>
          </va-process-list-item>
          <va-process-list-item header="Gather your information">
            Here’s what you’ll need to apply:
            <ul>
              <li>
                New evidence. You can either submit new evidence (supporting
                documents) or identify new evidence you want us to gather for
                you. <strong>Note:</strong> If you have a condition that we
                consider presumptive under a new law or regulation (such as the
                PACT Act), you don’t need to submit evidence to prove that your
                service caused the condition.
              </li>
              <li>
                The decision date of any issue you want us to review. You can
                ask us to review more than 1 issue.
              </li>
              <li>
                The name and address of any private medical facility you’d like
                us to request your records from.
              </li>
              <li>
                The dates you were treated at that private medical facility.
              </li>
            </ul>
            <va-additional-info trigger="Types of Evidence" uswds>
              <div>
                <p className="vads-u-margin-top--0">
                  VA medical records and hospital records that relate to your
                  claimed condition or that show your rated disability or how it
                  has gotten worse
                </p>
                <p>
                  Private medical records and hospital reports that relate to
                  your claimed condition or show that your disability has gotten
                  worse
                </p>
                <p className="vads-u-margin-bottom--0">
                  Supporting statements from family, friends, coworkers, clergy,
                  or law enforcement personnel with knowledge about how and when
                  your disability happened or how it has gotten worse
                </p>
              </div>
            </va-additional-info>
          </va-process-list-item>
          <va-process-list-item
            class="vads-u-padding-bottom--0"
            header="Start your Supplemental Claim"
          >
            <p>
              We’ll take you through each step of the process. It should take
              about 15 minutes.
            </p>
            <va-additional-info trigger="What happens after I apply?" uswds>
              You don’t need to do anything while you’re waiting unless we
              contact you to ask for more information. If we schedule exams for
              you, be sure not to miss them.
            </va-additional-info>
          </va-process-list-item>
        </va-process-list>
        {!showVerifyLink &&
          !showMissingInfo && (
            <div className="sip-wrapper vads-u-margin-bottom--4">
              <SaveInProgressIntro {...sipOptions} buttonOnly={loggedIn} />
            </div>
          )}
        <va-omb-info
          res-burden="15"
          omb-number="2900-0886"
          exp-date="4/30/2024"
        >
          <p>
            <strong>Respondent Burden:</strong> We need this information to
            determine your eligibility for benefits (38 U.S.C. 3471). Title 38,
            United States Code, allows us to ask for this information. We
            estimate that you will need an average of 15 minutes to review the
            instructions, find the information, and complete this form. The VA
            cannot conduct or sponsor a collection of information unless a valid
            OMB (Office of Management and Budget) control number is displayed.
            You are not required to respond to a collection of information if
            this number is not displayed. Valid OMB control numbers can be
            located on the{' '}
            <a href="www.reginfo.gov/public/do/PRAMain" target="_blank">
              OMB Internet Page (opens in a new tab)
            </a>
            . If desired, you can call <va-telephone contact="8008271000" /> to
            get information on where to send comments or suggestions about this
            form.
          </p>
          <p>
            <strong>Privacy Act Notice:</strong> VA will not disclose
            information collected on this form to any source other than what has
            been authorized under the Privacy Act of 1974 or title 38, Code of
            Federal Regulations, section 1.576 for routine uses (i.e., civil or
            criminal law enforcement, congressional communications,
            epidemiological or research studies, the collection of money owed to
            the United States, litigation in which the United States is a party
            or has an interest, the administration of VA programs and delivery
            of VA benefits, verification of identity and status, and personnel
            administration) as identified in the following VA systems of records
            published in the Federal Register, 58/VA21/22/28, Compensation,
            Pension, Education and Veterans Readiness and Employment Records
            -VA; 55VA26 Loan Guaranty Home, Condominium and Manufactured Home
            Loan Applicant Records, Specially Adapted Housing Applicant Records,
            and Vendee Loan Applicant Records -VA; and 36VA29, Veterans and
            Armed Forces Personnel Programs of Government Life Insurance -VA.
            Your obligation to respond is required to obtain or retain benefits.
            VA uses your SSN to identify your claims file. Providing your SSN
            will help ensure that your records are properly associated with your
            claim file. Giving us your SSN account information is voluntary.
            Refusal to provide your SSN by itself will not result in the denial
            of benefits. VA will not deny an individual benefits for refusing to
            provide his or her SSN unless the disclosure of the SSN is required
            by a Federal Statute of law in effect prior to January 1, 1975, and
            still in effect. The requested information is considered relevant
            and necessary to determine maximum benefits under the law. The
            responses you submit are considered confidential (38 U.S.C. 5701).
            Information submitted is subject to verification through computer
            matching programs with other agencies.
          </p>
        </va-omb-info>
      </div>
    );
  }
}

IntroductionPage.propTypes = {
  canApply: PropTypes.bool,
  hasDob: PropTypes.bool,
  isVerified: PropTypes.bool,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      downtime: PropTypes.shape({}),
      formId: PropTypes.string,
      prefillEnabled: PropTypes.bool,
      rootUrl: PropTypes.string,
      savedFormMessages: PropTypes.shape({}),
      subTitle: PropTypes.string,
      title: PropTypes.string,
    }),
    pageList: PropTypes.array,
  }),
};

const mapStateToProps = state => ({
  loggedIn: isLoggedIn(state),
  // Verified LOA3?
  isVerified: selectProfile(state)?.verified || false,
  canApply:
    // profile.claims.appeals indicates that the Veteran can apply for an
    // appeal (is LOA3 AND has a SSN). See
    // vets-api/app/policies/appeals_policy.rb - We need to use this because
    // the SSN is available from prefill, but is not obtained until the form is
    // started :(
    // enable profile.claims by turning on `profile_user_claims` feature
    selectProfile(state).claims?.appeals || environment.isLocalhost(),
  hasDob: !!(selectProfile(state)?.dob || ''),
});

export default connect(mapStateToProps)(IntroductionPage);
