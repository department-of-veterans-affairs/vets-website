import React, { useContext } from 'react';
import Tabs from './Tabs';
import { PluginContext } from './Plugin';
import { FloatingButton } from './FloatingButton';
import { VADXContext } from '../context/vadx';

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
