import React from 'react';
import { Link } from 'react-router';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';

export default function AppealLayout({ children }) {
  return (
    <div>
      <div className="row">
        <Breadcrumbs>
          <Link to="your-claims">Track Your Claims and Appeals</Link>
        </Breadcrumbs>
      </div>
      {children}
    </div>
  );
}
