import React from 'react';

const ViewDependentsSidebarBlock = props => (
  <div className="vads-u-margin-bottom--5">
    <h2 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
      {props.heading}
    </h2>
    {props.content}
  </div>
);

export default ViewDependentsSidebarBlock;
