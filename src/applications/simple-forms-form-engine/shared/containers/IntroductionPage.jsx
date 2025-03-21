/**
 *  NOTE: This is a work in progress. It will be updated.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const IntroductionPage = props => {
  const { ombInfo, route } = props;
  const { formConfig, pageList } = route;

  useEffect(() => {
    focusElement('.usa-breadcrumb__list');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={formConfig.title} />
      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start the Application"
        hideUnauthedStartLink
      >
        Please complete the form to apply for benefits.
      </SaveInProgressIntro>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to apply for benefits.
      </h2>
      <va-process-list>
        <li>
          <h3>Prepare</h3>
          <h4>To fill out this application, you’ll need your:</h4>
          <ul>
            <li>Social Security number (required)</li>
          </ul>
          <p>
            <strong>What if I need help filling out my application?</strong> An
            accredited representative, like a Veterans Service Officer (VSO),
            can help you fill out your claim.{' '}
            <a href="/disability-benefits/apply/help/index.html">
              Get help filing your claim
            </a>
          </p>
        </li>
        <li>
          <h3>Apply</h3>
          <p>Complete this benefits form.</p>
          <p>
            After submitting the form, you’ll get a confirmation message. You
            can print this for your records.
          </p>
        </li>
        <li>
          <h3>VA Review</h3>
          <p>
            We process claims within a week. If more than a week has passed
            since you submitted your application and you haven’t heard back,
            please don’t apply again. Call us at.
          </p>
        </li>
        <li>
          <h3>Decision</h3>
          <p>
            Once we’ve processed your claim, you’ll get a notice in the mail
            with our decision.
          </p>
        </li>
      </va-process-list>
      <SaveInProgressIntro
        buttonOnly
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start the Application"
        hideUnauthedStartLink
      />
      <p />
      {ombInfo && (
        <va-omb-info
          data-testid="va-omb-info"
          exp-date={ombInfo.expDate}
          omb-number={ombInfo.ombNumber}
          res-burden={ombInfo.resBurden}
        >
          <p>
            <strong>The Paperwork Reduction Act</strong> of 1995 requires us to
            notify you that this information...
          </p>
          <p>
            <strong>Privacy Act information:</strong> VA is asking you to
            provide the information...
          </p>
        </va-omb-info>
      )}
    </article>
  );
};

IntroductionPage.propTypes = {
  ombInfo: PropTypes.shape({
    expDate: PropTypes.string,
    ombNumber: PropTypes.string,
    resBurden: PropTypes.number,
  }),
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
      title: PropTypes.string,
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
