import React, { useContext } from 'react';

import { PluginContext } from '../context/plugin';
import { VADXContext } from '../context/vadx';

import Tabs from './Tabs';
import { FloatingButton } from './FloatingButton';

const VADXContainer = () => {
  const pluginContext = useContext(PluginContext);
  const { preferences, updateShowVADX } = useContext(VADXContext);

  const showVADX = !!preferences?.showVADX;

  const handleShowVADX = () => {
    updateShowVADX(!showVADX);
  };

  return (
    <>
      <Tabs plugin={pluginContext?.plugin} />
      <FloatingButton showVADX={showVADX} setShowVADX={handleShowVADX} />
    </>
  );
};

export default VADXContainer;
