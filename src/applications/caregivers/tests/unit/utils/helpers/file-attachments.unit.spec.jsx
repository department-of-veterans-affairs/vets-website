import { expect } from 'chai';
import { createPayload, parseResponse } from '../../../../utils/helpers';

describe('CG `createPayload` method', () => {
  let mockFile;
  let formId;

  beforeEach(() => {
    mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    formId = '1234';
  });

  it('should create a FormData instance with form_id and file', () => {
    const payload = createPayload(mockFile, formId);

    expect(payload.get('form_id')).to.equal(formId);
    expect(payload.get('attachment[file_data]')).to.equal(mockFile);
    expect(payload.get('attachment[password]')).to.be.null;
  });

  it('should append password to FormData if provided', () => {
    const password = 'password';
    const payload = createPayload(mockFile, formId, password);

    expect(payload.get('form_id')).to.equal(formId);
    expect(payload.get('attachment[file_data]')).to.equal(mockFile);
    expect(payload.get('attachment[password]')).to.equal(password);
  });
});

describe('CG `parseResponse` method', () => {
  const response = {
    data: {
      attributes: {
        guid: 'test-guid',
      },
      id: 'test-id',
    },
  };
  let mockFile;
  let mockResult;

  beforeEach(() => {
    mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    mockResult = parseResponse(response, mockFile);
  });

  it('should return an object with the name, confirmation code and guid', () => {
    expect(mockResult).to.deep.equal({
      name: 'test.txt',
      confirmationCode: 'test-id',
      guid: 'test-guid',
    });
  });
});
