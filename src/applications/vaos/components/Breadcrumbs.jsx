import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';

export default function VAOSBreadcrumbs({ children }) {
  return (
    <Breadcrumbs className="medium-screen:vads-u-padding-x--0">
      <a href="/" key="home">
        Home
      </a>
      <a href="/health-care" key="health-care">
        Health care
      </a>
      <a
        href="/health-care/schedule-view-va-appointments"
        key="schedule-view-va-appointments"
      >
        Schedule and view appointments
      </a>
      <Link to="/" key="vaos-home">
        VA online scheduling
      </Link>
      {children}
    </Breadcrumbs>
  );
}
