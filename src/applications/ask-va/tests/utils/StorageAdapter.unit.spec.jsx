import { cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { StorageAdapter } from '../../utils/StorageAdapter';

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
    adapter = new StorageAdapter(TEST_DB_NAME, TEST_STORE_NAME);
  });

  afterEach(() => {
    sandbox.restore();
    cleanup();
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

    it('should throw error if dbName contains only spaces', () => {
      expect(() => new StorageAdapter('   ', 'testStore')).to.throw(
        'DB name and store name are required',
      );
    });

    it('should throw error if storeName contains only spaces', () => {
      expect(() => new StorageAdapter('testDB', '   ')).to.throw(
        'DB name and store name are required',
      );
    });

    it('should create instance with valid parameters', () => {
      const instance = new StorageAdapter('testDB', 'testStore');
      expect(instance.dbName).to.equal('testDB');
      expect(instance.storeName).to.equal('testStore');
      expect(instance.version).to.equal(1);
    });

    it('should accept custom version number', () => {
      const instance = new StorageAdapter('testDB', 'testStore', 2);
      expect(instance.version).to.equal(2);
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
          onsuccess: null,
          onupgradeneeded: null,
        };

        indexedDBMock.open.returns(openRequest);

        const initPromise = adapter.initialize();

        process.nextTick(() => {
          openRequest.onsuccess({ target: { result: dbMock } });
        });

        initPromise.then(() => {
          expect(adapter.db).to.deep.equal(dbMock);
          resolve();
        });
      });
    });

    it('should handle initialization error', () => {
      const openRequest = {
        onerror: null,
        onsuccess: null,
        onupgradeneeded: null,
      };

      indexedDBMock.open.returns(openRequest);

      const initPromise = adapter.initialize();

      // Trigger error immediately
      openRequest.onerror(new Error('Failed to open database'));

      return expect(initPromise).to.eventually.be.undefined;
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
          openRequest.onupgradeneeded({ target: { result: dbMock } });
          openRequest.onsuccess({ target: { result: dbMock } });
        });

        initPromise.then(() => {
          expect(dbMock.createObjectStore.calledWith(TEST_STORE_NAME)).to.be
            .true;
          resolve();
        });
      });
    });

    it('should not create object store if it already exists', () => {
      return new Promise(resolve => {
        const dbMock = {
          objectStoreNames: { contains: sandbox.stub().returns(true) },
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
          openRequest.onupgradeneeded({ target: { result: dbMock } });
          openRequest.onsuccess({ target: { result: dbMock } });
        });

        initPromise.then(() => {
          expect(dbMock.createObjectStore.called).to.be.false;
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
        await expect(adapter.set()).to.be.rejectedWith('Key is required');
      });

      it('should throw error if key is empty string', async () => {
        await expect(adapter.set('')).to.be.rejectedWith('Key is required');
      });

      it('should throw error if key contains only spaces', async () => {
        await expect(adapter.set('   ')).to.be.rejectedWith('Key is required');
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

      it('should handle storage error', async () => {
        const request = {
          onerror: null,
          onsuccess: null,
        };

        storeMock.put.returns(request);

        setTimeout(() => {
          request.onerror(new Error('Failed to store data'));
        }, 0);

        await expect(
          adapter.set('testKey', { data: 'test' }),
        ).to.be.rejectedWith('Failed to store data');
      });

      it('should initialize db if not initialized', async () => {
        adapter.db = null;

        // Setup initialize to set the db and return
        const initializeStub = sandbox
          .stub(adapter, 'initialize')
          .callsFake(async () => {
            adapter.db = dbMock;
          });

        const request = {};
        Object.defineProperty(request, 'onsuccess', {
          set(cb) {
            process.nextTick(() => cb.call(this));
          },
        });

        storeMock.put.returns(request);

        await adapter.set('testKey', { data: 'test' });
        expect(initializeStub.calledOnce).to.be.true;
      });
    });

    describe('get()', () => {
      it('should throw error if key is not provided', async () => {
        await expect(adapter.get()).to.be.rejectedWith('Key is required');
      });

      it('should throw error if key is empty string', async () => {
        await expect(adapter.get('')).to.be.rejectedWith('Key is required');
      });

      it('should throw error if key contains only spaces', async () => {
        await expect(adapter.get('   ')).to.be.rejectedWith('Key is required');
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

      it('should handle retrieval error', async () => {
        const request = {
          onerror: null,
          onsuccess: null,
        };

        storeMock.get.returns(request);

        setTimeout(() => {
          request.onerror(new Error('Failed to retrieve data'));
        }, 0);

        await expect(adapter.get('testKey')).to.be.rejectedWith(
          'Failed to retrieve data',
        );
      });

      it('should return null if db is not initialized', async () => {
        adapter.db = null;
        const result = await adapter.get('testKey');
        expect(result).to.be.null;
      });
    });

    describe('remove()', () => {
      it('should throw error if key is not provided', async () => {
        await expect(adapter.remove()).to.be.rejectedWith('Key is required');
      });

      it('should throw error if key is empty string', async () => {
        await expect(adapter.remove('')).to.be.rejectedWith('Key is required');
      });

      it('should throw error if key contains only spaces', async () => {
        await expect(adapter.remove('   ')).to.be.rejectedWith(
          'Key is required',
        );
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

      it('should handle removal error', async () => {
        const request = {
          onerror: null,
          onsuccess: null,
        };

        storeMock.delete.returns(request);

        setTimeout(() => {
          request.onerror(new Error('Failed to remove data'));
        }, 0);

        await expect(adapter.remove('testKey')).to.be.rejectedWith(
          'Failed to remove data',
        );
      });

      it('should initialize db if not initialized', async () => {
        adapter.db = null;

        // Setup initialize to set the db and return
        const initializeStub = sandbox
          .stub(adapter, 'initialize')
          .callsFake(async () => {
            adapter.db = dbMock;
          });

        const request = {};
        Object.defineProperty(request, 'onsuccess', {
          set(cb) {
            process.nextTick(() => cb.call(this));
          },
        });

        storeMock.delete.returns(request);

        await adapter.remove('testKey');
        expect(initializeStub.calledOnce).to.be.true;
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

      it('should handle clear error', async () => {
        const request = {
          onerror: null,
          onsuccess: null,
        };

        storeMock.clear.returns(request);

        setTimeout(() => {
          request.onerror(new Error('Failed to clear data'));
        }, 0);

        await expect(adapter.clear()).to.be.rejectedWith(
          'Failed to clear data',
        );
      });

      it('should initialize db if not initialized', async () => {
        adapter.db = null;

        // Setup initialize to set the db and return
        const initializeStub = sandbox
          .stub(adapter, 'initialize')
          .callsFake(async () => {
            adapter.db = dbMock;
          });

        const request = {};
        Object.defineProperty(request, 'onsuccess', {
          set(cb) {
            process.nextTick(() => cb.call(this));
          },
        });

        storeMock.clear.returns(request);

        await adapter.clear();
        expect(initializeStub.calledOnce).to.be.true;
      });
    });

    describe('close()', () => {
      it('should close db connection if open', () => {
        adapter.close();
        expect(dbMock.close.called).to.be.true;
        expect(adapter.db).to.be.null;
      });

      it('should handle when db is already closed', () => {
        adapter.db = null;
        adapter.close();
        expect(dbMock.close.called).to.be.false;
      });
    });
  });
});
