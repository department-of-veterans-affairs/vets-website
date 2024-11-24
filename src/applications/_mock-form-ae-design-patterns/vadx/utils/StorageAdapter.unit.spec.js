// storageAdapter.test.jsx
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, act } from '@testing-library/react';
import { StorageAdapter, useStorage } from './StorageAdapter';

describe('StorageAdapter', () => {
  let adapter;
  let indexedDBMock;
  let localStorageMock;
  const TEST_DB_NAME = 'testDB';
  const TEST_STORE_NAME = 'testStore';

  beforeEach(() => {
    // Mock IndexedDB
    indexedDBMock = {
      open: sinon.stub(),
    };

    // Mock localStorage
    localStorageMock = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
      removeItem: sinon.stub(),
      clear: sinon.stub(),
      length: 0,
      key: sinon.stub(),
    };

    // Mock window object properties
    global.indexedDB = indexedDBMock;
    global.localStorage = localStorageMock;

    // Create fresh adapter instance
    adapter = new StorageAdapter(TEST_DB_NAME, TEST_STORE_NAME);
  });

  afterEach(() => {
    sinon.restore.restore();
  });

  describe('constructor', () => {
    it('should throw error if dbName is not provided', () => {
      expect(() => new StorageAdapter()).to.throw(
        'DB name and store name are required',
      );
    });

    it('should throw error if storeName is not provided', () => {
      expect(() => new StorageAdapter('testDB')).to.throw(
        'DB name and store name are required',
      );
    });

    it('should throw error if dbName is empty string', () => {
      expect(() => new StorageAdapter('', 'testStore')).to.throw(
        'DB name and store name are required',
      );
    });

    it('should throw error if storeName is empty string', () => {
      expect(() => new StorageAdapter('testDB', '')).to.throw(
        'DB name and store name are required',
      );
    });

    it('should create instance with valid parameters', () => {
      const instance = new StorageAdapter('testDB', 'testStore');
      expect(instance.dbName).to.equal('testDB');
      expect(instance.storeName).to.equal('testStore');
      expect(instance.version).to.equal(1);
    });
  });

  describe('initialization', () => {
    it('should fall back to localStorage when IndexedDB is not supported', async () => {
      adapter.isIndexedDBSupported = false;
      await adapter.initialize();
      expect(adapter.db).to.be.null;
    });

    it('should initialize IndexedDB when supported', async () => {
      const dbMock = {
        objectStoreNames: { contains: sinon.stub().returns(true) },
        transaction: sinon.stub(),
      };

      const openRequest = {
        onerror: null,
        onsuccess: null,
        onupgradeneeded: null,
      };

      indexedDBMock.open.returns(openRequest);

      // Simulate successful DB open
      setTimeout(() => {
        openRequest.onsuccess({ target: { result: dbMock } });
      }, 0);

      await adapter.initialize();
      expect(adapter.db).to.equal(dbMock);
    });

    it('should create object store if it does not exist', async () => {
      const dbMock = {
        objectStoreNames: { contains: sinon.stub().returns(false) },
        createObjectStore: sinon.stub(),
      };

      const openRequest = {
        onerror: null,
        onsuccess: null,
        onupgradeneeded: null,
      };

      indexedDBMock.open.returns(openRequest);

      // Simulate upgrade needed
      setTimeout(() => {
        openRequest.onupgradeneeded({ target: { result: dbMock } });
      }, 0);

      await adapter.initialize();
      expect(dbMock.createObjectStore.calledWith(TEST_STORE_NAME)).to.be.true;
    });
  });

  describe('storage operations with IndexedDB', () => {
    let dbMock;
    let storeMock;
    let transactionMock;

    beforeEach(async () => {
      storeMock = {
        put: sinon.stub(),
        get: sinon.stub(),
        delete: sinon.stub(),
        clear: sinon.stub(),
      };

      transactionMock = {
        objectStore: sinon.stub().returns(storeMock),
      };

      dbMock = {
        transaction: sinon.stub().returns(transactionMock),
        close: sinon.stub(),
      };

      adapter.isIndexedDBSupported = true;
      adapter.db = dbMock;
    });

    describe('set()', () => {
      it('should throw error if key is not provided', async () => {
        await expect(adapter.set()).to.be.rejectedWith('Key is required');
      });

      it('should store value in IndexedDB', async () => {
        const request = {
          onerror: null,
          onsuccess: null,
        };

        storeMock.put.returns(request);

        setTimeout(() => {
          request.onsuccess();
        }, 0);

        await adapter.set('testKey', { data: 'test' });
        expect(storeMock.put.calledWith({ data: 'test' }, 'testKey')).to.be
          .true;
      });

      it('should handle storage errors', async () => {
        const request = {
          onerror: null,
          onsuccess: null,
        };

        storeMock.put.returns(request);

        setTimeout(() => {
          request.onerror();
        }, 0);

        await expect(
          adapter.set('testKey', { data: 'test' }),
        ).to.be.rejectedWith('Failed to store data');
      });
    });

    describe('get()', () => {
      it('should throw error if key is not provided', async () => {
        await expect(adapter.get()).to.be.rejectedWith('Key is required');
      });

      it('should retrieve value from IndexedDB', async () => {
        const request = {
          onerror: null,
          onsuccess: null,
          result: { data: 'test' },
        };

        storeMock.get.returns(request);

        setTimeout(() => {
          request.onsuccess();
        }, 0);

        const result = await adapter.get('testKey');
        expect(result).to.deep.equal({ data: 'test' });
      });

      it('should handle retrieval errors', async () => {
        const request = {
          onerror: null,
          onsuccess: null,
        };

        storeMock.get.returns(request);

        setTimeout(() => {
          request.onerror();
        }, 0);

        await expect(adapter.get('testKey')).to.be.rejectedWith(
          'Failed to retrieve data',
        );
      });
    });

    describe('remove()', () => {
      it('should throw error if key is not provided', async () => {
        await expect(adapter.remove()).to.be.rejectedWith('Key is required');
      });

      it('should remove value from IndexedDB', async () => {
        const request = {
          onerror: null,
          onsuccess: null,
        };

        storeMock.delete.returns(request);

        setTimeout(() => {
          request.onsuccess();
        }, 0);

        await adapter.remove('testKey');
        expect(storeMock.delete.calledWith('testKey')).to.be.true;
      });
    });

    describe('clear()', () => {
      it('should clear all values from IndexedDB store', async () => {
        const request = {
          onerror: null,
          onsuccess: null,
        };

        storeMock.clear.returns(request);

        setTimeout(() => {
          request.onsuccess();
        }, 0);

        await adapter.clear();
        expect(storeMock.clear.called).to.be.true;
      });
    });
  });

  describe('storage operations with localStorage fallback', () => {
    beforeEach(() => {
      adapter.isIndexedDBSupported = false;
      adapter.db = null;
    });

    describe('set()', () => {
      it('should store value in localStorage with proper prefix', async () => {
        await adapter.set('testKey', { data: 'test' });
        expect(
          localStorageMock.setItem.calledWith(
            `${TEST_STORE_NAME}-testKey`,
            JSON.stringify({ data: 'test' }),
          ),
        ).to.be.true;
      });

      it('should handle localStorage errors', async () => {
        localStorageMock.setItem.throws(new Error('Storage full'));
        await expect(
          adapter.set('testKey', { data: 'test' }),
        ).to.be.rejectedWith('Failed to store data in localStorage');
      });
    });

    describe('get()', () => {
      it('should retrieve value from localStorage with proper prefix', async () => {
        localStorageMock.getItem.returns(JSON.stringify({ data: 'test' }));
        const result = await adapter.get('testKey');
        expect(
          localStorageMock.getItem.calledWith(`${TEST_STORE_NAME}-testKey`),
        ).to.be.true;
        expect(result).to.deep.equal({ data: 'test' });
      });

      it('should return null for non-existent keys', async () => {
        localStorageMock.getItem.returns(null);
        const result = await adapter.get('nonexistentKey');
        expect(result).to.be.null;
      });
    });

    describe('clear()', () => {
      it('should only clear values with matching prefix', async () => {
        // Setup mock localStorage items
        const items = {
          [`${TEST_STORE_NAME}-key1`]: 'value1',
          [`${TEST_STORE_NAME}-key2`]: 'value2',
          'otherStore-key3': 'value3',
        };
        Object.keys(items).forEach(key =>
          localStorageMock.key.withArgs(sinon.match.number).returns(key),
        );
        localStorageMock.length = Object.keys(items).length;

        await adapter.clear();

        // Should only remove items with matching prefix
        expect(
          localStorageMock.removeItem.calledWith(`${TEST_STORE_NAME}-key1`),
        ).to.be.true;
        expect(
          localStorageMock.removeItem.calledWith(`${TEST_STORE_NAME}-key2`),
        ).to.be.true;
        expect(localStorageMock.removeItem.calledWith('otherStore-key3')).to.be
          .false;
      });
    });
  });
});

describe('useStorage hook', () => {
  it('should initialize and close adapter', () => {
    const TestComponent = () => {
      useStorage('testDB', 'testStore');
      return null;
    };

    const adapter = new StorageAdapter('testDB', 'testStore');
    const initializeSpy = sinon.spy(adapter, 'initialize');
    const closeSpy = sinon.spy(adapter, 'close');

    sinon.stub(React, 'useState').returns([adapter]);

    render(<TestComponent />);

    expect(initializeSpy.calledOnce).to.be.true;

    // Cleanup
    act(() => {
      // Trigger useEffect cleanup
      React.useEffect.mock.calls[0][0]();
    });

    expect(closeSpy.calledOnce).to.be.true;
  });
});
