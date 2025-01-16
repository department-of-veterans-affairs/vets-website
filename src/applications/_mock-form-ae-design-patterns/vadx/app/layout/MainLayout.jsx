import React from 'react';
import PropTypes from 'prop-types';

/**
 * @component MainLayout
 * @description Layout component for VADX tools. includes left navigation and content section
 */
export const MainLayout = ({ children, navigation }) => {
  return (
    <div className="vads-l-grid-container--full vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-top--3">
        <div className="vads-l-col--2 vads-u-padding-right--2 vads-u-margin-bottom--2">
          <h1 className="vads-u-font-family--sans vads-u-font-size--h3 vads-u-margin--0 vads-u-padding-x--2">
            VADX tools
          </h1>
          <nav
            className="vads-u-padding--1 va-sidebarnav"
            aria-label="VADX Tools Navigation"
          >
            {navigation}
          </nav>
        </div>

        <div className="vads-l-col--10 vads-u-padding-left--0">{children}</div>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  navigation: PropTypes.node.isRequired,
};
