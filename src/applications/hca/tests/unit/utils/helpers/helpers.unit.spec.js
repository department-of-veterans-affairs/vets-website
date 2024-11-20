import { expect } from 'chai';
import { transformAttachments } from '../../../../utils/helpers';

describe('hca helpers', () => {
  describe('when `transformAttachments` executes', () => {
    describe('when there are no attachements', () => {
      it('should do nothing', () => {
        const inputData = { firstName: 'Pat' };
        const transformedData = transformAttachments(inputData);
        expect(transformedData).to.deep.equal(inputData);
      });
    });

    describe('when there are attachements', () => {
      it('should transform `attachmentId`s to `dd214` booleans', () => {
        const inputData = {
          firstName: 'Pat',
          attachments: [
            {
              name: 'file1',
              size: 1,
              confirmationCode: 'uuid123',
              attachmentId: '1',
            },
            {
              name: 'file2',
              size: 1,
              confirmationCode: 'uuid456',
              attachmentId: '2',
            },
          ],
        };
        const expectedOutputData = {
          firstName: 'Pat',
          attachments: [
            {
              name: 'file1',
              size: 1,
              confirmationCode: 'uuid123',
              dd214: true,
            },
            {
              name: 'file2',
              size: 1,
              confirmationCode: 'uuid456',
              dd214: false,
            },
          ],
        };
        const transformedData = transformAttachments(inputData);
        expect(transformedData).to.deep.equal(expectedOutputData);
      });
    });
  });
});
