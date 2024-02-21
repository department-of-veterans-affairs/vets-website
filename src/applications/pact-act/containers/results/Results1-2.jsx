import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROUTES } from '../../constants';
import {
  getDynamicAccordions,
  isDisplayRequirementFulfilled,
} from '../../utilities/results-1-2-accordions';
import { pageSetup } from '../../utilities/page-setup';
import { BATCHES, BATCH_MAP } from '../../constants/question-batches';
import {
  QUESTION_MAP,
  SHORT_NAME_MAP,
} from '../../constants/question-data-map';

const Results1Page2 = ({ formResponses, router, viewedIntroPage }) => {
  const H1 = QUESTION_MAP.RESULTS_1_2;

  useEffect(() => {
    pageSetup(H1);
  });

  useEffect(
    () => {
      if (!viewedIntroPage) {
        router.push(ROUTES.HOME);
      }
    },
    [router, viewedIntroPage],
  );

  return (
    <>
      <h1 data-testid="paw-results-1-2">{H1}</h1>
      <p>
        Here’s how to apply for VA disability compensation and health care
        online now.
      </p>
      <article>
        <h2 id="file-a-disability-compensation-claim">
          File a claim for disability compensation
        </h2>
        <p>
          If you think you might be eligible, we encourage you to file a claim
          now.
        </p>
        <h3>Related presumptive conditions</h3>
        <p>
          Here are the presumptive conditions we think may apply to you based on
          your answers. If your condition isn’t listed here, you can still file
          a claim. If we don’t consider your condition presumptive, you’ll need
          to provide evidence that your service caused your condition.
        </p>
        <va-accordion class="vads-u-margin-top--4" bordered uswds={false}>
          {getDynamicAccordions(formResponses).map((accordion, index) => (
            <va-accordion-item
              level="4"
              data-testid={`il-results-${index}`}
              header={accordion.title}
              key={`il-results-${index}`}
            >
              {accordion.test}
              {accordion.content}
            </va-accordion-item>
          ))}
        </va-accordion>
        <p>
          <a
            className="vads-u-display--block vads-u-margin-top--1"
            href="/disability/eligibility"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about eligibility for disability benefits (opens in a new
            tab)
          </a>
        </p>
        <h3>
          How to file a claim for a condition you haven’t filed a claim for yet
        </h3>
        <p>
          You can file a claim now. Even if you already get disability payments,
          we encourage you to file a claim for any other conditions you believe
          your service caused. You may be able to get additional or other
          benefits.
        </p>
        <a
          className="vads-c-action-link--blue"
          href="/disability/file-disability-claim-form-21-526ez/"
        >
          File a disability compensation claim
        </a>
        <a
          className="vads-u-margin-top--3 vads-u-display--block"
          href="/disability/eligibility/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about eligibility for disability benefits (opens in a new
          tab)
        </a>
        <h3>How to file a claim for a condition we denied in the past</h3>
        <p>
          If we now consider your condition presumptive under the PACT Act, you
          can file a Supplemental Claim. We’ll reconsider your claim.
        </p>
        <a
          className="vads-c-action-link--blue"
          href="/decision-reviews/supplemental-claim/file-supplemental-claim-form-20-0995/"
        >
          File a Supplemental Claim
        </a>
        <h2 id="apply-for-va-health-care">Apply for VA health care</h2>
        <p>You may also be eligible for VA health care.</p>
        {isDisplayRequirementFulfilled(
          formResponses,
          BATCH_MAP[BATCHES.BURN_PITS],
        ) && (
          <p data-testid="paw-results-1-2-burn-pits">
            We’re extending and expanding VA health care eligibility based on
            the PACT Act. We encourage you to apply, no matter your separation
            date. Your eligibility depends on your service history and other
            factors.
          </p>
        )}
        {isDisplayRequirementFulfilled(formResponses, [
          SHORT_NAME_MAP.ORANGE_2_2_A,
          ...BATCH_MAP[BATCHES.CAMP_LEJEUNE],
        ]) && (
          <p data-testid="paw-results-1-2-o22-lejeune">
            Based on your service history, we encourage you to apply now.
          </p>
        )}
        <a
          className="vads-c-action-link--blue"
          href="/health-care/apply/application/introduction"
        >
          Apply for VA health care
        </a>
        <p>
          <a
            className="vads-u-margin-top--3 vads-u-display--block"
            href="/health-care/eligibility/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about health care eligibility (opens in a new tab)
          </a>
        </p>
      </article>
      <va-button
        back
        class="vads-u-margin-top--3"
        data-testid="paw-results-back"
        onClick={() => router.push(ROUTES.RESULTS_1_1)}
        uswds={false}
      />
    </>
  );
};

Results1Page2.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

export default connect(mapStateToProps)(Results1Page2);
