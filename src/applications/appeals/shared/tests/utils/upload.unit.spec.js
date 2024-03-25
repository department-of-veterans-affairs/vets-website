import { expect } from 'chai';

import {
  createPayload,
  parseResponse,
  createContent,
} from '../../utils/upload';

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

// Currently only used by 10182 (NOD)
describe('parseResponse', () => {
  it('should return parsed file name & confirmation code', () => {
    const result = parseResponse(
      { data: { attributes: { guid: 'uuid-1234' } } },
      { name: 'test-file.pdf' },
    );
    expect(result).to.deep.equal({
      name: 'test-file.pdf',
      confirmationCode: 'uuid-1234',
      attachmentId: '',
    });
  });
});

describe('createContent', () => {
  const content = createContent();
  it('should return modal content with unknown file name', () => {
    const result = content.modalContent().props.children[1].props.children;
    expect(result).to.eq('Unknown');
  });
});
