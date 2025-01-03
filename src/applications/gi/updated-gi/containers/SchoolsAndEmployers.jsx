import React, { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import SearchByName from '../components/SearchByName';
import SearchByProgram from '../components/SearchByProgram';

const SchoolAndEmployers = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const tabPanelClassList = 'vads-u-border-bottom--1px vads-u-border-left--1px vads-u-border-right--1px vads-u-border-color--primary vads-u-padding--4';
  const baseTabClassList = 'vads-l-col vads-u-display--flex vads-u-justify-content--center vads-u-align-items--center vads-u-margin-bottom--0 vads-u-text-align--center vads-u-border-top--5px vads-u-border-left--1px vads-u-border-right--1px'
  const inactiveTabClassList = `${baseTabClassList} vads-u-background-color--base-lightest vads-u-border-color--base-lightest vads-u-border-bottom--1px`;
  const activeTabClassList = `${baseTabClassList} vads-u-border-color--primary`;
  const inactiveTabText = 'vads-u-color--gray-dark vads-u-margin--0';

  return (
    <div className="schools-employers-tabs-container">
      <h1>Schools and employers</h1>
      <p>Sentence here about schools and employers. Helpful info, what to do, use the comparison tool, compare benefits, etc.</p>
      <div className="vads-u-margin-top--5 vads-u-margin-bottom--3">
        <Tabs onSelect={(firstTab) => setCurrentTab(firstTab)}>
          <TabList className="vads-l-row vads-u-padding--0 vads-u-margin--0" style={{listStyle: 'none', cursor: 'pointer'}}>
            <Tab className={currentTab === 0 ? activeTabClassList : inactiveTabClassList}>
              <h3 className={currentTab === 1 ? inactiveTabText : 'vads-u-margin--0'}>Search by name</h3>
            </Tab>
            <Tab className={currentTab === 1 ? activeTabClassList : inactiveTabClassList}>
              <h3 className={currentTab === 0 ? inactiveTabText : 'vads-u-margin--0'}>Search by program</h3>
            </Tab>
          </TabList>
          <TabPanel className={currentTab === 0 ? tabPanelClassList : null}>
            <SearchByName />
          </TabPanel>
          <TabPanel className={currentTab === 1 ? tabPanelClassList : null}>
            <SearchByProgram />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default SchoolAndEmployers;
