import { expect } from 'chai';
import {
  buildIntakeUrl,
  buildStatusUrl,
  buildOutputUrl,
  buildDownloadUrl,
} from '../../../cave/endpoints';

describe('cave/endpoints', () => {
  describe('buildIntakeUrl', () => {
    it('returns a string ending with /v0/cave', () => {
      expect(buildIntakeUrl()).to.match(/\/v0\/cave$/);
    });
  });

  describe('buildStatusUrl', () => {
    it('includes the document id and /status', () => {
      const url = buildStatusUrl('doc-123');
      expect(url).to.include('doc-123');
      expect(url).to.match(/\/status$/);
    });

    it('percent-encodes special characters in the id', () => {
      const url = buildStatusUrl('id with spaces');
      expect(url).to.include('id%20with%20spaces');
    });
  });

  describe('buildOutputUrl', () => {
    it('includes the document id and /output', () => {
      const url = buildOutputUrl('doc-123');
      expect(url).to.include('doc-123');
      expect(url).to.include('/output');
    });

    it('defaults type to "artifact"', () => {
      const url = buildOutputUrl('doc-123');
      expect(url).to.include('type=artifact');
    });

    it('uses the provided type parameter', () => {
      const url = buildOutputUrl('doc-123', 'summary');
      expect(url).to.include('type=summary');
    });

    it('percent-encodes the type parameter', () => {
      const url = buildOutputUrl('doc-123', 'my type');
      expect(url).to.include('type=my%20type');
    });
  });

  describe('buildDownloadUrl', () => {
    it('includes the document id and /download', () => {
      const url = buildDownloadUrl('doc-123', 'kvp-456');
      expect(url).to.include('doc-123');
      expect(url).to.include('/download');
    });

    it('includes the kvpid query param', () => {
      const url = buildDownloadUrl('doc-123', 'kvp-456');
      expect(url).to.include('kvpid=kvp-456');
    });

    it('percent-encodes the kvpid', () => {
      const url = buildDownloadUrl('doc-123', 'kvp id');
      expect(url).to.include('kvpid=kvp%20id');
    });
  });
});
