import React from 'react';

export const TaskTabs = ({ location, formConfig }) => {
  const tabs = [
    {
      name: 'Home',
      path: '/',
      baseClass: 'vads-u-background-color--primary vads-u-color--white',
    },
    {
      name: 'Green',
      path: '/task-green',
      baseClass: 'vads-u-background-color--green vads-u-color--white',
    },
    {
      name: 'Yellow',
      path: '/task-yellow',
      baseClass: 'vads-u-background-color--gold-light vads-u-color--black',
    },
    {
      name: 'Purple',
      path: '/task-purple',
      baseClass: 'vads-u-background-color--hub-records vads-u-color--white',
    },
  ];

  const activeTab = tabs.find(
    tab => location.pathname.includes(tab.path) && tab.path !== '/',
  );

  const getClassNames = tab => {
    const isActive = activeTab && activeTab.path === tab.path;

    return `${tab.baseClass} ${isActive ? 'vads-u-font-weight--bold' : ''}`;
  };

  return (
    <nav className="vads-u-border-bottom--1px vads-u-border-color--gray-light">
      <ul
        className="vads-l-row vads-u-margin-y--0 vads-u-padding-left--0"
        style={{ listStyleType: 'none' }}
      >
        {tabs.map(tab => (
          <li
            key={tab.name}
            className={`vads-l-col--3 vads-u-text-align--center vads-u-margin-bottom--0 ${getClassNames(
              tab,
            )}`}
          >
            <a
              href={`${formConfig.rootUrl}${tab.path}`}
              className={`${getClassNames(
                tab,
              )} vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-y--1 vads-u-height--full`}
            >
              {tab.name}
            </a>
          </li>
        ))}
      </ul>
      <div
        className={`${getClassNames(activeTab)}`}
        style={{ height: '40px' }}
      />
    </nav>
  );
};
