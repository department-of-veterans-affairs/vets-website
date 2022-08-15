import React from 'react';

const Breadcrumbs = props => (
  <div>
    <va-Breadcrumbs>
      <a href="http://localhost:3001/my-health/secure-messages/">VA.gov home</a>
      <a href="http://localhost:3001/my-health/secure-messages/">My Health</a>
      <a href="http://localhost:3001/my-health/secure-messages/">Messages</a>
      <a href={props.link}>{props.pageName}</a>
    </va-Breadcrumbs>
  </div>
);

export default Breadcrumbs;
