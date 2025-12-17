import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { scrollToTop } from 'platform/utilities/scroll';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import Gateway from '../components/Gateway';
import { TITLE, SUBTITLE } from '../constants';
import { PRIVACY_ACT_NOTICE } from '../helpers';

import manifest from '../manifest.json';

import { getRootParentUrl } from '../../shared/utils';

const OMB_RES_BURDEN = 10;
const OMB_NUMBER = '2900-0500';
const OMB_EXP_DATE = '1/31/2027';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>
          You can only use this form if you have dependents on your VA
          disability benefits.
        </p>
        <va-link
          text=" Not sure? Check your VA dependents."
          href={getRootParentUrl(manifest.rootUrl)}
        />
      </va-process-list-item>
      <va-process-list-item header="Review your active dependents and your information">
        <p>Here’s what you’ll need to review:</p>
        <ul>
          <li>
            Your active VA dependents currently listed on your benefits,
            including any recent life events (such as recent marriage, divorce,
            or a child reaching adulthood).
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
      </va-process-list-item>
      <va-process-list-item header="After you submit">
        <p>
          You don’t need to do anything else. But you’ll need to verify your
          dependents’ information on your benefits each year.
        </p>
        <p>
          Verifying your dependents each year makes sure you get your full
          benefits. It also helps avoid benefit overpayments, which you’d need
          to repay.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

/**
 * Introduction page component
 * @typedef {object} IntroductionPageProps
 * @property {object} route - route object
 *
 * @param {IntroductionPageProps} props - Introduction page props
 * @returns {React.Component} - Introduction page
 */
export const IntroductionPage = props => {
  const { route } = props;

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <Gateway route={route} top />
      <p className="va-introtext">
        Use our online tool to submit your dependent verification form for VA
        disability benefits.
      </p>
      <h2 className="vads-u-margin-top--0">
        Follow these steps to get started
      </h2>
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
