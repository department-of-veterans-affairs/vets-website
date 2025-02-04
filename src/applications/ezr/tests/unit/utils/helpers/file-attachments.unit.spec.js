import { expect } from 'chai';
import {
  createPayload,
  parseResponse,
} from '../../../../utils/helpers/file-attachments';

describe('file-attachments', () => {
  const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

  describe('ezr `createPayload` method', () => {
    it('should create a FormData instance with file', () => {
      const payload = createPayload(mockFile);
      expect(payload.get('form1010_ezr_attachment[file_data]')).to.equal(
        mockFile,
      );
    });
  });

  describe('ezr `parseResponse` method', () => {
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
