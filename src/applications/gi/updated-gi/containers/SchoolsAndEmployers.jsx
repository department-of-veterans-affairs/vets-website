import React, { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import SearchByName from './SearchByName';
import SearchByProgram from './SearchByProgram';
import { changeSearchTab } from '../../actions';
import { updateUrlParams } from '../../selectors/search';
import { TabsEnum } from '../../utils/enums';

const SchoolAndEmployers = ({
  dispatchChangeSearchTab,
  filters,
  preview,
  search,
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const tabPanelClassList =
    'vads-u-border-bottom--1px vads-u-border-left--1px vads-u-border-right--1px vads-u-border-color--primary medium-screen:vads-u-padding--4 mobile:vads-u-padding--2';
  const baseTabClassList =
    'vads-u-font-family--serif vads-u-font-size--h3 vads-l-col vads-u-display--flex vads-u-justify-content--center vads-u-align-items--center vads-u-margin-bottom--0 vads-u-text-align--center vads-u-border-top--5px vads-u-border-left--1px vads-u-border-right--1px';
  const inactiveTabClassList = `${baseTabClassList} vads-u-background-color--base-lightest vads-u-border-color--base-lightest vads-u-border-bottom--1px`;
  const activeTabClassList = `${baseTabClassList} vads-u-border-color--primary`;
  const inactiveTabText = 'vads-u-color--gray-dark vads-u-margin--0';
  const { version } = preview;
  const history = useHistory();

  const convertTabIndexToText = tabIndex => {
    switch (tabIndex) {
      case 0:
        return TabsEnum.schoolAndEmployerName;
      case 1:
        return TabsEnum.schoolAndEmployerPrograms;
      default:
        return tabIndex.toString();
    }
  };

  const tabChange = selectedTab => {
    const selectedTabText = convertTabIndexToText(selectedTab);
    recordEvent({
      event: 'nav-tab-click',
      'tab-text': `Search by ${selectedTab}`,
    });
    setCurrentTab(selectedTab);
    dispatchChangeSearchTab(selectedTab);
    updateUrlParams(history, selectedTabText, search.query, filters, version);
  };

  return (
    <div className="schools-employers-tabs-container">
      <h1>Schools and employers</h1>
      <p className="vads-u-font-size--h3">
        Learn about and compare your GI Bill benefits at approved schools and
        employers.
      </p>
      <div className="vads-u-margin-top--5 vads-u-margin-bottom--3">
        <Tabs onSelect={tabChange}>
          <TabList
            className="vads-l-row vads-u-padding--0 vads-u-margin--0"
            style={{ listStyle: 'none', cursor: 'pointer' }}
          >
            <Tab
              tabIndex="0"
              className={
                currentTab === 0 ? activeTabClassList : inactiveTabClassList
              }
            >
              <strong>
                <span
                  className={
                    currentTab === 1 ? inactiveTabText : 'vads-u-margin--0'
                  }
                >
                  Search by name
                </span>
              </strong>
            </Tab>
            <Tab
              tabIndex="0"
              className={
                currentTab === 1 ? activeTabClassList : inactiveTabClassList
              }
            >
              <strong>
                <span
                  className={
                    currentTab === 0 ? inactiveTabText : 'vads-u-margin--0'
                  }
                >
                  Search by program
                </span>
              </strong>
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

SchoolAndEmployers.propTypes = {
  dispatchChangeSearchTab: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  preview: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  filters: state.filters,
  preview: state.preview,
  search: state.search,
});

const mapDispatchToProps = {
  dispatchChangeSearchTab: changeSearchTab,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SchoolAndEmployers);
