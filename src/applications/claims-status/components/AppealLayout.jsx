import React from 'react';
import { Link } from 'react-router';
import ClaimsBreadcrumbs from './ClaimsBreadcrumbs';

export default function AppealLayout({ children }) {
  return (
    <div>
      <div className="row">
        <ClaimsBreadcrumbs>
          <li>
            <Link to="your-claims">Track Your Claims and Appeals</Link>
          </li>
        </ClaimsBreadcrumbs>
      </div>
      {children}
    </div>
  );
}
