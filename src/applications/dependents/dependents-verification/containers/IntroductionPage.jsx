import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import Gateway from '../components/Gateway';
import { TITLE, SUBTITLE } from '../constants';
import { PRIVACY_ACT_NOTICE } from '../helpers';

const OMB_RES_BURDEN = 10;
const OMB_NUMBER = '2900-0500';
const OMB_EXP_DATE = '1/31/2027';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>
          You must have previously added dependents to your disability benefits
          in order to use this form to verify your VA dependents.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Review your active dependents and your information">
        <p>Here’s what you will need to review:</p>
        <ul>
          <li>
            Your active VA dependents currently listed under your disability
            benefits, including any recent life events (such as recent marriage,
            divorce, or a child reaching adulthood).
          </li>
          <li>
            Your personal information, including your date of birth, Social
            Security number, and contact details.
          </li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Start your dependents verification">
        <p>
          We’ll take you through each step of the process. It should take about
          10 minutes.
        </p>
        <p>
          When you submit your verification form, you’ll get a confirmation
          message. You can print this message for your records.
        </p>
        <va-additional-info trigger="What happens after I submit the form?">
          <p>
            You’re all set! Make it a habit to verify your disability benefits
            dependents information once a year to help us capture any life
            changes that may affect your eligibility.
          </p>
          <p>
            This is the best way to make sure you receive your full benefits and
            avoid overpayments, which you’d be required to pay back.
          </p>
        </va-additional-info>
      </va-process-list-item>
    </va-process-list>
  );
};

export const IntroductionPage = props => {
  const { route } = props;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to get started:
      </h2>
      <Gateway route={route} top />
      <ProcessList />
      <Gateway route={route} />
      <div className="vads-u-margin-top--3">
        <va-omb-info
          res-burden={OMB_RES_BURDEN}
          omb-number={OMB_NUMBER}
          exp-date={OMB_EXP_DATE}
        >
          {PRIVACY_ACT_NOTICE}
        </va-omb-info>
      </div>
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default IntroductionPage;
