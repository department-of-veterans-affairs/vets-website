import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { InnerNavigationPaths, Paths } from '../util/constants';

const InnerNavigation = () => {
  const location = useLocation();

  const handleActiveLinksStyle = path => {
    let isInnerActive = false;
    if (location.pathname === '/') {
      // Highlight Messages on Landing page
      isInnerActive = false;
    } else if (location.pathname === Paths.FOLDERS) {
      // To ensure other nav links are not bolded when landed on "/folders"
      isInnerActive = location.pathname === path.path;
    } else if (location.pathname === path.path) {
      isInnerActive = true;
    }

    return isInnerActive ? 'active-innerNav-link' : '';
  };

  return (
    <div
      className="
    do-not-print
    vads-u-margin-top--3
    vads-l-row
    "
    >
      <div
        className="
          vads-u-display--flex
          vads-u-flex-wrap--wrap
          vads-u-flex--fill
          small-screen:vads-u-flex--auto
          vads-u-border-bottom--1px
          vads-u-border-color--gray-lightest
        "
      >
        {InnerNavigationPaths.map((path, i) => (
          <div
            key={i}
            data-testid={path.datatestid}
            activetab={handleActiveLinksStyle(path)}
            className={`
              vads-u-font-size--lg
              vads-u-display--flex
              ${i < InnerNavigationPaths.length - 1 && 'vads-u-margin-right--2'}
              vads-u-justify-content--center
              vads-u-padding-x--1p5
              ${handleActiveLinksStyle(path)}
            `}
          >
            <Link className="inner-nav-link" to={path.path}>
              {path.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InnerNavigation;
