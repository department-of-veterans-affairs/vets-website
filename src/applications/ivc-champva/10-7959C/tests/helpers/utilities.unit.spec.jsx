import React from 'react';
import { expect } from 'chai';
import { testComponentRender } from 'applications/ivc-champva/shared/tests/pages/pageTests.spec';
import { isRequiredFile, nameWordingExt } from '../../helpers/utilities';
import { requiredFiles } from '../../config/constants';
import {
  concatStreets,
  getObjectsWithAttachmentId,
  nameWording,
  PrivWrappedReview,
} from '../../../shared/utilities';
import { validateText } from '../../../shared/validations';

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

describe('nameWordingExt', () => {
  it("should set `beingVerb` to 'you’re' if certifierRole is 'applicant'", () => {
    expect(nameWordingExt({ certifierRole: 'applicant' }).beingVerb).to.equal(
      'you’re',
    );
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

describe('concatStreets function', () => {
  it('should concatenate all streets together', () => {
    const addr = {
      street: '123 St',
      street2: 'Unit 1C',
      street3: 'Apt A',
      state: 'MD',
    };
    expect(concatStreets(addr).streetCombined.trim()).to.equal(
      `${addr.street} ${addr.street2} ${addr.street3}`,
    );
  });
  it('should return single street(1) value if no 2 and 3 are present', () => {
    const addr = {
      street: '123 St',
      state: 'MD',
    };
    expect(concatStreets(addr).streetCombined.trim()).to.equal(
      `${addr.street}`,
    );
  });
});

describe('validateText function', () => {
  it('should provide an error message when illegal characters detected', () => {
    const testStr = '"';
    expect(validateText(testStr)).to.not.be.null;
  });
  it('should return null when no illegal characters detected', () => {
    const testStr = "I am the applicant's grandmother";
    expect(validateText(testStr)).to.be.null;
  });
});

testComponentRender(
  'PrivWrappedReview',
  <PrivWrappedReview
    defaultEditButton={() => {}}
    title="Test"
    renderedProperties={[<div key="Test1" />]}
  />,
);
