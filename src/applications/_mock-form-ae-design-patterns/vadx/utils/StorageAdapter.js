import React from 'react';
import PropTypes from 'prop-types';
import { StorageError } from './StorageError';

/**
 * @class StorageAdapter
 * @description Handles browser storage operations with IndexedDB primary and localStorage fallback.
 * TODO: Not sure if the fallback is needed anymore, simplify if not.
 */
export class StorageAdapter {
  /**
   * @param {!string} dbName - Database name
   * @param {!string} storeName - Object store name / used as prefix for writes to localStorage when IndexedDB is not supported
   * @param {number} [version=1] - DB Version number
   * @throws {StorageError} if dbName or storeName is not provided or is only spaces or empty strings
   */
  constructor(dbName, storeName, version = 1) {
    if (!dbName?.trim() || !storeName?.trim()) {
      throw new StorageError(
        'DB name and store name are required',
        'STORAGE_ADAPTER_INVALID_PARAMS',
      );
    }
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
    this.db = null;
    this.isIndexedDBSupported = StorageAdapter._checkIndexedDBSupport();
  }

  /**
   * @returns {boolean}
   * @private
   */
  static _checkIndexedDBSupport() {
    try {
      return 'indexedDB' in window && window.indexedDB !== null;
    } catch (e) {
      return false;
    }
  }

  /**
   * Initializes the storage adapter
   * Creates store in IndexedDB if it doesn't exist
   * TODO: support custom migrations during version updates
   * @returns {Promise<void>}
   */
  async initialize() {
    if (!this.isIndexedDBSupported) {
      // eslint-disable-next-line no-console
      console.warn('IndexedDB not supported, falling back to localStorage');
      return;
    }

    try {
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);

        request.onerror = () =>
          reject(
            new StorageError(
              'Failed to open database',
              'STORAGE_ADAPTER_DB_OPEN_ERROR',
            ),
          );

        request.onupgradeneeded = event => {
          const upgradedDb = event.target.result;
          if (!upgradedDb.objectStoreNames.contains(this.storeName)) {
            upgradedDb.createObjectStore(this.storeName);
          }
        };

        request.onsuccess = event => resolve(event.target.result);
      });

      this.db = db;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to initialize IndexedDB:', error);
      this.isIndexedDBSupported = false;
    }
  }

  /**
   * Sets a value in storage
   * @param {string} key
   * @param {*} value
   * @returns {Promise<void>}
   */
  async set(key, value) {
    if (!key?.trim()) {
      throw new StorageError('Key is required', 'STORAGE_ADAPTER_INVALID_KEY');
    }

    if (this.isIndexedDBSupported && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(value, key);

        request.onerror = () =>
          reject(
            new StorageError(
              'Failed to store data',
              'STORAGE_ADAPTER_WRITE_ERROR',
            ),
          );
        request.onsuccess = () => resolve();
      });
    }

    try {
      localStorage.setItem(`${this.storeName}-${key}`, JSON.stringify(value));
      return Promise.resolve();
    } catch (error) {
      throw new StorageError(
        'Failed to store data in localStorage',
        'STORAGE_ADAPTER_LOCALSTORAGE_ERROR',
      );
    }
  }

  /**
   * Gets a value from storage
   * @param {string} key
   * @returns {Promise<*>}
   */
  async get(key) {
    if (!key?.trim()) {
      throw new StorageError('Key is required', 'STORAGE_ADAPTER_INVALID_KEY');
    }

    if (this.isIndexedDBSupported && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);

        request.onerror = () =>
          reject(
            new StorageError(
              'Failed to retrieve data',
              'STORAGE_ADAPTER_READ_ERROR',
            ),
          );
        request.onsuccess = () => resolve(request.result);
      });
    }

    try {
      const value = localStorage.getItem(`${this.storeName}-${key}`);
      return Promise.resolve(value ? JSON.parse(value) : null);
    } catch (error) {
      throw new StorageError(
        'Failed to retrieve data from localStorage',
        'STORAGE_ADAPTER_LOCALSTORAGE_ERROR',
      );
    }
  }

  /**
   * Removes a value from storage
   * @param {!string} key
   * @returns {Promise<void>}
   */
  async remove(key) {
    if (!key?.trim()) {
      throw new StorageError('Key is required', 'STORAGE_ADAPTER_INVALID_KEY');
    }

    if (this.isIndexedDBSupported && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(key);

        request.onerror = () =>
          reject(
            new StorageError(
              'Failed to remove data',
              'STORAGE_ADAPTER_DELETE_ERROR',
            ),
          );
        request.onsuccess = () => resolve();
      });
    }

    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      throw new StorageError(
        'Failed to remove data from localStorage',
        'STORAGE_ADAPTER_LOCALSTORAGE_ERROR',
      );
    }
  }

  /**
   * Clears all data from storage
   * @returns {Promise<void>}
   */
  async clear() {
    if (this.isIndexedDBSupported && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();

        request.onerror = () =>
          reject(
            new StorageError(
              'Failed to clear data',
              'STORAGE_ADAPTER_CLEAR_ERROR',
            ),
          );
        request.onsuccess = () => resolve();
      });
    }

    try {
      // only clear data for this store in localStorage
      Object.keys(localStorage)
        .filter(key => key.startsWith(`${this.storeName}-`))
        .forEach(key => localStorage.removeItem(key));
      return Promise.resolve();
    } catch (error) {
      throw new StorageError(
        'Failed to clear localStorage',
        'STORAGE_ADAPTER_LOCALSTORAGE_ERROR',
      );
    }
  }

  /**
   * Closes indexedDB connection
   */
  close() {
    if (this.isIndexedDBSupported && this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Example Hook for using the storage adapter
// TODO: consider using a context provider instead of a hook
export const useStorage = (dbName, storeName, version = 1) => {
  const [adapter] = React.useState(
    () => new StorageAdapter(dbName, storeName, version),
  );

  React.useEffect(
    () => {
      adapter.initialize();
      return () => adapter.close();
    },
    [adapter],
  );

  return adapter;
};

// PropTypes for components using the storage adapter
export const StorageAdapterPropTypes = {
  storageAdapter: PropTypes.shape({
    initialize: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  }),
};
