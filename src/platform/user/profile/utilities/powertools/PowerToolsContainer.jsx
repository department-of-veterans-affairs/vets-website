import React, { useContext } from 'react';
import PowerToolsTabs from './PowerToolsTabs';
import { usePowerTools } from './usePowerTools';
import { PluginContext } from './plugin';

const PowerToolsContainer = () => {
  const ctx = useContext(PluginContext);
  const powerToolsApi = usePowerTools();
  return <PowerToolsTabs powerToolsApi={powerToolsApi} plugin={ctx.plugin} />;
};

export default PowerToolsContainer;
