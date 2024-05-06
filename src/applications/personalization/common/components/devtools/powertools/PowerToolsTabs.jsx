import React from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { TogglesTab } from './tabs/TogglesTab';
import { PowerToolsFloatingButton } from './PowerToolsFloatingButton';
import { UserTab } from './tabs/UserTab';

export const PowerToolsTabs = ({ powerToolsApi }) => {
  const {
    showPowerTools,
    activeTab,
    setActiveTab,
    setShowPowerTools,
  } = powerToolsApi;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'toggles':
        return <TogglesTab powerToolsApi={powerToolsApi} />;
      case 'user':
        return <UserTab />;
      case 'other':
        return <div>Other tab content</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <div
        id="va-power-tools"
        style={{ display: showPowerTools ? 'block' : 'none' }}
      >
        <div className="vads-u-margin-bottom--1">
          <VaButton
            onClick={() => setActiveTab('toggles')}
            text="Toggles"
            primary={activeTab === 'toggles'}
            secondary={activeTab !== 'toggles'}
          />
          <VaButton
            onClick={() => setActiveTab('user')}
            text="User"
            primary={activeTab === 'user'}
            secondary={activeTab !== 'user'}
          />
          <VaButton
            onClick={() => setActiveTab('other')}
            text="Other"
            primary={activeTab === 'other'}
            secondary={activeTab !== 'other'}
          />
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>

      <PowerToolsFloatingButton
        showPowerTools={showPowerTools}
        setShowPowerTools={setShowPowerTools}
      />
    </>
  );
};

export default PowerToolsTabs;
