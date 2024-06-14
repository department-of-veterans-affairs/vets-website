import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const CollapsibleWrapper = ({ children }) => {
  return (
    <va-additional-info
      disable-border
      disable-analytics
      trigger="Routes (dev only)"
      uswds
    >
      {children}
    </va-additional-info>
  );
};

const NavLinks = ({ pageList }) => (
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

export const DevModeNavLinks = ({ pageList, collapsible }) =>
  collapsible ? (
    <CollapsibleWrapper>
      <NavLinks pageList={pageList} />
    </CollapsibleWrapper>
  ) : (
    <NavLinks pageList={pageList} />
  );

CollapsibleWrapper.propTypes = {
  children: PropTypes.node,
};

NavLinks.propTypes = {
  pageList: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
    }),
  ),
};

DevModeNavLinks.propTypes = {
  collapsible: PropTypes.bool,
  pageList: NavLinks.propTypes.pageList,
};
