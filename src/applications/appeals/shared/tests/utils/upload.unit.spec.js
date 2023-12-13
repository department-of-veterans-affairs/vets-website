import { expect } from 'chai';

import { createPayload } from '../../utils/upload';

describe('createPayload', () => {
  it('should return a form data object with file only', () => {
    const file = 'mock-file';
    const result = createPayload(file);
    expect(
      result.getAll('decision_review_evidence_attachment[file_data]'),
    ).to.deep.equal(['mock-file']);
    expect(
      result.getAll('decision_review_evidence_attachment[password]'),
    ).to.deep.equal([]);
  });
  it('should return a form data object with file & password', () => {
    const file = 'mock-file';
    const password = '1234';
    const result = createPayload(file, '', password);
    expect(
      result.getAll('decision_review_evidence_attachment[file_data]'),
    ).to.deep.equal(['mock-file']);
    expect(
      result.getAll('decision_review_evidence_attachment[password]'),
    ).to.deep.equal(['1234']);
  });
});
