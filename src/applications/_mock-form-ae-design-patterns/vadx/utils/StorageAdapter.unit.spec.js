import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup } from '@testing-library/react';
import { StorageAdapter } from './StorageAdapter';

describe('StorageAdapter', () => {
  let adapter;
  let indexedDBMock;
  let localStorageMock;
  const TEST_DB_NAME = 'testDB';
  const TEST_STORE_NAME = 'testStore';
  let sandbox;

  beforeEach(() => {
    // Create a sinon sandbox for test isolation
    sandbox = sinon.createSandbox();

    // Mock IndexedDB
    indexedDBMock = {
      open: sandbox.stub(),
    };

    // Mock localStorage
    localStorageMock = {
      getItem: sandbox.stub(),
      setItem: sandbox.stub(),
      removeItem: sandbox.stub(),
      clear: sandbox.stub(),
      length: 0,
      key: sandbox.stub(),
    };

    // Mock window object properties
    global.indexedDB = indexedDBMock;
    global.localStorage = localStorageMock;

    // Create fresh adapter instance
    adapter = new StorageAdapter(TEST_DB_NAME, TEST_STORE_NAME);
  });

  afterEach(() => {
    // Restore all sandbox stubs
    sandbox.restore();
    cleanup(); // Cleanup React testing library
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

    it('should initialize IndexedDB when supported', () => {
      return new Promise(resolve => {
        adapter.isIndexedDBSupported = true;
        const dbMock = {
          objectStoreNames: { contains: sandbox.stub().returns(true) },
          transaction: sandbox.stub(),
        };

        const openRequest = {
          onerror: null,
          onsuccess: e => e.target.result,
          onupgradeneeded: null,
        };

        indexedDBMock.open.returns(openRequest);

        // Start initialization
        const initPromise = adapter.initialize();

        // Simulate successful DB open in next tick
        process.nextTick(() => {
          openRequest.onsuccess({ target: { result: dbMock } });
        });

        // Wait for initialization to complete
        initPromise.then(() => {
          expect(adapter.db).to.deep.equal(dbMock);
          resolve();
        });
      });
    });

    it('should create object store if it does not exist', () => {
      return new Promise(resolve => {
        adapter.isIndexedDBSupported = true;

        const dbMock = {
          objectStoreNames: { contains: sandbox.stub().returns(false) },
          createObjectStore: sandbox.stub(),
        };

        const openRequest = {
          onerror: null,
          onsuccess: null,
          onupgradeneeded: null,
        };

        indexedDBMock.open.returns(openRequest);

        const initPromise = adapter.initialize();

        process.nextTick(() => {
          // simulate upgrade needed in next tick and success after upgrade
          openRequest.onupgradeneeded({ target: { result: dbMock } });
          openRequest.onsuccess({ target: { result: dbMock } });
        });

        initPromise.then(() => {
          // check that the object store was created once promise resolved
          expect(dbMock.createObjectStore.calledWith(TEST_STORE_NAME)).to.be
            .true;
          resolve();
        });
      });
    });
  });

  describe('storage operations with IndexedDB', () => {
    let dbMock;
    let storeMock;
    let transactionMock;

    beforeEach(async () => {
      storeMock = {
        put: sandbox.stub(),
        get: sandbox.stub(),
        delete: sandbox.stub(),
        clear: sandbox.stub(),
      };

      transactionMock = {
        objectStore: sandbox.stub().returns(storeMock),
      };

      dbMock = {
        transaction: sandbox.stub().returns(transactionMock),
        close: sandbox.stub(),
      };

      adapter.isIndexedDBSupported = true;
      adapter.db = dbMock;
    });

    describe('set()', () => {
      it('should throw error if key is not provided', async () => {
        try {
          await adapter.set();
          expect.fail('Should have thrown an error');
        } catch (error) {
          expect(error.message).to.equal('Key is required');
        }
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
        try {
          await adapter.set('testKey', { data: 'test' });
          expect.fail('Should have thrown an error');
        } catch (error) {
          expect(error.message).to.equal(
            'Failed to store data in localStorage',
          );
        }
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
        // a couple of items to be cleared and some that should not be cleared
        const items = {
          [`${TEST_STORE_NAME}-key1`]: 'value1',
          [`${TEST_STORE_NAME}-key2`]: 'value2',
          'otherStore-key3': 'value3',
          'otherStore-key4': 'value4',
        };

        // make sure localStorageMock has all the items that will be cleared
        Object.keys(items).forEach(key => {
          localStorageMock[key] = items[key];
        });

        await adapter.clear();

        expect(
          localStorageMock.removeItem.calledWith(`${TEST_STORE_NAME}-key1`),
        ).to.be.true;
        expect(
          localStorageMock.removeItem.calledWith(`${TEST_STORE_NAME}-key2`),
        ).to.be.true;
        expect(localStorageMock.removeItem.calledWith('otherStore-key3')).to.be
          .false;
        expect(localStorageMock.removeItem.calledWith('otherStore-key4')).to.be
          .false;
      });
    });
  });
});
