import React from 'react';

function FormBreadcrumbs() {
  return (
    <div className="vads-l-col--12 small-desktop-screen:vads-l-col--10">
      <va-breadcrumbs className="vads-u-font-family--sans no-wrap">
        <a href="/">Home</a>
        <a href="/view-change-representative/search/introduction">
          Find a Local Representative
        </a>
        <a href="/view-change-representative/search/introduction">
          Appoint a Representative
        </a>
      </va-breadcrumbs>
    </div>
  );
}

export default FormBreadcrumbs;
