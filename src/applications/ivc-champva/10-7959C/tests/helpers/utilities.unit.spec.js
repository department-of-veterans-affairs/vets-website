import { expect } from 'chai';
import {
  isRequiredFile,
  nameWording,
  getObjectsWithAttachmentId,
} from '../../helpers/utilities';
import { requiredFiles } from '../../config/constants';

describe('isRequiredFile', () => {
  it("should return '(Required)' if required file in formContext", () => {
    // Grab whatever the first required file key is and toss into this
    // mocked context object:
    const context = {
      schema: { properties: { [Object.keys(requiredFiles)[0]]: '' } },
    };
    expect(isRequiredFile(context, requiredFiles)).to.equal('(Required)');
  });
  it("should return '(Optional)' if file in formContext is not in required list", () => {
    const context = {
      schema: { properties: { optionalFile: '' } },
    };
    expect(isRequiredFile(context, requiredFiles)).to.equal('(Optional)');
  });
});

describe('nameWording', () => {
  it("should return 'Your' if certifierRole is 'applicant'", () => {
    expect(nameWording({ certifierRole: 'applicant' })).to.equal('Your');
  });
  it("should return 'You' if certifierRole is 'applicant' and isPosessive is false", () => {
    expect(nameWording({ certifierRole: 'applicant' }, false)).to.equal('You');
  });
  it("should return the posessive form of the applicant name if certifierRole is not 'applicant'", () => {
    expect(
      nameWording({
        certifierRole: 'other',
        applicantName: { first: 'John', middle: 'Christopher', last: 'Reilly' },
      }),
    ).to.equal('John Christopher Reilly’s');
  });
  it('should return the non-posessive form of the applicant name if isPosessive is false', () => {
    expect(
      nameWording(
        {
          certifierRole: 'other',
          applicantName: { first: 'John', middle: 'William', last: 'Ferrell' },
        },
        false, // isPosessive
        false, // capitalize
      ),
    ).to.equal('John William Ferrell');
  });
});

describe('getObjectsWithAttachmentId', () => {
  it('should return list of objects with the `attachmentId` property', () => {
    const objectList = [
      [{ attachmentId: '1' }],
      [{ name: 'abc' }],
      [{ attachmentId: '2' }],
    ];
    expect(getObjectsWithAttachmentId(objectList).length).to.equal(2);
  });
});
