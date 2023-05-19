import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

export const DevModeNavLinks = ({ pageList }) => (
  <span>
    {pageList.map(({ path }) => {
      return (
        <Link key={path} className="vads-u-padding-right--2" to={`${path}`}>
          {path}
        </Link>
      );
    })}
  </span>
);

DevModeNavLinks.propTypes = {
  pageList: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
    }),
  ),
};
