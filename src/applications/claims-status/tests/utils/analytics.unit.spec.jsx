import { expect } from 'chai';
import {
  generateDocInstanceId,
  storeUploadAttempt,
  storeFailedUpload,
  checkIfRetry,
  clearUploadTracking,
  recordType2FailureEvent,
  recordUploadStartEvent,
  recordUploadFailureEvent,
  recordUploadSuccessEvent,
  recordUploadCancelEvent,
} from '../../utils/analytics';

describe('analytics helpers', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test (jsdom provides sessionStorage)
    sessionStorage.clear();
    // Clear dataLayer before each test
    window.dataLayer = [];
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  // Test data constants
  const TEST_CLAIM_ID = 'claim-123';
  const TEST_CLAIM_ID_2 = 'claim-456';
  const TEST_DOC_INSTANCE_ID = 'test-id-1';
  const TEST_DOC_INSTANCE_ID_2 = 'test-id-2';
  const TEST_DOC_TYPE = 'L023';
  const TEST_DOC_TYPE_2 = 'L034';
  const TEST_TIMESTAMP_1 = 1700000000000;
  const TEST_TIMESTAMP_2 = 1700001000000;

  // Helper functions
  const createTestFile = (
    name = 'test.pdf',
    timestamp = TEST_TIMESTAMP_1,
    content = 'content',
  ) => {
    return new File([content], name, {
      type: 'application/pdf',
      lastModified: timestamp,
    });
  };
  const createFingerprint = file => {
    return `pdf_${file.size}_${file.lastModified}`;
  };
  const getStoredAttempts = () => {
    const raw = sessionStorage.getItem('cst_upload_attempts');
    if (!raw) return {};

    const parsed = JSON.parse(raw);

    return parsed.data || {};
  };
  const getStoredFailures = () => {
    const raw = sessionStorage.getItem('cst_failed_uploads');
    if (!raw) return {};

    const parsed = JSON.parse(raw);

    return parsed.data || {};
  };
  const createUploadParams = (overrides = {}) => {
    return {
      docInstanceId: TEST_DOC_INSTANCE_ID,
      file: createTestFile(),
      docType: TEST_DOC_TYPE,
      claimId: TEST_CLAIM_ID,
      ...overrides,
    };
  };

  describe('generateDocInstanceId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateDocInstanceId();
      const id2 = generateDocInstanceId();

      expect(id1).to.be.a('string');
      expect(id2).to.be.a('string');
      expect(id1).to.not.equal(id2);
    });
  });

  describe('storeUploadAttempt', () => {
    it('should store the first upload attempt in sessionStorage', () => {
      const file = createTestFile();
      const params = createUploadParams({ file });

      storeUploadAttempt(params);

      const stored = getStoredAttempts();
      const fingerprint = createFingerprint(file);

      expect(stored[TEST_CLAIM_ID][fingerprint]).to.exist;
      expect(stored[TEST_CLAIM_ID][fingerprint].attempts).to.equal(1);
    });

    it('should increment attempt count for retry uploads', () => {
      const file = createTestFile();
      const params = createUploadParams({ file });

      storeUploadAttempt(params);
      storeUploadAttempt({ ...params, docInstanceId: TEST_DOC_INSTANCE_ID_2 });

      const stored = getStoredAttempts();
      const fingerprint = createFingerprint(file);

      expect(stored[TEST_CLAIM_ID][fingerprint].attempts).to.equal(2);
    });

    it('should use timestamp 0 when file.lastModified is undefined', () => {
      // Create a file and manually remove lastModified to simulate edge case
      const file = createTestFile();
      Object.defineProperty(file, 'lastModified', { value: undefined });

      // Should still work with fallback to 0
      storeUploadAttempt(createUploadParams({ file }));

      const stored = getStoredAttempts();
      // Fingerprint should use 0 for timestamp
      const expectedFingerprint = `pdf_${file.size}_0`;

      expect(stored[TEST_CLAIM_ID][expectedFingerprint]).to.exist;
      expect(stored[TEST_CLAIM_ID][expectedFingerprint].attempts).to.equal(1);
    });
  });

  describe('storeFailedUpload', () => {
    it('should store a failed upload in sessionStorage', () => {
      const file = createTestFile();
      const params = createUploadParams({
        file,
        errorCode: 'DOC_UPLOAD_DUPLICATE',
      });

      storeFailedUpload(params);

      const stored = getStoredFailures();
      const fingerprint = createFingerprint(file);

      expect(stored[TEST_CLAIM_ID][fingerprint]).to.exist;
      expect(stored[TEST_CLAIM_ID][fingerprint].errorCode).to.equal(
        'DOC_UPLOAD_DUPLICATE',
      );
    });

    it('should store multiple failures for the same claim', () => {
      const file1 = createTestFile('file1.pdf', TEST_TIMESTAMP_1);
      const file2 = createTestFile('file2.pdf', TEST_TIMESTAMP_2);

      // Store first failure
      storeFailedUpload(
        createUploadParams({ file: file1, errorCode: 'ERROR_1' }),
      );

      // Store second failure for same claim
      storeFailedUpload(
        createUploadParams({
          file: file2,
          docInstanceId: TEST_DOC_INSTANCE_ID_2,
          errorCode: 'ERROR_2',
        }),
      );

      const storedFailures = getStoredFailures();
      const fingerprint1 = createFingerprint(file1);
      const fingerprint2 = createFingerprint(file2);

      expect(storedFailures[TEST_CLAIM_ID][fingerprint1].errorCode).to.equal(
        'ERROR_1',
      );
      expect(storedFailures[TEST_CLAIM_ID][fingerprint2].errorCode).to.equal(
        'ERROR_2',
      );
    });
  });

  describe('checkIfRetry', () => {
    it('should return false for first upload attempt', () => {
      const file = createTestFile();
      const result = checkIfRetry(file, TEST_CLAIM_ID);

      expect(result.isRetry).to.be.false;
      expect(result.retryCount).to.equal(0);
      expect(result.previousDocInstanceId).to.be.null;
    });

    it('should detect retry attempts', () => {
      const file = createTestFile();
      // Store initial attempt
      storeUploadAttempt(createUploadParams({ file }));
      // Check for retry
      const result = checkIfRetry(file, TEST_CLAIM_ID);

      expect(result.isRetry).to.be.true;
      expect(result.retryCount).to.equal(1);
      expect(result.previousDocInstanceId).to.equal(TEST_DOC_INSTANCE_ID);
    });

    it('should not detect retry for different files with same size', () => {
      const file1 = createTestFile('medical.pdf', TEST_TIMESTAMP_1);
      const file2 = createTestFile('dental.pdf', TEST_TIMESTAMP_2);
      // Store first file
      storeUploadAttempt(createUploadParams({ file: file1 }));
      // Check if second file (same size, different timestamp) is detected as retry
      const result = checkIfRetry(file2, TEST_CLAIM_ID);
      // Should NOT be detected as retry because timestamps differ
      expect(result.isRetry).to.be.false;
      expect(result.retryCount).to.equal(0);
    });

    it('should return default values and not throw when sessionStorage contains invalid JSON', () => {
      // Store invalid JSON in sessionStorage
      sessionStorage.setItem('cst_upload_attempts', 'invalid{json');

      const file = createTestFile();
      const result = checkIfRetry(file, TEST_CLAIM_ID);

      // Should return default values instead of throwing
      expect(result.isRetry).to.be.false;
      expect(result.retryCount).to.equal(0);
      expect(result.previousDocInstanceId).to.be.null;
    });
  });

  describe('clearUploadTracking', () => {
    it('should clear tracking data for a specific claim', () => {
      const file = createTestFile();
      // Store some data
      storeUploadAttempt(createUploadParams({ file }));
      storeFailedUpload(createUploadParams({ file, errorCode: 'Unknown' }));
      // Clear tracking
      clearUploadTracking(TEST_CLAIM_ID);
      // Verify cleared
      const result = checkIfRetry(file, TEST_CLAIM_ID);

      expect(result.isRetry).to.be.false;
    });

    it('should not affect other claims', () => {
      const file = createTestFile();
      // Store data for two claims
      storeUploadAttempt(createUploadParams({ file }));
      storeUploadAttempt(
        createUploadParams({
          file,
          docInstanceId: TEST_DOC_INSTANCE_ID_2,
          claimId: TEST_CLAIM_ID_2,
        }),
      );
      // Clear only one claim
      clearUploadTracking(TEST_CLAIM_ID);
      // Verify claim-123 is cleared but claim-456 remains
      const result123 = checkIfRetry(file, TEST_CLAIM_ID);
      const result456 = checkIfRetry(file, TEST_CLAIM_ID_2);

      expect(result123.isRetry).to.be.false;
      expect(result456.isRetry).to.be.true;
    });

    it('should not throw when clearing a claim that has no tracking data', () => {
      // Clear a claim that was never stored - should not throw
      clearUploadTracking('non-existent-claim');

      // Verify storage is still accessible
      const file = createTestFile();
      storeUploadAttempt(createUploadParams({ file }));
      const result = checkIfRetry(file, TEST_CLAIM_ID);

      expect(result.isRetry).to.be.true;
    });

    it('should clear failed uploads even when no upload attempts exist for claim', () => {
      const file = createTestFile();
      // Only store a failed upload, no attempt
      storeFailedUpload(createUploadParams({ file, errorCode: 'ERROR' }));

      // Clear should handle case where attempts[claimId] doesn't exist
      clearUploadTracking(TEST_CLAIM_ID);

      const storedFailures = getStoredFailures();
      expect(storedFailures[TEST_CLAIM_ID]).to.be.undefined;
    });
  });

  describe('recordType2FailureEvent', () => {
    it('should record event with all metadata keys', () => {
      recordType2FailureEvent({ count: 3 });

      expect(window.dataLayer.length).to.equal(1);
      expect(window.dataLayer[0]).to.deep.equal({
        event: 'claims-upload-failure-type-2',
        'api-name': 'Claims and Appeals Upload Fail Type 2 Alert',
        'api-status': undefined,
        'error-key': undefined,
        'upload-cancel-file-count': undefined,
        'upload-fail-alert-count': 3,
        'upload-fail-file-count': undefined,
        'upload-file-count': undefined,
        'upload-retry': undefined,
        'upload-retry-file-count': undefined,
        'upload-success-file-count': undefined,
      });
    });
  });

  describe('recordUploadStartEvent', () => {
    it('should record event', () => {
      const files = [
        {
          file: createTestFile('test1.pdf', TEST_TIMESTAMP_1),
          docType: { value: TEST_DOC_TYPE },
        },
        {
          file: createTestFile('test2.pdf', TEST_TIMESTAMP_2),
          docType: { value: TEST_DOC_TYPE_2 },
        },
      ];

      const result = recordUploadStartEvent({ files, claimId: TEST_CLAIM_ID });

      expect(window.dataLayer.length).to.equal(1);
      expect(window.dataLayer[0]).to.deep.equal({
        event: 'claims-upload-start',
        'api-name': 'Claims and Appeals Upload',
        'api-status': 'started',
        'error-key': undefined,
        'upload-cancel-file-count': undefined,
        'upload-fail-alert-count': undefined,
        'upload-fail-file-count': undefined,
        'upload-file-count': 2,
        'upload-retry': false,
        'upload-retry-file-count': 0,
        'upload-success-file-count': undefined,
      });
      expect(result.filesWithRetryInfo).to.have.lengthOf(2);
      expect(result.filesWithRetryInfo[0]).to.have.property('docInstanceId');
      expect(result.retryFileCount).to.equal(0);
    });

    it('should detect and count retry attempts', () => {
      const files = [
        {
          file: createTestFile('test1.pdf', TEST_TIMESTAMP_1),
          docType: { value: TEST_DOC_TYPE },
        },
        {
          file: createTestFile('test2.pdf', TEST_TIMESTAMP_2),
          docType: { value: TEST_DOC_TYPE_2 },
        },
      ];
      // Record first attempt
      recordUploadStartEvent({ files, claimId: TEST_CLAIM_ID });
      // Record second attempt (should be detected as retry)
      recordUploadStartEvent({ files, claimId: TEST_CLAIM_ID });
      // Both files are retries (2 files) with 1 previous attempt each
      expect(window.dataLayer.length).to.equal(2);
      expect(window.dataLayer[1]['upload-retry']).to.equal(true);
      expect(window.dataLayer[1]['upload-retry-file-count']).to.equal(2);
    });

    it("should use 'Unknown' as fallback when file object is missing docType property", () => {
      const files = [
        {
          file: createTestFile('test1.pdf', TEST_TIMESTAMP_1),
          // No docType property
        },
      ];
      const result = recordUploadStartEvent({ files, claimId: TEST_CLAIM_ID });

      expect(result.filesWithRetryInfo[0].docType).to.equal('Unknown');
    });
  });

  describe('recordUploadFailureEvent', () => {
    it('should record event', () => {
      const file1 = createTestFile('test1.pdf', TEST_TIMESTAMP_1);
      const file2 = createTestFile('test2.pdf', TEST_TIMESTAMP_2);
      const errorFiles = [
        {
          fileName: 'test1.pdf',
          docType: 'Other document type',
          errors: [{ detail: 'DOC_UPLOAD_DUPLICATE' }],
        },
        {
          fileName: 'test2.pdf',
          docType: 'Medical Records',
          errors: [{ detail: 'DOC_UPLOAD_DUPLICATE' }],
        },
      ];
      const files = [
        { file: file1, docType: { value: TEST_DOC_TYPE } },
        { file: file2, docType: { value: TEST_DOC_TYPE_2 } },
      ];
      const filesWithRetryInfo = [
        {
          docInstanceId: TEST_DOC_INSTANCE_ID,
          retryInfo: { isRetry: true, retryCount: 1 },
          docType: TEST_DOC_TYPE,
        },
        {
          docInstanceId: TEST_DOC_INSTANCE_ID_2,
          retryInfo: { isRetry: false, retryCount: 0 },
          docType: TEST_DOC_TYPE_2,
        },
      ];

      recordUploadFailureEvent({
        errorFiles,
        files,
        filesWithRetryInfo,
        claimId: TEST_CLAIM_ID,
        retryFileCount: 1,
      });

      expect(window.dataLayer.length).to.equal(1);
      expect(window.dataLayer[0]).to.deep.equal({
        event: 'claims-upload-failure',
        'api-name': 'Claims and Appeals Upload',
        'api-status': 'failed',
        'error-key': 'DOC_UPLOAD_DUPLICATE',
        'upload-cancel-file-count': undefined,
        'upload-fail-alert-count': undefined,
        'upload-fail-file-count': 2,
        'upload-file-count': undefined,
        'upload-retry': true,
        'upload-retry-file-count': 1,
        'upload-success-file-count': undefined,
      });
    });

    it("should record 'Unknown' error code when errorFile has no errors array", () => {
      const errorFiles = [
        {
          fileName: 'test.pdf',
          docType: 'Other document type',
        },
      ];

      recordUploadFailureEvent({
        errorFiles,
        files: [],
        filesWithRetryInfo: [],
        claimId: TEST_CLAIM_ID,
        retryFileCount: 0,
      });

      expect(window.dataLayer.length).to.equal(1);
      expect(window.dataLayer[0]['upload-fail-file-count']).to.equal(1);
      expect(window.dataLayer[0]['error-key']).to.equal('Unknown');
    });

    it("should store 'Unknown' as docType when errorFile is missing docType property", () => {
      const file = createTestFile();
      const errorFiles = [
        {
          fileName: 'test.pdf',
          // No docType property
          errors: [{ detail: 'SOME_ERROR' }],
        },
      ];
      const files = [{ file, docType: { value: TEST_DOC_TYPE } }];
      const filesWithRetryInfo = [
        {
          docInstanceId: TEST_DOC_INSTANCE_ID,
          retryInfo: { isRetry: false, retryCount: 0 },
          docType: TEST_DOC_TYPE,
        },
      ];

      recordUploadFailureEvent({
        errorFiles,
        files,
        filesWithRetryInfo,
        claimId: TEST_CLAIM_ID,
        retryFileCount: 0,
      });

      const storedFailures = getStoredFailures();
      const fingerprint = createFingerprint(file);

      expect(storedFailures[TEST_CLAIM_ID][fingerprint].docType).to.equal(
        'Unknown',
      );
    });

    it("should store 'Unknown' as errorCode when errorFile is missing errors array", () => {
      const file = createTestFile();
      const errorFiles = [
        {
          fileName: 'test.pdf',
          docType: 'L023',
          // No errors array
        },
      ];
      const files = [{ file, docType: { value: TEST_DOC_TYPE } }];
      const filesWithRetryInfo = [
        {
          docInstanceId: TEST_DOC_INSTANCE_ID,
          retryInfo: { isRetry: false, retryCount: 0 },
          docType: TEST_DOC_TYPE,
        },
      ];

      recordUploadFailureEvent({
        errorFiles,
        files,
        filesWithRetryInfo,
        claimId: TEST_CLAIM_ID,
        retryFileCount: 0,
      });

      const storedFailures = getStoredFailures();
      const fingerprint = createFingerprint(file);

      expect(storedFailures[TEST_CLAIM_ID][fingerprint].errorCode).to.equal(
        'Unknown',
      );
    });
  });

  describe('recordUploadSuccessEvent', () => {
    it('should record event with all metadata keys', () => {
      recordUploadSuccessEvent({ fileCount: 2, retryFileCount: 1 });

      expect(window.dataLayer.length).to.equal(1);
      expect(window.dataLayer[0]).to.deep.equal({
        event: 'claims-upload-success',
        'api-name': 'Claims and Appeals Upload',
        'api-status': 'successful',
        'error-key': undefined,
        'upload-cancel-file-count': undefined,
        'upload-fail-alert-count': undefined,
        'upload-fail-file-count': undefined,
        'upload-file-count': undefined,
        'upload-retry': true,
        'upload-retry-file-count': 1,
        'upload-success-file-count': 2,
      });
    });
  });

  describe('recordUploadCancelEvent', () => {
    it('should record event', () => {
      recordUploadCancelEvent({ cancelFileCount: 3, retryFileCount: 2 });

      expect(window.dataLayer.length).to.equal(1);
      expect(window.dataLayer[0]).to.deep.equal({
        event: 'claims-upload-cancel',
        'api-name': 'Claims and Appeals Upload',
        'api-status': 'cancel',
        'error-key': undefined,
        'upload-cancel-file-count': 3,
        'upload-fail-alert-count': undefined,
        'upload-fail-file-count': undefined,
        'upload-file-count': undefined,
        'upload-retry': true,
        'upload-retry-file-count': 2,
        'upload-success-file-count': undefined,
      });
    });
  });

  describe('TTL expiration', () => {
    it('should not detect retry when stored data is older than 2-hour TTL', () => {
      const file = createTestFile();
      const uploadAttemptsKey = 'cst_upload_attempts';
      // Manually create expired data
      const expiredData = {
        data: {
          [TEST_CLAIM_ID]: {
            [createFingerprint(file)]: {
              docInstanceId: 'test-id',
              docType: TEST_DOC_TYPE,
              attempts: 1,
              lastAttempt: Date.now(),
            },
          },
        },
        timestamp: Date.now() - 2 * 60 * 60 * 1000 - 1000, // 2 hours + 1 second = expired
      };

      sessionStorage.setItem(uploadAttemptsKey, JSON.stringify(expiredData));
      // Try to check for retry - should return false because data expired
      const result = checkIfRetry(file, TEST_CLAIM_ID);
      expect(result.isRetry).to.be.false;
    });
  });
});
