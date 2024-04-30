import React from 'react';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Layout = ({ children, clsName = '', breadCrumbs = {} }) => {
  const renderBreadCrumbs = () => {
    const { text, href } = breadCrumbs;
    if (text) return { href, label: text };
    return false;
  };

  return (
    <>
      <VaBreadcrumbs
        class="bread-crumb-margin"
        breadcrumbList={[
          {
            href: '/',
            label: 'Home',
          },
          {
            href: '/education/',
            label: 'Education and training',
          },
          renderBreadCrumbs(),
        ]}
        label="Breadcrumb"
      />

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
