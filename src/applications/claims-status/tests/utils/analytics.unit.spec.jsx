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

    it('should NOT detect retry for different file with same size', () => {
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
  });

  describe('recordType2FailureEvent', () => {
    it('should record Type 2 failure event with document count', () => {
      recordType2FailureEvent({ failedDocumentCount: 3 });

      expect(window.dataLayer.length).to.equal(1);
      expect(window.dataLayer[0]).to.deep.equal({
        event: 'claims-upload-failure-type-2',
        'failed-document-count': 3,
      });
    });
  });

  describe('recordUploadStartEvent', () => {
    it('should record upload start event with document count', () => {
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
      expect(window.dataLayer[0].event).to.equal('claims-upload-start');
      expect(window.dataLayer[0]['document-count']).to.equal(2);
      expect(window.dataLayer[0]['retry-file-count']).to.equal(0);
      expect(window.dataLayer[0]['total-retry-attempts']).to.equal(0);
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.have.property('docInstanceId');
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
      // Both files are retries (2 files) with 1 previous attempt each (2 total attempts)
      expect(window.dataLayer.length).to.equal(2);
      expect(window.dataLayer[1]['retry-file-count']).to.equal(2);
      expect(window.dataLayer[1]['total-retry-attempts']).to.equal(2);
    });
  });

  describe('recordUploadFailureEvent', () => {
    it('should record upload failure event with metadata', () => {
      const file = createTestFile();
      const errorFiles = [
        {
          fileName: 'test.pdf',
          docType: 'Other document type',
          errors: [{ detail: 'DOC_UPLOAD_DUPLICATE' }],
        },
      ];
      const files = [
        {
          file,
          docType: { value: TEST_DOC_TYPE },
        },
      ];
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
      });

      expect(window.dataLayer.length).to.equal(1);
      expect(window.dataLayer[0]).to.deep.equal({
        event: 'claims-upload-failure',
        'failed-document-count': 1,
        'error-code': 'DOC_UPLOAD_DUPLICATE',
      });
    });

    it('should handle unknown error codes', () => {
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
      });

      expect(window.dataLayer.length).to.equal(1);
      expect(window.dataLayer[0]['error-code']).to.equal('Unknown');
    });
  });

  describe('recordUploadSuccessEvent', () => {
    it('should record upload success event with document count', () => {
      recordUploadSuccessEvent({ documentCount: 2 });

      expect(window.dataLayer.length).to.equal(1);
      expect(window.dataLayer[0]).to.deep.equal({
        event: 'claims-upload-success',
        'document-count': 2,
      });
    });
  });

  describe('TTL expiration', () => {
    it('should expire data after TTL', () => {
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
        timestamp: Date.now() - 2 * 60 * 60 * 1000 - 1000, // 2 hours old
      };

      sessionStorage.setItem(uploadAttemptsKey, JSON.stringify(expiredData));
      // Try to check for retry - should return false because data expired
      const result = checkIfRetry(file, TEST_CLAIM_ID);
      expect(result.isRetry).to.be.false;
    });
  });
});
