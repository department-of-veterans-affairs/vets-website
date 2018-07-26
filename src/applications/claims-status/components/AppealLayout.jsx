import React from 'react';
import { Link } from 'react-router';
import ClBreadcrumbs from './Breadcrumbs';

export default function AppealLayout({ children }) {
  return (
    <div>
      <div className="row">
        <ClBreadcrumbs>
          <Link to="your-claims">Track Your Claims and Appeals</Link>
        </ClBreadcrumbs>
      </div>
      {children}
    </div>
  );
}
