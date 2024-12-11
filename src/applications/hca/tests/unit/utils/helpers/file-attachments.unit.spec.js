import { expect } from 'chai';
import { createPayload, parseResponse } from '../../../../utils/helpers';

describe('hca `createPayload` method', () => {
  let mockFile;

  beforeEach(() => {
    mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
  });

  it('should create a FormData instance with file', () => {
    const payload = createPayload(mockFile);
    expect(payload.get('hca_attachment[file_data]')).to.equal(mockFile);
  });
});

describe('hca `parseResponse` method', () => {
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

  it('should return an object with the name, confirmation code and file size', () => {
    expect(mockResult).to.deep.equal({
      name: 'test.txt',
      confirmationCode: 'test-guid',
      size: 4,
    });
  });
});
