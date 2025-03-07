import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup } from '@testing-library/react';
import { StorageAdapter } from './StorageAdapter';

describe('StorageAdapter', () => {
  let adapter;
  let indexedDBMock;
  const TEST_DB_NAME = 'testDB';
  const TEST_STORE_NAME = 'testStore';
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    indexedDBMock = {
      open: sandbox.stub(),
    };

    global.indexedDB = indexedDBMock;

    // Create fresh adapter instance otherwise the tests are affected by previous tests
    adapter = new StorageAdapter(TEST_DB_NAME, TEST_STORE_NAME);
  });

  afterEach(() => {
    sandbox.restore();
    cleanup(); // Cleanup React testing library added just in case @testing-library/react acts up
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
    it('should initialize IndexedDB', () => {
      return new Promise(resolve => {
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
});
