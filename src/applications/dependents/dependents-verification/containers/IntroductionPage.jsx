import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import Gateway from '../components/Gateway';
import { TITLE, SUBTITLE } from '../constants';

const OMB_RES_BURDEN = 10;
const OMB_NUMBER = '2900-0500';
const OMB_EXP_DATE = '1/31/2027';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Prepare">
        <h4>To fill out this application, you’ll need your:</h4>
        <ul>
          <li>Social Security number (required)</li>
        </ul>
        <p>
          <strong>What if I need help filling out my application?</strong> An
          accredited representative, like a Veterans Service Officer (VSO), can
          help you fill out your claim.{' '}
          <a href="/disability-benefits/apply/help/index.html">
            Get help filing your claim
          </a>
        </p>
      </va-process-list-item>
      <va-process-list-item header="Apply">
        <p>Complete this benefits form.</p>
        <p>
          After submitting the form, you’ll get a confirmation message. You can
          print this for your records.
        </p>
      </va-process-list-item>
      <va-process-list-item header="VA Review">
        <p>
          We process claims within a week. If more than a week has passed since
          you submitted your application and you haven’t heard back, please
          don’t apply again. Call us at.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Decision">
        <p>
          Once we’ve processed your claim, you’ll get a notice in the mail with
          our decision.
        </p>
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
        Follow the steps below to apply for dependent-benefits.
      </h2>
      <Gateway route={route} top />
      <ProcessList />
      <Gateway route={route} />
      <p />
      <va-omb-info
        res-burden={OMB_RES_BURDEN}
        omb-number={OMB_NUMBER}
        exp-date={OMB_EXP_DATE}
      />
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
