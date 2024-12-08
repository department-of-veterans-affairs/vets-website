import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { LC_TABS } from '../constants';
import LicenseCertificationTestInfo from './LicenseCertificationTestInfo';
import LicenseCertificationAdminInfo from './LicenseCertificationAdminInfo';

export default function LicenseCertificationInfoTabs({ onChange, tab }) {
  const tabs = {
    [LC_TABS.test]: <LicenseCertificationTestInfo />,
    [LC_TABS.admin]: <LicenseCertificationAdminInfo />,
  };

  // consider exporting original function from SearchTabs component
  const getTab = (tabName, label) => {
    const activeTab = tabName === tab;
    const tabClasses = classNames(
      {
        'active-search-tab': activeTab,
        'vads-u-color--gray-dark': activeTab,
        'vads-u-background-color--white': activeTab,
        'inactive-search-tab': !activeTab,
        'vads-u-color--gray-medium': !activeTab,
        'vads-u-background-color--gray-light-alt': !activeTab,
      },
      'vads-u-font-family--sans',
      'vads-u-flex--1',
      'vads-u-text-align--center',
      'vads-u-font-weight--bold',
      'vads-l-grid-container',
      'vads-u-padding-y--1p5',
      'search-tab',
      `${tabName}-search-tab`,
    );
    const testId = label.replaceAll(' ', '-');
    return (
      /* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */
      <button
        type="button"
        className={tabClasses}
        aria-selected={activeTab}
        data-testid={testId}
        role="tab"
        onClick={() => {
          onChange(tabName);
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="row">
      <div role="tablist" className="vads-u-display--flex">
        {getTab(LC_TABS.test, 'Test Info')}
        {getTab(LC_TABS.admin, 'Admin Info')}
      </div>
      <div className="lc-tab-info">{tabs[tab]}</div>
    </div>
  );
}
LicenseCertificationInfoTabs.propTypes = {
  search: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
