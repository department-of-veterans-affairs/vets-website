import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateIntroPageViewed } from '../actions';
import { QUESTION_CONTENT } from '../constants/question-data-map';
import { ROUTES } from '../constants';
import { pageSetup } from '../utilities';

const IntroductionPage = ({ router, setIntroPageViewed }) => {
  useEffect(() => {
    setIntroPageViewed(true);
  });

  useEffect(() => {
    pageSetup();
  }, []);

  const startTool = event => {
    event.preventDefault();
    router.push(ROUTES.Q_1_1_CLAIM_DECISION);
  };

  return (
    <>
      <h1 className="vads-u-margin-bottom--2p5">
        {QUESTION_CONTENT.INTRODUCTION.h1}
      </h1>
      <h2 className="vads-u-margin-y--0 vads-u-font-weight--normal vads-u-font-size--h3">
        Learn about what decision review option may be right for you.
      </h2>
      <p className="vads-u-margin-top--3">
        If you received a disability claim decision from us and disagree with
        it, you can choose from 3 decision review options:
      </p>
      <ul>
        <li>File a Supplemental Claim</li>
        <li>Request a Higher-Level Review</li>
        <li>Request a Board Appeal</li>
      </ul>
      <p>
        This guide isn’t a form you’ll submit to us. Instead, it asks a few
        questions to help you understand which decision review option may fit
        your situation—and how the other options compare.
      </p>
      <p>
        You’ll be able to review which options don’t apply right now and what
        steps you may be able to take instead.
      </p>
      <p className="vads-u-margin-bottom--3">
        <strong>Note:</strong> You can request a decision review for a condition
        or issue that we have already decided—even if other parts of your claim
        are still being processed.
      </p>
      <va-link-action
        data-testid="onramp-start"
        href={ROUTES.Q_1_1_CLAIM_DECISION}
        onClick={startTool}
        text="Explore your options"
      />
      <va-accordion>
        <va-accordion-item header="Haven’t received a decision yet?">
          <p className="vads-u-margin-top--0">
            This guide is for reviewing decisions we’ve already made. If you’re
            still waiting to hear from us on a claim, you’ll need to wait until
            you receive your decision before you can request a review.
          </p>
          <p>
            But you don’t have to wait to use this guide. You can still explore
            review options and consider what might apply once you get your
            decision.
          </p>
          <va-link
            class="vads-u-display--block vads-u-margin-bottom--4"
            href="/track-claims"
            text="Check your claim status"
          />
        </va-accordion-item>
        <va-accordion-item header="Haven’t filed a claim yet?">
          <p className="vads-u-margin-top--0">
            You’ll need to file a disability claim first. After you get your
            decision, you can use this guide to find the right review option for
            your situation.
          </p>
          <p>
            But you don’t have to wait to use this guide. You can explore the
            review options now to learn what might apply to you later.
          </p>
          <va-link
            class="vads-u-display--block vads-u-margin-bottom--4"
            href="/disability/how-to-file-claim"
            text="How to file a disability claim"
          />
        </va-accordion-item>
        <va-accordion-item header="Responding to a Statement of the Case (SOC) or Supplemental Statement of the Case (SSOC)?">
          <p className="vads-u-margin-top--0">
            If you received a Statement of the Case (SOC) or Supplemental
            Statement of the Case (SSOC) from us, you already have an appeal in
            progress, and it may still be in the legacy appeals system.
          </p>
          <p>
            You might be able to switch to the new decision review process
            outlined in this guide but you can’t have more than 1 decision
            review in progress for the same issue.
          </p>
          <va-link
            class="vads-u-display--block vads-u-margin-bottom--4"
            href="/decision-reviews/legacy-appeals"
            text="Learn more about Legacy Appeals System"
          />
        </va-accordion-item>
        <va-accordion-item header="Looking for decision review options for other VA benefits?">
          <p className="vads-u-margin-top--0">
            You can use the same decision review options—Supplemental Claim,
            Higher-Level Review, or Board Appeal—for other types of VA benefits,
            not just disability compensation.
          </p>
          <p>
            But this guide is only for disability compensation decisions. It
            doesn’t yet support decisions for other benefit types.
          </p>
          <p>
            Learn more about decision review options for benefits other than
            disability compensation:{' '}
          </p>
          {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
        a problem with Safari not treating the `ul` as a list. */}
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ul className="onramp-list-none" role="list">
            <li className="vads-u-margin-bottom--2">
              <va-link
                href="/resources/choosing-a-decision-review-option/"
                text="Choosing a decision review option"
              />
            </li>
            <li className="vads-u-margin-bottom--2">
              <va-link
                href="/decision-reviews/supplemental-claim"
                text="Supplemental Claim"
              />
            </li>
            <li className="vads-u-margin-bottom--2">
              <va-link
                href="/decision-reviews/higher-level-review"
                text="Higher-Level Review"
              />
            </li>
            <li className="vads-u-margin-bottom--2">
              <va-link
                href="/decision-reviews/board-appeal"
                text="Board Appeal"
              />
            </li>
          </ul>
          <p>Explore other VA benefit types:</p>
          {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
        a problem with Safari not treating the `ul` as a list. */}
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ul className="onramp-list-none" role="list">
            <li className="vads-u-margin-bottom--2">
              <va-link
                href="/family-and-caregiver-benefits/survivor-compensation/survivors-pension"
                text="Pension and Survivors Benefits"
              />
            </li>
            <li className="vads-u-margin-bottom--2">
              <va-link
                href="https://www.benefits.va.gov/vocrehab/"
                text="Veteran Readiness and Employment"
              />
            </li>
            <li className="vads-u-margin-bottom--2">
              <va-link
                href="/education/about-gi-bill-benefits"
                text="Education benefits"
              />
            </li>
            <li className="vads-u-margin-bottom--2">
              <va-link
                href="/housing-assistance/home-loans"
                text="VA-backed home loans"
              />
            </li>
            <li className="vads-u-margin-bottom--2">
              <va-link href="/life-insurance" text="Life insurance" />
            </li>
            <li className="vads-u-margin-bottom--2">
              <va-link
                href="https://www.benefits.va.gov/fiduciary"
                text="Fiduciary services"
              />
            </li>
            <li className="vads-u-margin-bottom--2">
              <va-link href="/health-care" text="VA health care" />
            </li>
            <li className="vads-u-margin-bottom--8">
              <va-link
                href="/burials-memorials"
                text="Burial and memorial benefits"
              />
            </li>
          </ul>
        </va-accordion-item>
      </va-accordion>
    </>
  );
};

IntroductionPage.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setIntroPageViewed: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  setIntroPageViewed: updateIntroPageViewed,
};

export default connect(
  null,
  mapDispatchToProps,
)(IntroductionPage);
