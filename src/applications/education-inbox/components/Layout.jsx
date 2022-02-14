import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

const Layout = ({ children }) => {
  return (
    <>
      <Breadcrumbs>
        <a href="/">Home</a>
        <a href="/education/">Eduction and training</a>
        <a href="/education/education-inbox">Check your VA education inbox</a>
      </Breadcrumbs>
      <main id="main" className="main">
        <div className="usa-grid usa-grid-full">
          <div className="usa-width-three-fourths">
            <article className="usa-content vads-u-padding-bottom--0">
              {children}
            </article>
          </div>
        </div>
      </main>
    </>
  );
};

export default Layout;
