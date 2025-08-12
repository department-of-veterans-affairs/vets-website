import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROUTES } from '../constants';
import { RESULTS_CONTENT } from '../constants/results-data-map';

const ResultsTemplate = ({ resultPage, router, viewedIntroPage }) => {
  const { h1, bodyContent } = RESULTS_CONTENT?.[resultPage] || {};

  useEffect(
    () => {
      if (!viewedIntroPage) {
        router.push(ROUTES.HOME);
      }
    },
    [router, viewedIntroPage],
  );

  if (h1 && bodyContent) {
    return (
      <>
        <h1 data-testid="onramp-results-header">{h1}</h1>
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
