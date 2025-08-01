import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateIntroPageViewed } from '../actions';
import { QUESTION_MAP } from '../constants/question-data-map';
import { ROUTES } from '../constants';

const HomePage = ({ router, setIntroPageViewed }) => {
  const H1 = QUESTION_MAP.HOME;

  useEffect(() => {
    setIntroPageViewed(true);
  });

  const startTool = event => {
    event.preventDefault();
    router.push(ROUTES.Q_1_1_CLAIM_DECISION);
  };

  return (
    <>
      <h1 className="vads-u-margin-bottom--1">{H1}</h1>
      <h2 className="vads-u-margin-y--0 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--h3">
        Learn about what Decision Review option may be right for you.
      </h2>
      <p className="vads-u-margin-top--3">
        If you received a decision letter from VA and disagree with the
        disability compensation decision, you can choose from 3 decision review
        options:
      </p>
      <ul>
        <li className="vads-u-margin-bottom--1p5">Supplemental Claim</li>
        <li className="vads-u-margin-bottom--1p5">Higher-Level Review</li>
        <li>Board Appeal</li>
      </ul>
      <p className="vads-u-margin-bottom--3">
        You can choose any option that’s right for you. If you don’t get the
        result you hoped for, you may be able to try another eligible option.
      </p>
      <va-button
        class="vads-u-width--full"
        onClick={startTool}
        text="Start the tool"
      />
      <hr className="vads-u-margin-y--4" />
      <h3 className="vads-u-margin-top--3">Haven’t received a decision yet?</h3>
      <p>
        This tool is for reviewing VA decisions that have already been made. If
        you’re still waiting on a decision, you’ll need to wait until you
        receive your decision letter before you can request a review.
      </p>
      <va-link href="/track-claims" text="Check your claim status" />
      <h3 className="vads-u-margin-top--3">Haven’t filed a claim yet?</h3>
      <p>
        To use this tool, you need to have already filed a claim and received a
        decision. If you haven’t filed a claim yet, you’ll need to do that
        first.
      </p>
      <va-link
        href="/disability/how-to-file-claim"
        text="How to file a disability claim"
      />
      <h3 className="vads-u-margin-top--3">
        Responding to a Statement of the Case (SOC)?
      </h3>
      <p>
        If you received a Statement of the Case (SOC) or Supplemental Statement
        of the Case (SSOC) from VA, your appeal may still be in the legacy
        appeals system.
      </p>
      <p>
        You can use this tool to switch from the legacy system to the new
        decision review process. To do that:
      </p>
      <ul>
        <li>
          You’ll need to submit your request within 60 days of the date on your
          SOC or SSOC.
        </li>
        <li>
          You must list the specific issue(s) from the SOC or SSOC that you want
          reviewed.
        </li>
      </ul>
      <p>
        Once you make this switch, those issues will move to the new system and
        will no longer be part of your legacy appeal. You can’t go back to the
        legacy system for any issue you choose to move forward this way.
      </p>
      <va-link
        href="/decision-reviews/legacy-appeals"
        text="Learn more about Legacy Appeals System"
      />
      <h3 className="vads-u-margin-top--3">
        Looking for decision review options for other VA benefits?
      </h3>
      <p>
        If you need to request a decision review for a different VA benefit, you
        can find information about your options here:
      </p>
      <ul className="onramp-list-none">
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
    </>
  );
};

HomePage.propTypes = {
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
)(HomePage);
