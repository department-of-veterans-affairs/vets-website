import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RadioQuestion from '../components/RadioQuestion';
import { ROUTES } from '../constants';
import { pageSetup } from '../utilities';

const QuestionTemplate = ({ location, router, viewedIntroPage }) => {
  const route = location?.pathname.replace('/', '');
  const shortName =
    Object.keys(ROUTES).find(key => ROUTES[key] === route) || '';

  useEffect(
    () => {
      if (!viewedIntroPage) {
        router.push(ROUTES.INTRODUCTION);
      }
    },
    [router, viewedIntroPage],
  );

  useEffect(
    () => {
      if (document) pageSetup();
    },
    [route],
  );

  return <RadioQuestion router={router} shortName={shortName} />;
};

const mapStateToProps = state => ({
  viewedIntroPage: state?.decisionReviewsGuide?.viewedIntroPage,
});

QuestionTemplate.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(QuestionTemplate);
