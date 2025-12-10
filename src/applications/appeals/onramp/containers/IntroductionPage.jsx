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
      <p className="vads-u-margin-top--3">
        If you disagree with a decision on your disability claim, use this guide
        to explore your options for a decision review.
      </p>
      <p>This guide is only for disability compensation decisions.</p>
      <va-link-action
        data-testid="onramp-start"
        href={ROUTES.Q_1_1_CLAIM_DECISION}
        onClick={startTool}
        text="Start the guide"
        type="primary-entry"
      />
      <h2 className="vads-u-margin-top--4">How this guide works</h2>
      <p>We’ll ask you a series of questions about your situation.</p>
      <p>
        On the final screen, we’ll show you which options may work best for you.
        We’ll also describe why each type of decision review may or may not be a
        good fit for your situation.
      </p>
      <p>
        You can print the final screen for review later. Or select a link to
        apply for your decision review right away.
      </p>
      <p>
        <strong>Note:</strong> You can request a decision review for any issue
        that we already decided—even if other parts of your claim are still
        being processed.
      </p>
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
