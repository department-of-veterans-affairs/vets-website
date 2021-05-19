import React, { useState } from 'react';
import classNames from 'classnames';
import NameSearchForm from '../../containers/NameSearchForm';
import LocationSearchForm from '../../containers/LocationSearchForm';

export default function SearchTabs() {
  const [currentTab, setCurrentTab] = useState('name');

  const handleTabClick = tabName => {
    setCurrentTab(tabName);
  };

  const tabContent = {
    name: <NameSearchForm />,
    location: <LocationSearchForm />,
  };

  const getTab = (tabName, label) => {
    const tabClasses = classNames(
      {
        'vads-u-border-bottom--4px': tabName === currentTab,
        'vads-u-border-color--primary': tabName === currentTab,
        'vads-u-border-bottom--2px': tabName !== currentTab,
        'vads-u-border-color--gray-light': tabName !== currentTab,
        'vads-u-color--gray-light': tabName !== currentTab,
      },
      'vads-u-font-family--sans',
      'vads-u-flex--1',
      'vads-u-text-align--center',
      'vads-u-font-weight--bold',
      'vads-l-grid-container',
      'vads-u-padding-bottom--1p5',
      'search-tab',
    );

    return (
      <div className={tabClasses} onClick={() => handleTabClick(tabName)}>
        {label}
      </div>
    );
  };

  return (
    <div className="search-form">
      <div className="vads-u-display--flex">
        {getTab('name', 'Search by name')}
        {getTab('location', 'Search by location')}
      </div>
      <div className="search-box">{tabContent[currentTab]}</div>
    </div>
  );
}
