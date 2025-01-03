import React, { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

const SchoolAndEmployers = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const inactiveTabClassList = 'vads-l-col vads-u-margin--0 vads-u-height--full vads-u-text-align--center vads-u-border-top--5px vads-u-background-color--base-lightest vads-u-border-color--base-lightest';
  const activeTabClassList = 'vads-l-col vads-u-margin--0 vads-u-text-align--center vads-u-border-top--5px vads-u-border-left--1px vads-u-border-right--1px vads-u-border-color--primary';
  const inactiveTabText = 'vads-u-color--gray-dark';

  return (
    <div>
      <h1>School and employers</h1>
      <p>Sentence here about schools and employers. Helpful info, what to do, use the comparison tool, compare benefits, etc.</p>
      <div className="vads-u-margin-top--5 vads-u-margin-bottom--3">
        <Tabs onSelect={(firstTab) => setCurrentTab(firstTab)} className="vads-l-grid-container">
          <TabList className="vads-l-row vads-u-padding--0 vads-u-margin--0" style={{listStyle: 'none', cursor: 'pointer'}}>
            <Tab className={currentTab === 0 ? activeTabClassList : inactiveTabClassList}>
              <h3 className={currentTab === 1 ? inactiveTabText : null}>Search by name</h3>
            </Tab>
            <Tab className={currentTab === 1 ? activeTabClassList : inactiveTabClassList}>
              <h3 className={currentTab === 0 ? inactiveTabText : null}>Search by program</h3>
            </Tab>
          </TabList>
          <TabPanel>Search by name</TabPanel>
          <TabPanel>Search by program</TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default SchoolAndEmployers;
