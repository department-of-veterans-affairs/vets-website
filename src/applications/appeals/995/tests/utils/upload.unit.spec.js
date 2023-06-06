import { expect } from 'chai';

import { fileUploadUi } from '../../utils/upload';

describe('utils upload', () => {
  const fileUiSchema = fileUploadUi({
    label: 'label',
    description: 'description',
  });

  describe('createPayload', () => {
    const { createPayload } = fileUiSchema['ui:options'];
    const getResults = (file, _, password) => [
      ...createPayload(file, _, password).entries(),
    ];

    it('should return a correct payload', () => {
      expect(getResults('123')).to.deep.equal([
        ['decision_review_evidence_attachment[file_data]', '123'],
      ]);
      expect(getResults('{ test: true }', '', '')).to.deep.equal([
        ['decision_review_evidence_attachment[file_data]', '{ test: true }'],
      ]);
    });
    it('should include a password in the payload', () => {
      expect(getResults('123', '', 'password123')).to.deep.equal([
        ['decision_review_evidence_attachment[file_data]', '123'],
        ['decision_review_evidence_attachment[password]', 'password123'],
      ]);
    });
  });

  describe('parseResponse', () => {
    const { parseResponse } = fileUiSchema['ui:options'];
    it('should return an appropriate response', () => {
      expect(
        parseResponse(
          { data: { attributes: { guid: '12345' } } },
          { name: 'test' },
        ),
      ).to.deep.equal({
        name: 'test',
        confirmationCode: '12345',
        attachmentId: '',
      });
    });
  });
});
