import { expect } from 'chai';
import {
  transformAttachments,
  normalizeFullName,
} from '../../../../utils/helpers';

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

  describe('when `normalizeFullName` executes', () => {
    const fullName = {
      first: 'John',
      middle: 'William',
      last: 'Smith',
      suffix: 'Jr.',
    };

    describe('when name object is omitted from the function', () => {
      it('should gracefully return an empty string', () => {
        expect(normalizeFullName()).to.be.empty;
      });
    });

    describe('when name object is provided to the function', () => {
      describe('when the `outputMiddle` param is excluded', () => {
        it('should return first name, last name and suffix', () => {
          expect(normalizeFullName(fullName)).to.equal('John Smith Jr.');
        });
      });

      describe('when the `outputMiddle` param is included', () => {
        describe('when `outputMiddle` is set to `false`', () => {
          it('should return first name, last name and suffix', () => {
            expect(normalizeFullName(fullName, false)).to.equal(
              'John Smith Jr.',
            );
          });
        });

        describe('when `outputMiddle` is set to `true`', () => {
          it('should return first name, middle name, last name and suffix', () => {
            expect(normalizeFullName(fullName, true)).to.equal(
              'John William Smith Jr.',
            );
          });

          it('should return first name, last name and suffix when middle name is `null`', () => {
            const fullNameWithoutMiddle = { ...fullName, middle: null };
            expect(normalizeFullName(fullNameWithoutMiddle, true)).to.equal(
              'John Smith Jr.',
            );
          });
        });
      });
    });
  });
});
