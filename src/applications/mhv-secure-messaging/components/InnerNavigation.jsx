import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DefaultFolders, Paths } from '../util/constants';

const InnerNavigation = () => {
  const location = useLocation();

  const paths = () => {
    return [
      {
        path: Paths.INBOX,
        label: 'Inbox',
        id: DefaultFolders.INBOX.id,
        datatestid: 'inbox-inner-nav',
      },
      {
        path: Paths.FOLDERS,
        label: 'Folders',
        datatestid: 'folders-inner-nav',
      },
    ];
  };

  const handleActiveLinksStyle = path => {
    let isInnerActive = false;
    if (location.pathname === '/') {
      // Highlight Messages on Lnading page
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
        vads-u-justify-content--flex-start
        vads-u-border-bottom--1px
        vads-u-border-color--gray-lightest
      "
    >
      {paths().map((path, i) => (
        <div
          key={i}
          data-testid={path.datatestid}
          activetab={handleActiveLinksStyle(path)}
          className={`
            vads-u-margin-right--2
            vads-u-font-size--lg
            vads-u-display--flex
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
  );
};

export default InnerNavigation;
