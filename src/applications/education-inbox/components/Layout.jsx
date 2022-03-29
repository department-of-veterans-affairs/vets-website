import React from 'react';
import PropTypes from 'prop-types';

const Layout = ({ children, clsName = '', breadCrumbs = {} }) => {
  const classNa = `main ${clsName}`;

  const renderBreadCrumbs = () => {
    const { text, href } = breadCrumbs;
    if (text) return <a href={href}>{text}</a>;
    return false;
  };

  return (
    <>
      <va-breadcrumbs>
        <a href="/">Home</a>
        <a href="/education/">Eduction and training</a>
        {renderBreadCrumbs()}
      </va-breadcrumbs>
      <main id="main" className={classNa}>
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

Layout.propTypes = {
  clsName: PropTypes.string,
  children: PropTypes.object,
  breadCrumbs: PropTypes.object,
};

export default Layout;
