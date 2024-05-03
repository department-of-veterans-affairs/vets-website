import React from 'react';
import PowerToolsTabs from './PowerToolsTabs';
import { usePowerTools } from '../../../hooks/usePowerTools';

const PowerToolsContainer = () => {
  const powerToolsApi = usePowerTools();
  return <PowerToolsTabs powerToolsApi={powerToolsApi} />;
};

export default PowerToolsContainer;
