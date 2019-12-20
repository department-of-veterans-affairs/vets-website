import React from 'react';

const ViewDependentsSidebarBlock = props => (
  <div>
    <h3 className="vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
      {props.heading}
    </h3>
    {props.content}
  </div>
);

export default ViewDependentsSidebarBlock;
