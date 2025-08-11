import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RadioQuestion from '../components/RadioQuestion';
import { ROUTES } from '../constants';

const QuestionTemplate = props => {
  const route = props?.location?.pathname.replace('/', '');
  const shortName =
    Object.keys(ROUTES).find(key => ROUTES[key] === route) || '';

  return <RadioQuestion router={props.router} shortName={shortName} />;
};

QuestionTemplate.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect()(QuestionTemplate);
