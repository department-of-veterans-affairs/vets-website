import { useEffect, useCallback, useState, useMemo } from 'react';
import { StorageAdapter } from './utils/StorageAdapter';
import { useBroadcastChannel } from './useBroadcastChannel';

/**
 * @param {string} dbName - should be the same across an app for the most part
 * @param {string} storeName - name of the store, also used as the internal broadcast channel name
 */
export const useBroadcastStorage = ({ dbName, storeName }) => {
  /**
   * @param {string} key - the key to use for the storing and broadcasting
   */
  const useStorageForKey = (key, defaultValue = null) => {
    const storage = useMemo(() => new StorageAdapter(dbName, storeName), []);
    const [, sendMessage] = useBroadcastChannel(
      `${dbName}-${storeName}-${key}`,
    );
    const [value, setValue] = useState(defaultValue);

    const setVal = async val => {
      await storage.set(key, val);
      sendMessage(val);
      setValue(val);
    };

    if (defaultValue !== null) {
      setVal(defaultValue);
    }

    const getVal = useCallback(
      async () => {
        const val = await storage.get(key);
        sendMessage(val);
        setValue(val);
        return val;
      },
      [key, storage, sendMessage],
    );

    const removeVal = async () => {
      await storage.remove(key);
      sendMessage(null);
      setValue(null);
    };

    useEffect(
      () => {
        const fetchValue = async () => {
          await storage.initialize();
          await getVal();
        };
        fetchValue();
      },
      [key, storage, getVal],
    );

    return [value, setVal, removeVal, getVal, storage];
  };

  return {
    useStorageForKey,
  };
};
