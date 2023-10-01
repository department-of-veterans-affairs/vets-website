import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const FormElementTitle = ({ title }) => {
  const currentPath = window.location.pathname.split('/').slice(-1)[0];
  // try this to get a link per question?
  return currentPath === 'review-then-submit' ? (
    <>
      <p>{title}</p>
      <Link to="/category-topic-2">Go back to form</Link>
    </>
  ) : (
    <h2>{title}</h2>
  );
};

FormElementTitle.prototype = {
  title: PropTypes.string,
};

export default FormElementTitle;
