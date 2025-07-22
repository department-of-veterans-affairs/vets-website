import React from 'react';
import PropTypes from 'prop-types';

const ViewDependentsSidebarBlock = props => (
  <div className="vads-u-margin-bottom--5">
    <h2 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
      {props.heading}
    </h2>
    {props.content}
  </div>
);

ViewDependentsSidebarBlock.propTypes = {
  content: PropTypes.any.isRequired,
  heading: PropTypes.string.isRequired,
};

export default ViewDependentsSidebarBlock;
