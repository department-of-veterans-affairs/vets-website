import React from 'react';

const ViewPaymentsSidebarBlock = props => (
  <div className="vads-u-margin-bottom--5">
    <h3 className="vads-u-margin-top--0 vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
      {props.heading}
    </h3>
    {props.content}
  </div>
);

export default ViewPaymentsSidebarBlock;
