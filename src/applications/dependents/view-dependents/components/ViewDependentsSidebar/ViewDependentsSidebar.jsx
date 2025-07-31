import React from 'react';
import PropTypes from 'prop-types';

const ViewDependentsSidebar = props => (
  <div className="medium-screen:vads-u-padding-left--4">{props.children}</div>
);

ViewDependentsSidebar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ViewDependentsSidebar;
