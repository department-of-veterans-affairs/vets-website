import React, { useContext } from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import styled from 'styled-components';
import { TogglesTab } from './toggles/TogglesTab';
import { FormTab } from './form/FormTab';
import { OtherTab } from './other/OtherTab';
import { VADXContext } from '../../context/vadx';

const VADXPanelDiv = styled.div`
  background-color: var(--vads-color-white);
  position: fixed;
  right: 0;
  top: 2.5rem;
  overflow: scroll;
  max-height: 100vh;
  min-height: 25vh;
  max-width: 100vw;
  width: 22vw;
  height: 90vh;
  resize: both;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  z-index: 300;
  padding: 0.5rem;
`;

const tabMap = new Map([
  ['toggles', <TogglesTab key="0" />],
  ['form', <FormTab key="1" />],
  ['other', <OtherTab key="2" />],
]);

const tabHelper = (activeTab, plugin = null) => {
  if (plugin && plugin?.id) {
    tabMap.set(plugin.id, plugin.component);
  }

  const result = { tabMap, activeTabContent: null };

  if (tabMap.has(activeTab)) {
    const tab = tabMap.get(activeTab);

    result.activeTabContent = tab;

    if (typeof tab === 'function') {
      result.activeTabContent = tab(plugin);
    }
  }

  return result;
};

export const Tabs = ({ plugin }) => {
  const { preferences, setSyncedData } = useContext(VADXContext);

  const showVADX = !!preferences?.showVADX;

  const activeTab = preferences?.activeTab || 'toggles';

  const setActiveTab = tab => {
    setSyncedData({ ...preferences, activeTab: tab });
  };

  const { tabMap: tabs, activeTabContent } = tabHelper(activeTab, plugin);

  const tabKeys = Array.from(tabs.keys());

  return (
    <>
      <VADXPanelDiv style={{ display: showVADX ? 'block' : 'none' }}>
        <div className="vads-u-margin-bottom--1">
          {tabKeys.map(key => {
            return (
              <VaButton
                key={key}
                onClick={() => setActiveTab(key)}
                text={key}
                primary={activeTab === key}
                secondary={activeTab !== key}
              />
            );
          })}
        </div>
        <div className="tab-content">{activeTabContent}</div>
      </VADXPanelDiv>
    </>
  );
};

export default Tabs;
