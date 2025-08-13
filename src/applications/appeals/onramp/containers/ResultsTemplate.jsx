import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROUTES } from '../constants';

const ResultsTemplate = ({ resultPage, router, viewedIntroPage }) => {
  useEffect(
    () => {
      if (!viewedIntroPage) {
        router.push(ROUTES.HOME);
      }
    },
    [router, viewedIntroPage],
  );

  return <h1 data-testid="onramp-results-header">{resultPage}</h1>;
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
