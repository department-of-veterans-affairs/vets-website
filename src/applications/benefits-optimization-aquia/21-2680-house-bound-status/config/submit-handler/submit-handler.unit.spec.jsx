/**
 * @module config/submit-handler.unit.spec
 * @description Unit tests for custom submit handler
 */

import { expect } from 'chai';
import sinon from 'sinon';
import { submitForm } from './submit-handler';
import { MockFileReaderSuccess, MockFileReaderError } from './test-mocks';

describe('submitForm', () => {
  let sandbox;
  let fetchStub;
  let consoleErrorStub;
  let localStorageGetItemStub;
  let originalFileReader;
  let sessionStorageDescriptor;
  let localStorageDescriptor;

  const mockFormConfig = {
    submitUrl: 'http://localhost:3000/v0/form212680/download_pdf',
    transformForSubmit: sinon.stub().returns('{"form": "data"}'),
  };

  const mockForm = {
    data: {
      veteranInformation: { veteranFullName: { first: 'John', last: 'Doe' } },
    },
  };

  beforeEach(() => {
    // Create sandbox for proper cleanup
    sandbox = sinon.createSandbox();

    // Stub fetch
    fetchStub = sandbox.stub(global, 'fetch');

    // Stub console.error
    consoleErrorStub = sandbox.stub(console, 'error');

    // Store original localStorage descriptor
    localStorageDescriptor = Object.getOwnPropertyDescriptor(
      global,
      'localStorage',
    );

    // Mock localStorage using defineProperty for Node 22 compatibility
    localStorageGetItemStub = sandbox.stub();
    const mockLocalStorage = {
      getItem: localStorageGetItemStub,
      setItem: sandbox.stub(),
      removeItem: sandbox.stub(),
      clear: sandbox.stub(),
      key: sandbox.stub(),
      get length() {
        return 0;
      },
    };
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });
    // Default return value for CSRF token
    localStorageGetItemStub.withArgs('csrfToken').returns('default-csrf-token');

    // Store original sessionStorage descriptor
    sessionStorageDescriptor = Object.getOwnPropertyDescriptor(
      global,
      'sessionStorage',
    );

    // Create complete sessionStorage mock using defineProperty for Node 22 compatibility
    const mockSessionStorage = {
      setItem: sandbox.stub(),
      getItem: sandbox.stub(),
      removeItem: sandbox.stub(),
      clear: sandbox.stub(),
      key: sandbox.stub(),
      get length() {
        return 0;
      },
    };
    Object.defineProperty(global, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true,
      configurable: true,
    });

    // Store original FileReader
    originalFileReader = global.FileReader;

    // Set up FileReader for each test
    global.FileReader = MockFileReaderSuccess;
  });

  afterEach(() => {
    // Restore all sandbox stubs
    sandbox.restore();

    // Restore original sessionStorage descriptor
    if (sessionStorageDescriptor) {
      Object.defineProperty(global, 'sessionStorage', sessionStorageDescriptor);
    } else {
      delete global.sessionStorage;
    }

    // Restore original localStorage descriptor
    if (localStorageDescriptor) {
      Object.defineProperty(global, 'localStorage', localStorageDescriptor);
    } else {
      delete global.localStorage;
    }

    // Restore original FileReader
    global.FileReader = originalFileReader;

    // Reset transform stub
    mockFormConfig.transformForSubmit.reset();
  });

  describe('Successful Submission', () => {
    it('should successfully submit form and return proper response', async () => {
      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      const result = await submitForm(mockForm, mockFormConfig);

      // Verify fetch was called correctly
      expect(fetchStub.calledOnce).to.be.true;
      expect(fetchStub.firstCall.args[0]).to.equal(mockFormConfig.submitUrl);
      expect(fetchStub.firstCall.args[1]).to.deep.include({
        method: 'POST',
        credentials: 'include',
      });
      expect(fetchStub.firstCall.args[1].headers['Content-Type']).to.equal(
        'application/json',
      );
      expect(fetchStub.firstCall.args[1].headers['X-Key-Inflection']).to.equal(
        'camel',
      );
      expect(fetchStub.firstCall.args[1].body).to.equal('{"form": "data"}');

      // Verify transform was called
      expect(mockFormConfig.transformForSubmit.calledOnce).to.be.true;
      expect(
        mockFormConfig.transformForSubmit.calledWith(mockFormConfig, mockForm),
      ).to.be.true;

      // Verify response structure
      expect(result).to.have.property('data');
      expect(result.data).to.have.property('id', 'pdf-download');
      expect(result.data).to.have.property('type', 'saved_claims');
      expect(result.data.attributes).to.have.property('guid', 'pdf-blob');
      expect(result.data.attributes).to.have.property('confirmationNumber');
      expect(result.data.attributes.confirmationNumber).to.match(
        /^21-2680-\d+$/,
      );
      expect(result.data.attributes).to.have.property('submittedAt');

      // Verify sessionStorage was called (after FileReader completes)
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(global.sessionStorage.setItem.calledOnce).to.be.true;
      expect(global.sessionStorage.setItem.calledWith('form-21-2680-pdf-blob'))
        .to.be.true;
    });

    it('should store blob as data URL in sessionStorage', async () => {
      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      await submitForm(mockForm, mockFormConfig);

      // Wait for FileReader to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(global.sessionStorage.setItem.calledOnce).to.be.true;
      const [key, value] = global.sessionStorage.setItem.firstCall.args;
      expect(key).to.equal('form-21-2680-pdf-blob');
      expect(value).to.be.a('string');
      expect(value).to.include('data:');
    });

    it('should generate unique confirmation numbers for each submission', async () => {
      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      const result1 = await submitForm(mockForm, mockFormConfig);
      const result2 = await submitForm(mockForm, mockFormConfig);

      expect(result1.data.attributes.confirmationNumber).to.not.equal(
        result2.data.attributes.confirmationNumber,
      );
    });
  });

  describe('Failed Submission', () => {
    it('should throw error when response is not ok', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };

      fetchStub.resolves(mockResponse);

      try {
        await submitForm(mockForm, mockFormConfig);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Submission failed with status: 500');
        expect(consoleErrorStub.calledOnce).to.be.true;
      }
    });

    it('should throw error when response status is 400', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
      };

      fetchStub.resolves(mockResponse);

      try {
        await submitForm(mockForm, mockFormConfig);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Submission failed with status: 400');
      }
    });

    it('should throw error when response status is 404', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      };

      fetchStub.resolves(mockResponse);

      try {
        await submitForm(mockForm, mockFormConfig);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Submission failed with status: 404');
      }
    });
  });

  describe('Network Errors', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      fetchStub.rejects(networkError);

      try {
        await submitForm(mockForm, mockFormConfig);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Network error');
        expect(consoleErrorStub.calledOnce).to.be.true;
        expect(consoleErrorStub.firstCall.args[0]).to.equal(
          'Form submission error:',
        );
      }
    });

    it('should handle fetch timeout', async () => {
      const timeoutError = new Error('Request timeout');
      fetchStub.rejects(timeoutError);

      try {
        await submitForm(mockForm, mockFormConfig);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Request timeout');
      }
    });
  });

  describe('Blob Processing Errors', () => {
    it('should handle blob() method failure', async () => {
      const blobError = new Error('Failed to read blob');
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().rejects(blobError),
      };

      fetchStub.resolves(mockResponse);

      try {
        await submitForm(mockForm, mockFormConfig);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Failed to read blob');
        expect(consoleErrorStub.calledOnce).to.be.true;
      }
    });

    it('should handle FileReader error', async () => {
      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      // Override FileReader to simulate error
      global.FileReader = MockFileReaderError;

      try {
        await submitForm(mockForm, mockFormConfig);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('FileReader error');
        expect(consoleErrorStub.calledOnce).to.be.true;
      }
    });
  });

  describe('Request Headers', () => {
    it('should include credentials: include for authentication', async () => {
      localStorageGetItemStub.returns('mock-csrf-token');

      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      await submitForm(mockForm, mockFormConfig);

      expect(fetchStub.firstCall.args[1].credentials).to.equal('include');
    });

    it('should include Content-Type: application/json header', async () => {
      localStorageGetItemStub.returns('mock-csrf-token');

      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      await submitForm(mockForm, mockFormConfig);

      expect(fetchStub.firstCall.args[1].headers['Content-Type']).to.equal(
        'application/json',
      );
    });

    it('should include X-Key-Inflection: camel header', async () => {
      localStorageGetItemStub.returns('mock-csrf-token');

      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      await submitForm(mockForm, mockFormConfig);

      expect(fetchStub.firstCall.args[1].headers['X-Key-Inflection']).to.equal(
        'camel',
      );
    });

    it('should include X-CSRF-Token header from localStorage', async () => {
      const mockCsrfToken = 'test-csrf-token-12345';

      // Reset and set specific return value
      localStorageGetItemStub.reset();
      localStorageGetItemStub.withArgs('csrfToken').returns(mockCsrfToken);

      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      await submitForm(mockForm, mockFormConfig);

      // Verify localStorage.getItem was called with 'csrfToken'
      expect(localStorageGetItemStub.calledOnce).to.be.true;
      expect(localStorageGetItemStub.calledWith('csrfToken')).to.be.true;

      // Verify X-CSRF-Token header is set with the token from localStorage
      expect(fetchStub.firstCall.args[1].headers['X-CSRF-Token']).to.equal(
        mockCsrfToken,
      );
    });

    it('should handle missing CSRF token gracefully', async () => {
      // Reset and return null when CSRF token is not in localStorage
      localStorageGetItemStub.reset();
      localStorageGetItemStub.withArgs('csrfToken').returns(null);

      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      await submitForm(mockForm, mockFormConfig);

      // Verify localStorage.getItem was called
      expect(localStorageGetItemStub.calledWith('csrfToken')).to.be.true;

      // Verify X-CSRF-Token header is set even if null
      expect(fetchStub.firstCall.args[1].headers['X-CSRF-Token']).to.equal(
        null,
      );
    });

    it('should send all required headers together', async () => {
      const mockCsrfToken = 'combined-test-csrf-token';

      // Reset and set specific return value
      localStorageGetItemStub.reset();
      localStorageGetItemStub.withArgs('csrfToken').returns(mockCsrfToken);

      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      await submitForm(mockForm, mockFormConfig);

      const { headers } = fetchStub.firstCall.args[1];

      // Verify all required headers are present
      expect(headers).to.deep.include({
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'X-CSRF-Token': mockCsrfToken,
      });
    });
  });

  describe('Data Transformation', () => {
    it('should call transformForSubmit with correct arguments', async () => {
      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      await submitForm(mockForm, mockFormConfig);

      expect(mockFormConfig.transformForSubmit.calledOnce).to.be.true;
      expect(mockFormConfig.transformForSubmit.firstCall.args[0]).to.equal(
        mockFormConfig,
      );
      expect(mockFormConfig.transformForSubmit.firstCall.args[1]).to.equal(
        mockForm,
      );
    });

    it('should send transformed data in request body', async () => {
      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);
      mockFormConfig.transformForSubmit.returns('{"custom": "transformed"}');

      await submitForm(mockForm, mockFormConfig);

      expect(fetchStub.firstCall.args[1].body).to.equal(
        '{"custom": "transformed"}',
      );
    });
  });

  describe('Response Format', () => {
    it('should return data with correct structure', async () => {
      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      const result = await submitForm(mockForm, mockFormConfig);

      expect(result).to.be.an('object');
      expect(result).to.have.property('data');
    });

    it('should return data.attributes with guid set to pdf-blob', async () => {
      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      const result = await submitForm(mockForm, mockFormConfig);

      expect(result.data.attributes.guid).to.equal('pdf-blob');
    });

    it('should return data.attributes with valid ISO timestamp', async () => {
      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      const result = await submitForm(mockForm, mockFormConfig);

      const timestamp = result.data.attributes.submittedAt;
      expect(timestamp).to.be.a('string');
      expect(new Date(timestamp).toISOString()).to.equal(timestamp);
    });

    it('should return data with type saved_claims', async () => {
      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      const result = await submitForm(mockForm, mockFormConfig);

      expect(result.data.type).to.equal('saved_claims');
    });

    it('should return data with id pdf-download', async () => {
      const mockBlob = new Blob(['mock pdf content'], {
        type: 'application/pdf',
      });
      const mockResponse = {
        ok: true,
        status: 200,
        blob: sinon.stub().resolves(mockBlob),
      };

      fetchStub.resolves(mockResponse);

      const result = await submitForm(mockForm, mockFormConfig);

      expect(result.data.id).to.equal('pdf-download');
    });
  });

  describe('Error Logging', () => {
    it('should log errors to console', async () => {
      const mockError = new Error('Test error');
      fetchStub.rejects(mockError);

      try {
        await submitForm(mockForm, mockFormConfig);
      } catch (error) {
        // Expected to throw
      }

      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(consoleErrorStub.firstCall.args[0]).to.equal(
        'Form submission error:',
      );
      expect(consoleErrorStub.firstCall.args[1]).to.equal(mockError);
    });

    it('should not suppress errors after logging', async () => {
      const mockError = new Error('Test error');
      fetchStub.rejects(mockError);

      let caughtError;
      try {
        await submitForm(mockForm, mockFormConfig);
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).to.equal(mockError);
    });
  });
});
