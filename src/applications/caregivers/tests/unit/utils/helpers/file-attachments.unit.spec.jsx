import { expect } from 'chai';
import { createPayload, parseResponse } from '../../../../utils/helpers';

const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
const formId = '1234';

describe('CG `createPayload` method', () => {
  it('should create a FormData instance with form_id and file', () => {
    const payload = createPayload(mockFile, formId);
    expect(payload.get('form_id')).to.eq(formId);
    expect(payload.get('attachment[file_data]')).to.eq(mockFile);
    expect(payload.get('attachment[password]')).to.be.null;
  });

  it('should append password to FormData if provided', () => {
    const password = 'password';
    const payload = createPayload(mockFile, formId, password);
    expect(payload.get('attachment[password]')).to.eq(password);
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
  const mockResult = parseResponse(response, mockFile);

  it('should return an object with the name, confirmation code and guid', () => {
    expect(mockResult).to.deep.eq({
      name: 'test.txt',
      confirmationCode: 'test-id',
      guid: 'test-guid',
    });
  });
});
