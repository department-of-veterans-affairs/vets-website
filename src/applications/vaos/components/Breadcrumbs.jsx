import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

export default function VAOSBreadcrumbs({ children }) {
  return (
    <Breadcrumbs className="medium-screen:vads-u-padding-x--0 vaos-appts__breadcrumbs">
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
        Schedule and manage health appointments
      </a>
      <Link to="/" key="vaos-home">
        VA online scheduling
      </Link>
      {children}
    </Breadcrumbs>
  );
}
