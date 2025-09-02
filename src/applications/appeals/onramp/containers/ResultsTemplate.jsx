import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { scrollToTop } from 'platform/utilities/scroll';
import { ROUTES } from '../constants';
import { isNonDR, NON_DR_RESULTS_CONTENT } from '../constants/results-data-map';

const ResultsTemplate = ({ resultPage, router, viewedIntroPage }) => {
  const hasScrolled = useRef(false);

  if (!hasScrolled.current) {
    scrollToTop();
    hasScrolled.current = true;
  }

  useEffect(
    () => {
      if (!viewedIntroPage) {
        router.push(ROUTES.HOME);
      }
    },
    [router, viewedIntroPage],
  );

  const isNonDrResultPage = isNonDR.includes(resultPage);
  let resultsPageContent;

  if (isNonDrResultPage) {
    resultsPageContent = NON_DR_RESULTS_CONTENT?.[resultPage] || {};
  } else {
    // Temporary return
    // TODO DR summary screen content
    return (
      <h1 data-testid={`onramp-results-header-${resultPage}`}>
        Your decision review options
      </h1>
    );
  }

  if (!resultsPageContent) {
    return null;
  }

  const { h1, bodyContent } = resultsPageContent;

  if (h1 && bodyContent) {
    return (
      <>
        <h1 data-testid={`onramp-results-header-${resultPage}`}>{h1}</h1>
        {bodyContent}
      </>
    );
  }

  return null;
};

const mapStateToProps = state => ({
  resultPage: state?.decisionReviewsGuide?.resultPage,
  viewedIntroPage: state?.decisionReviewsGuide?.viewedIntroPage,
});

ResultsTemplate.propTypes = {
  resultPage: PropTypes.string.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(ResultsTemplate);
