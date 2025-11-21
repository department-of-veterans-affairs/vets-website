/**
 * @module config/submit-handler/test-mocks
 * @description Mock classes for submit handler unit tests
 */

/**
 * Mock FileReader class for successful blob reading
 */
export class MockFileReaderSuccess {
  readAsDataURL() {
    // Simulate async reading
    setTimeout(() => {
      this.result = 'data:application/pdf;base64,mockPdfData';
      if (this.onloadend) {
        this.onloadend();
      }
    }, 0);
  }
}

/**
 * Mock FileReader class for failed blob reading
 */
export class MockFileReaderError {
  readAsDataURL() {
    // Simulate async error
    setTimeout(() => {
      if (this.onerror) {
        this.onerror(new Error('FileReader error'));
      }
    }, 0);
  }
}
