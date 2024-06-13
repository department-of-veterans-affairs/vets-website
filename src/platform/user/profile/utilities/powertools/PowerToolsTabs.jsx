import React from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { TogglesTab } from './tabs/TogglesTab';
import { PowerToolsFloatingButton } from './PowerToolsFloatingButton';
import { UserTab } from './tabs/UserTab';

const tabMap = new Map([
  [
    'toggles',
    powerToolsApi => <TogglesTab key="0" powerToolsApi={powerToolsApi} />,
  ],
  ['user', <UserTab key="1" />],
  ['other', <div key="2">Other tab content</div>],
]);

const tabHelper = (powerToolsApi, activeTab, plugin = null) => {
  if (plugin && plugin?.id) {
    tabMap.set(plugin.id, plugin.component);
  }

  const result = { tabMap, activeTabContent: null };

  if (tabMap.has(activeTab)) {
    const tab = tabMap.get(activeTab);

    result.activeTabContent = tab;

    if (typeof tab === 'function') {
      result.activeTabContent = tab(powerToolsApi, plugin);
    }
  }

  return result;
};

export const PowerToolsTabs = ({ powerToolsApi, plugin }) => {
  const {
    showPowerTools,
    activeTab,
    setActiveTab,
    setShowPowerTools,
  } = powerToolsApi;

  const { tabMap: tabs, activeTabContent } = tabHelper(
    powerToolsApi,
    activeTab,
    plugin,
  );

  const tabKeys = Array.from(tabs.keys());

  return (
    <>
      <div
        id="va-power-tools"
        style={{ display: showPowerTools ? 'block' : 'none' }}
      >
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
      </div>

      <PowerToolsFloatingButton
        showPowerTools={showPowerTools}
        setShowPowerTools={setShowPowerTools}
      />
    </>
  );
};

export default PowerToolsTabs;
