import React from 'react';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Layout = ({ children, clsName = '' }) => {
  return (
    <>
      <div className="row">
        <div className="vads-u-margin-bottom--4">
          <VaBreadcrumbs
            breadcrumbList={[
              {
                href: '/',
                label: 'Home',
              },
              {
                href: '/education/',
                label: 'Education and training',
              },
              {
                href: '/education/download-letters/letters',
                label: 'Your VA education letter',
              },
            ]}
            label="Breadcrumb"
            wrapping
          />
        </div>
      </div>

      <section id={`education-letters-${clsName}`} className={clsName}>
        <div className="usa-grid usa-grid-full">
          <div className="usa-width-three-fourths">
            <article className="usa-content vads-u-padding-bottom--0">
              {children}
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

Layout.propTypes = {
  clsName: PropTypes.string,
  children: PropTypes.object,
  breadCrumbs: PropTypes.object,
};

export default Layout;
