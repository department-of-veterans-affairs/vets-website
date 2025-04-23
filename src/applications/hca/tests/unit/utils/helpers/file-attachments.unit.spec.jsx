import { expect } from 'chai';
import { createPayload, parseResponse } from '../../../../utils/helpers';

describe('hca file attachment methods', () => {
  const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

  context('when the `createPayload` method executes', () => {
    it('should create a FormData instance with file', () => {
      const payload = createPayload(mockFile);

      expect(payload.get('hca_attachment[file_data]')).to.equal(mockFile);
    });
  });

  context('when the `parseResponse` method executes', () => {
    it('should return an object with the name, confirmation code and file size', () => {
      const response = {
        data: {
          attributes: {
            guid: 'test-guid',
          },
          id: 'test-id',
        },
      };
      const mockResult = parseResponse(response, mockFile);

      expect(mockResult).to.deep.equal({
        name: 'test.txt',
        confirmationCode: 'test-guid',
        size: 4,
      });
    });
  });
});
