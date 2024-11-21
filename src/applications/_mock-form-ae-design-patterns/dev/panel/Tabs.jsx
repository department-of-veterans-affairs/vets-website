import React from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import styled from 'styled-components';
import { TogglesTab } from './tabs/TogglesTab';
import { UserTab } from './tabs/UserTab';

const VADXPanelDiv = styled.div`
  background-color: var(--vads-color-white);
  position: fixed;
  left: 0;
  top: 2.5rem;
  border-radius: 1rem;
  overflow: scroll;
  max-height: 100vh;
  min-height: 25vh;
  max-width: 100vw;
  width: 22vw;
  height: 90vh;
  resize: both;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  z-index: 300;
  padding: 1rem;
`;

const tabMap = new Map([
  ['toggles', panelApi => <TogglesTab key="0" panelApi={panelApi} />],
  ['user', <UserTab key="1" />],
  ['other', <div key="2">Other tab content</div>],
]);

const tabHelper = (panelApi, activeTab, plugin = null) => {
  if (plugin && plugin?.id) {
    tabMap.set(plugin.id, plugin.component);
  }

  const result = { tabMap, activeTabContent: null };

  if (tabMap.has(activeTab)) {
    const tab = tabMap.get(activeTab);

    result.activeTabContent = tab;

    if (typeof tab === 'function') {
      result.activeTabContent = tab(panelApi, plugin);
    }
  }

  return result;
};

export const Tabs = ({ panelApi, plugin }) => {
  const { showVADX, activeTab, setActiveTab } = panelApi;

  const { tabMap: tabs, activeTabContent } = tabHelper(
    panelApi,
    activeTab,
    plugin,
  );

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
