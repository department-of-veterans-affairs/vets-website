import React from 'react';
import { useBroadcastStorage } from './useBroadcastStorage';

export const Broadcast = () => {
  const { useStorageForKey } = useBroadcastStorage({
    dbName: 'vadx',
    storeName: 'preferences',
  });

  const [theme, setTheme, removeTheme] = useStorageForKey('theme');

  const handleSave = async () => {
    await setTheme('dark');
  };

  const handleRemove = async () => {
    await removeTheme();
  };

  return (
    <div>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleRemove}>Remove</button>

      <div>Theme: {theme}</div>
    </div>
  );
};
