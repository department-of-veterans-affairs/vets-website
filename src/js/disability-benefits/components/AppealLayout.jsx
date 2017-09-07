import React from 'react';
import Breadcrumbs from './Breadcrumbs';

export default function AppealLayout({ children }) {
  return (
    <div>
      <div>
        <div className="row">
          <Breadcrumbs/>
        </div>
      </div>
      {children}
    </div>
  );
}
