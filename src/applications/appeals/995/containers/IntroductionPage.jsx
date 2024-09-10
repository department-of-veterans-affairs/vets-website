import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import scrollTo from 'platform/utilities/ui/scrollTo';

import ShowAlertOrSip from '../../shared/components/ShowAlertOrSip';
import OmbInfo from '../content/OmbInfo';

const IntroductionPage = props => {
  useEffect(() => {
    focusElement('h1');
    scrollTo('topContentElement');
  }, []);

  const { route, location } = props;
  const { formConfig, pageList } = route;
  const { formId, prefillEnabled, savedFormMessages, downtime } = formConfig;

  const sipOptions = {
    downtime,
    formId,
    gaStartEventName: 'decision-reviews-va20-0995-start-form',
    headingLevel: 2,
    hideUnauthedStartLink: true,
    messages: savedFormMessages,
    pageList,
    pathname: '/introduction',
    prefillEnabled,
    startText: 'Start your Claim',
    useActionLinks: true,
  };

  return (
    <div className="schemaform-intro">
      <FormTitle title={formConfig.title} subTitle={formConfig.subTitle()} />
      <p className="va-introtext">
        If you disagree with our decision on your claim, a Supplemental Claim
        may be an option for you.
      </p>
      <ShowAlertOrSip basename={location.basename} sipOptions={sipOptions} />
      <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0">
        Follow these steps to get started
      </h2>
      <va-process-list uswds>
        <va-process-list-item header="Check your eligibility">
          <p>
            You can file a Supplemental Claim if you meet at least 1 of these
            requirements:
          </p>
          <ul>
            <li>
              You have new and relevant evidence that we didn’t consider before,
              <strong>or</strong>
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
                For some conditions, we automatically assume (or “presume”) that
                your service caused your condition. We call these “presumptive
                conditions.”
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
            evidence that we didn’t have when we reviewed your case before. You
            can file your claim anytime, but we recommend you file within 1 year
            from the date on your decision letter.
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
            <a href={`${formConfig.rootUrl}/start`}>Go back to the questions</a>
          </p>
        </va-process-list-item>
        <va-process-list-item header="Gather your information">
          Here’s what you’ll need to apply:
          <ul>
            <li>
              New evidence. You can either submit new evidence (supporting
              documents) or identify new evidence you want us to gather for you.
              <strong> Note:</strong> If you have a condition that we consider
              presumptive under a new law or regulation (such as the PACT Act),
              you don’t need to submit evidence to prove that your service
              caused the condition.
            </li>
            <li>
              The decision date of any issue you want us to review. You can ask
              us to review more than 1 issue.
            </li>
            <li>
              The name and address of any private medical facility you’d like us
              to request your records from.
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
                Private medical records and hospital reports that relate to your
                claimed condition or show that your disability has gotten worse
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
            You don’t need to do anything while you’re waiting unless we contact
            you to ask for more information. If we schedule exams for you, be
            sure not to miss them.
          </va-additional-info>
        </va-process-list-item>
      </va-process-list>

      <ShowAlertOrSip
        basename={location.basename}
        sipOptions={sipOptions}
        bottom
      />

      <OmbInfo />
      <p />
    </div>
  );
};

IntroductionPage.propTypes = {
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      downtime: PropTypes.shape({}),
      formId: PropTypes.string,
      prefillEnabled: PropTypes.bool,
      rootUrl: PropTypes.string,
      savedFormMessages: PropTypes.shape({}),
      subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
