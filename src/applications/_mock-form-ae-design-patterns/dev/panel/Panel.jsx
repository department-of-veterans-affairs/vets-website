import React, { useContext } from 'react';
import Tabs from './Tabs';
import { useVADX } from './useVADX';
import { PluginContext } from './plugin';
import { FloatingButton } from './FloatingButton';

const VADXContainer = () => {
  const ctx = useContext(PluginContext);
  const panelApi = useVADX();
  return (
    <>
      <Tabs panelApi={panelApi} plugin={ctx.plugin} />
      <FloatingButton
        showVADX={panelApi.showVADX}
        setShowVADX={panelApi.setShowVADX}
      />
    </>
  );
};

export default VADXContainer;
