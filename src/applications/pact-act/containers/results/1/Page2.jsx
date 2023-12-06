// this file will be deleted when research is complete
// and replaced with TempResults1Page2
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { accordions } from '../../../constants/results-set-1-page-2-accordions';
import { customizeTitle } from '../../../utilities/customize-title';

const ResultsSet1Page2 = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const H1 = 'Apply for VA benefits now';

  useEffect(() => {
    document.title = customizeTitle(H1);
  });

  useEffect(
    () => {
      if (!hasScrolled) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        waitForRenderThenFocus('h1');
        setHasScrolled(true);
      }
    },
    [hasScrolled],
  );

  const renderAccordions = () => {
    const contents = accordions['burn-pit'].map(accordion => (
      <va-accordion-item
        level="3"
        data-testid="il-results-1"
        header={accordion?.title}
        key={accordion?.title}
      >
        {accordion?.content}
      </va-accordion-item>
    ));

    return (
      <va-accordion class="vads-u-margin-top--4" open-single>
        {contents}
      </va-accordion>
    );
  };

  return (
    <>
      <h1>{H1}</h1>
      <p>
        Here’s how to apply for VA disability compensation and health care
        online now.
      </p>
      <article>
        <h2 id="file-a-disability-compensation-claim">
          File a claim for disability compensation
        </h2>
        <p>
          If you think you’re eligible, we encourage you to file a claim for
          disability compensation now.
        </p>
        <h3>Check presumptive conditions</h3>
        <p>
          Here are the presumptive conditions we think may apply to you based on
          your answers.
        </p>
        {renderAccordions()}
        <p>
          <strong>Note:</strong> If your condition isn’t listed here, you can
          learn more about other presumptive conditions and disability benefit
          eligibility. And if you have an illness that we don’t consider
          presumptive, you can still file a claim. But you’ll need to provide
          evidence that your service caused your condition.{' '}
          <a
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
        <p>You can file a claim now.</p>
        <p>
          Already get disability compensation for a different condition? We
          still encourage you to file a claim for any condition you believe your
          service caused. You may be able to get additional or other benefits.
        </p>
        <a
          className="vads-c-action-link--blue"
          href="/disability/file-disability-claim-form-21-526ez/"
        >
          File a disability compensation claim
        </a>
        <h3>How to file a claim for a condition we’ve denied in the past</h3>
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
        <p>
          We’re extending and expanding VA health care eligibility based on the
          PACT Act. We encourage you to apply, no matter your separation date.
          Your eligibility depends on your service history and other factors.
        </p>
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
    </>
  );
};

ResultsSet1Page2.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default ResultsSet1Page2;
