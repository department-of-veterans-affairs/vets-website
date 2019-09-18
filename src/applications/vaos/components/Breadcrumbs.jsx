import React from 'react';
import { Link } from 'react-router';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';

export default function VAOSBreadcrumbs({ children }) {
  return (
    <Breadcrumbs customClasses="new-grid">
      <a href="/" key="home">
        Home
      </a>
      <a href="/health-care" key="health-care">
        Health care
      </a>
      <Link to="/" key="vaos-home">
        VA Online Scheduling
      </Link>
      {children}
    </Breadcrumbs>
  );
}
