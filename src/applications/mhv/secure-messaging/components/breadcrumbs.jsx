import React from 'react';
import PropTypes from 'prop-types';

const Breadcrumbs = props => {
  return (
    <va-breadcrumbs>
      <a href="/my-health/secure-messages/">Va.gov home</a>
      <a href="/my-health/secure-messages/">My Health</a>
      <a href="/my-health/secure-messages/">Messages</a>
      <a href={props.link}>{props.pageName}</a>
    </va-breadcrumbs>
  );
};

Breadcrumbs.propTypes = {
  link: PropTypes.string,
  pageName: PropTypes.string,
};

export default Breadcrumbs;
