import { expect } from 'chai';
import {
  FIELD_NONE_NOTED,
  imageRootUri,
  NO_PROVIDER_NAME,
  dispStatusObj,
} from '../../util/constants';
import {
  extractContainedResource,
  generateMedicationsPDF,
  getImageUri,
  processList,
  validateField,
  validateIfAvailable,
  createNoDescriptionText,
  createVAPharmacyText,
  fromToNumbs,
  sanitizeKramesHtmlStr,
  hasCmopNdcNumber,
  getRefillHistory,
  getShowRefillHistory,
  displayProviderName,
  isRefillTakingLongerThanExpected,
} from '../../util/helpers';

describe('Generate PDF function', () => {
  it('should throw an error', () => {
    const error = generateMedicationsPDF();
    expect(error).to.exist;
  });
});

describe('Validate Field function', () => {
  it('should return the value', () => {
    expect(validateField('Test')).to.equal('Test');
  });

  it("should return 'None noted' when no values are passed", () => {
    expect(validateField()).to.equal(FIELD_NONE_NOTED);
  });

  it('should return 0', () => {
    expect(validateField(0)).to.equal(0);
  });

  it('returns the value when passed a string', () => {
    const result = validateField('30');
    expect(result).to.equal('30');
  });

  it('returns the value when passed a string float', () => {
    const result = validateField('15.5');
    expect(result).to.equal('15.5');
  });

  it('returns the value when passed an integer', () => {
    const result = validateField(30);
    expect(result).to.equal(30);
  });

  it('returns the value when passed a float number', () => {
    const result = validateField(15.5);
    expect(result).to.equal(15.5);
  });

  it('returns the value when passed zero as a string', () => {
    const result = validateField('0');
    expect(result).to.equal('0');
  });

  it('returns "None noted" when passed null', () => {
    const result = validateField(null);
    expect(result).to.equal('None noted');
  });

  it('returns "None noted" when passed undefined', () => {
    const result = validateField(undefined);
    expect(result).to.equal('None noted');
  });

  it('returns "None noted" when passed empty string', () => {
    const result = validateField('');
    expect(result).to.equal('None noted');
  });

  it('returns the value when passed a string with whitespace', () => {
    const result = validateField('  30  ');
    expect(result).to.equal('  30  ');
  });

  it('returns the value when passed a negative number', () => {
    const result = validateField(-5);
    expect(result).to.equal(-5);
  });

  it('returns the value when passed a negative string number', () => {
    const result = validateField('-5');
    expect(result).to.equal('-5');
  });

  it('returns the value when passed boolean true', () => {
    const result = validateField(true);
    expect(result).to.equal(true);
  });

  it('returns "None noted" when passed boolean false', () => {
    const result = validateField(false);
    expect(result).to.equal('None noted');
  });

  it('handles quantity-specific edge cases for strings', () => {
    const result1 = validateField('30 tablets');
    expect(result1).to.equal('30 tablets');

    const result2 = validateField('2.5 mg');
    expect(result2).to.equal('2.5 mg');
  });

  it('handles quantity-specific edge cases for numbers', () => {
    const result1 = validateField(90);
    expect(result1).to.equal(90);

    const result2 = validateField(0.5);
    expect(result2).to.equal(0.5);
  });
});

describe('Validate if Available function', () => {
  it('should return the value', () => {
    expect(validateIfAvailable('Test field name', 'Test')).to.equal('Test');
  });

  it("should return 'Test field not available' when no value is passed", () => {
    expect(validateIfAvailable('Test field')).to.equal(
      'Test field not available',
    );
  });

  it('should return 0', () => {
    expect(validateIfAvailable('Test field name', 0)).to.equal(0);
  });

  it('returns the value when passed a string', () => {
    const result = validateIfAvailable('Test Field', '30');
    expect(result).to.equal('30');
  });

  it('returns the value when passed a string float', () => {
    const result = validateIfAvailable('Test Field', '15.5');
    expect(result).to.equal('15.5');
  });

  it('returns the value when passed an integer', () => {
    const result = validateIfAvailable('Test Field', 30);
    expect(result).to.equal(30);
  });

  it('returns the value when passed a float number', () => {
    const result = validateIfAvailable('Test Field', 15.5);
    expect(result).to.equal(15.5);
  });

  it('returns the value when passed zero as a string', () => {
    const result = validateIfAvailable('Test Field', '0');
    expect(result).to.equal('0');
  });

  it('returns "not available" message when passed null', () => {
    const result = validateIfAvailable('Test Field', null);
    expect(result).to.equal('Test Field not available');
  });

  it('returns "not available" message when passed undefined', () => {
    const result = validateIfAvailable('Test Field', undefined);
    expect(result).to.equal('Test Field not available');
  });

  it('returns "not available" message when passed empty string', () => {
    const result = validateIfAvailable('Test Field', '');
    expect(result).to.equal('Test Field not available');
  });

  it('returns the value when passed a string with whitespace', () => {
    const result = validateIfAvailable('Test Field', '  30  ');
    expect(result).to.equal('  30  ');
  });

  it('returns the value when passed a negative number', () => {
    const result = validateIfAvailable('Test Field', -5);
    expect(result).to.equal(-5);
  });

  it('returns the value when passed a negative string number', () => {
    const result = validateIfAvailable('Test Field', '-5');
    expect(result).to.equal('-5');
  });

  it('works with different field names in the not available message', () => {
    const result = validateIfAvailable('Quantity', null);
    expect(result).to.equal('Quantity not available');

    const result2 = validateIfAvailable('Dosage', undefined);
    expect(result2).to.equal('Dosage not available');
  });
});

describe('Image URI function', () => {
  it('should return the URI', () => {
    expect(getImageUri('1test')).to.equal(`${imageRootUri}1/NDC1test.jpg`);
  });

  it('should support OTHER folder', () => {
    expect(getImageUri()).to.equal(`${imageRootUri}other/NDCundefined.jpg`);
  });
});

describe('processList function', () => {
  it('returns an array of strings, separated by a period and a space, when there is more than 1 item in the list', () => {
    const list = ['a', 'b', 'c'];
    const result = processList(list);
    expect(result).to.eq('a. b. c');
  });
  it('returns the single item as string, when there is only 1 item in the list', () => {
    const list = ['a'];
    const result = processList(list);
    expect(result).to.eq('a');
  });
  it('returns FIELD_NONE_NOTED value if there are no items in the list', () => {
    const list = [];
    const result = processList(list);
    expect(result).to.eq(FIELD_NONE_NOTED);
  });
});

describe('extractContainedResource', () => {
  it('should extract the contained resource when provided a valid reference ID', () => {
    const resource = {
      contained: [{ id: 'a1', type: 'TypeA' }, { id: 'b2', type: 'TypeB' }],
    };

    const result = extractContainedResource(resource, '#a1');
    expect(result).to.eq(resource.contained.find(e => e.id === 'a1'));
  });

  it('should return null if resource does not contain the "contained" property', () => {
    const resource = {};

    const result = extractContainedResource(resource, '#a1');
    expect(result).to.eq(null);
  });

  it('should return null if "contained" property is not an array', () => {
    const resource = {
      contained: 'not-an-array',
    };

    const result = extractContainedResource(resource, '#a1');
    expect(result).to.eq(null);
  });

  it('should return null if reference ID is not provided', () => {
    const resource = {
      contained: [{ id: 'a1', type: 'TypeA' }],
    };

    const result = extractContainedResource(resource, '');
    expect(result).to.eq(null);
  });

  it('should return null if no match is found in the "contained" array', () => {
    const resource = {
      contained: [{ id: 'a1', type: 'TypeA' }],
    };

    const result = extractContainedResource(resource, '#b2');
    expect(result).to.eq(null);
  });
});

describe('createNoDescriptionText', () => {
  it('should include a phone number if provided', () => {
    expect(createNoDescriptionText('555-111-5555')).to.eq(
      'No description available. If you need help identifying this medication, call your pharmacy at 555-111-5555.',
    );
  });

  it('should create a string even if no phone number provided', () => {
    expect(createNoDescriptionText()).to.eq(
      'No description available. If you need help identifying this medication, call your pharmacy.',
    );
  });

  describe('createVAPharmacyText', () => {
    it('should include a phone number if provided', () => {
      expect(createVAPharmacyText('555-111-5555')).to.eq(
        'your VA pharmacy at 555-111-5555',
      );
    });

    it('should create a string even if no phone number provided', () => {
      expect(createVAPharmacyText()).to.eq('your VA pharmacy');
    });
  });
});

describe('fromToNumbs', () => {
  it('should return [0, 0]', () => {
    const numbers = fromToNumbs(1, 0, [], 1);
    expect(numbers[0]).to.eq(0);
    expect(numbers[1]).to.eq(0);
  });

  it('should return [1, 2]', () => {
    const numbers = fromToNumbs(1, 2, [1, 2], 2);
    expect(numbers[0]).to.eq(1);
    expect(numbers[1]).to.eq(2);
  });
});

describe('sanitizeKramesHtmlStr function', () => {
  it('should remove <Page> tags', () => {
    const inputHtml = '<Page>Page 1</Page>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.not.include('<Page>Page 1</Page>');
  });

  it('should convert h1 tags to h2 tags', () => {
    const inputHtml = '<h1>Heading 1</h1>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<h2 id="Heading 1" tabindex="-1">Heading 1</h2>',
    );
  });

  it('should convert h3 tags to paragraphs if followed by h2 tags', () => {
    const inputHtml = '<h3>Subheading</h3><h2>Heading 2</h2>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<p>Subheading</p><h2 id="Heading 2" tabindex="-1">Heading 2</h2>',
    );
  });

  it('should combine nested ul tags into one', () => {
    const inputHtml = '<ul><ul><li>Item 1</li></ul></ul>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include('<ul><li>Item 1</li></ul>');
  });

  it('should convert plain text nodes to paragraphs', () => {
    const inputHtml = 'Some plain text';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include('<p>Some plain text</p>');
  });

  it('should convert h2 tags to sentence case', () => {
    const inputHtml = '<h2>THIS IS A HEADING</h2>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<h2 id="This is a heading" tabindex="-1">This is a heading</h2>',
    );
  });

  it('should retain the capitalization of I in h2 tags', () => {
    const inputHtml = '<h2>What SPECIAL PRECAUTIONS should I follow?</h2>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<h2 id="What special precautions should I follow?" tabindex="-1">What special precautions should I follow?</h2>',
    );
  });

  it('should properly manage <p> tags inside of <ul> tags by restructuring the DOM', () => {
    const inputHtml = `<ul>
                        <li>Item 1</li>
                        <p>Paragraph inside list</p>
                        <li>Item 2</li>
                      </ul>`;
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<ul><li>Item 1</li></ul><p>Paragraph inside list</p><ul><li>Item 2</li></ul>',
    );
  });

  it('should properly manage <p> tags inside of nested <ul> tags by restructuring the DOM', () => {
    const inputHtml = `<ul>
                        <li>Item 1</li>
                        <ul>
                        <li>Item 1.1</li>
                        <p>Paragraph inside nested list</p>
                        </ul>
                        <p>Paragraph inside list</p>
                        <li>Item 2</li>
                      </ul>`;
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<ul><li>Item 1</li></ul><p>Paragraph inside list</p><ul><li>Item 2</li><li>Item 1.1</li><p>Paragraph inside nested list</p></ul>',
    );
  });

  it('should remove all pilcrows (¶) from the HTML string', () => {
    const inputHtml = `<div>
                      <strong>
                      <p>¶This branded product is no longer on the market.</p>
                      </strong>
                      <ul>
                      <li>¶BrandName1</li>
                      <li>¶BrandName2</li>
                      </ul>
                      </div>`;
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.not.include('¶');
    expect(outputHtml).to.include(
      'This branded product is no longer on the market.',
    );
    expect(outputHtml).to.include('BrandName1');
    expect(outputHtml).to.include('BrandName2');
  });
});

describe('hasCmopNdcNumber function', () => {
  it('should return true when at least one refill record has a cmopNdcNumber', () => {
    const refillHistory = [
      { cmopNdcNumber: null },
      { cmopNdcNumber: '12345-6789-01' },
      { cmopNdcNumber: null },
    ];
    expect(hasCmopNdcNumber(refillHistory)).to.equal(true);
  });

  it('should return false when no refill records have a cmopNdcNumber', () => {
    const refillHistory = [
      { cmopNdcNumber: null },
      { cmopNdcNumber: '' },
      { cmopNdcNumber: undefined },
    ];
    expect(hasCmopNdcNumber(refillHistory)).to.equal(false);
  });

  it('should return false when refill history is an empty array', () => {
    const refillHistory = [];
    expect(hasCmopNdcNumber(refillHistory)).to.equal(false);
  });
});

describe('getShowRefillHistory function', () => {
  it('should return false when refill history is an empty array', () => {
    const refillHistory = [];
    expect(getShowRefillHistory(refillHistory)).to.equal(false);
  });

  it('should return false when refill history is 1 element with dispensedDate undefined', () => {
    const refillHistory = [{ dispensedDate: undefined }];
    expect(getShowRefillHistory(refillHistory)).to.equal(false);
  });

  it('should return true when refill history is 1 element with dispensed date undefined', () => {
    const refillHistory = [{ dispensedDate: '2023-08-04T04:00:00.000Z' }];
    expect(getShowRefillHistory(refillHistory)).to.equal(true);
  });

  it('should return true when refill history is 2 elements', () => {
    const refillHistory = [{}, {}];
    expect(getShowRefillHistory(refillHistory)).to.equal(true);
  });
});

describe('getRefillHistory function', () => {
  it('should return an empty array when prescription is null', () => {
    const result = getRefillHistory(null);
    expect(result).to.deep.equal([]);
  });

  it('should return an array with only the original fill record when there are no rxRfRecords', () => {
    const prescription = {
      backImprint: 'back123',
      cmopDivisionPhone: '123-456-7890',
      cmopNdcNumber: '12345-6789-01',
      color: 'white',
      dialCmopDivisionPhone: '123-456-7890',
      dispensedDate: '2023-01-01',
      frontImprint: 'front123',
      prescriptionId: '123456',
      prescriptionName: 'Test Medication',
      prescriptionSource: 'RX',
      shape: 'round',
    };

    const result = getRefillHistory(prescription);
    expect(result.length).to.equal(1);
    expect(result[0]).to.deep.equal(prescription);
  });

  it('should return an array with rxRfRecords and the original fill record', () => {
    const prescription = {
      backImprint: 'back123',
      cmopDivisionPhone: '123-456-7890',
      cmopNdcNumber: '12345-6789-01',
      color: 'white',
      dialCmopDivisionPhone: '123-456-7890',
      dispensedDate: '2023-01-01',
      frontImprint: 'front123',
      prescriptionId: '123456',
      prescriptionName: 'Test Medication',
      shape: 'round',
      rxRfRecords: [
        {
          backImprint: 'back456',
          cmopDivisionPhone: '234-567-8901',
          cmopNdcNumber: '23456-7890-12',
          dispensedDate: '2023-02-01',
        },
        {
          backImprint: 'back789',
          cmopDivisionPhone: '345-678-9012',
          cmopNdcNumber: '34567-8901-23',
          dispensedDate: '2023-03-01',
        },
      ],
    };

    const result = getRefillHistory(prescription);
    expect(result.length).to.equal(3);
    expect(result[0]).to.deep.equal(prescription.rxRfRecords[0]);
    expect(result[1]).to.deep.equal(prescription.rxRfRecords[1]);

    // Check that the original fill record is added as the last item
    const originalFill = result[2];
    expect(originalFill.backImprint).to.equal(prescription.backImprint);
    expect(originalFill.cmopDivisionPhone).to.equal(
      prescription.cmopDivisionPhone,
    );
    expect(originalFill.cmopNdcNumber).to.equal(prescription.cmopNdcNumber);
    expect(originalFill.dispensedDate).to.equal(prescription.dispensedDate);
  });

  it('should handle prescription with empty rxRfRecords array and dispensed date', () => {
    const prescription = {
      backImprint: 'back123',
      cmopNdcNumber: '12345-6789-01',
      dispensedDate: '2023-01-01',
      prescriptionId: '123456',
      prescriptionName: 'Test Medication',
      rxRfRecords: [],
    };

    const result = getRefillHistory(prescription);
    expect(result.length).to.equal(1);
    expect(result[0].prescriptionId).to.equal('123456');
    expect(result[0].prescriptionName).to.equal('Test Medication');
  });

  it('should handle prescription with empty rxRfRecords array and no dispensed date', () => {
    const prescription = {
      backImprint: 'back123',
      cmopNdcNumber: '12345-6789-01',
      prescriptionId: '123456',
      prescriptionName: 'Test Medication',
      rxRfRecords: [],
    };

    const result = getRefillHistory(prescription);
    expect(result.length).to.equal(0);
  });
});

describe('sanitizeKramesHtmlStr function', () => {
  it('should remove <Page> tags', () => {
    const inputHtml = '<Page>Page 1</Page>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.not.include('<Page>Page 1</Page>');
  });

  it('should convert h1 tags to h2 tags', () => {
    const inputHtml = '<h1>Heading 1</h1>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<h2 id="Heading 1" tabindex="-1">Heading 1</h2>',
    );
  });

  it('should convert h3 tags to paragraphs if followed by h2 tags', () => {
    const inputHtml = '<h3>Subheading</h3><h2>Heading 2</h2>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<p>Subheading</p><h2 id="Heading 2" tabindex="-1">Heading 2</h2>',
    );
  });

  it('should combine nested ul tags into one', () => {
    const inputHtml = '<ul><ul><li>Item 1</li></ul></ul>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include('<ul><li>Item 1</li></ul>');
  });

  it('should convert plain text nodes to paragraphs', () => {
    const inputHtml = 'Some plain text';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include('<p>Some plain text</p>');
  });

  it('should convert h2 tags to sentence case', () => {
    const inputHtml = '<h2>THIS IS A HEADING</h2>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<h2 id="This is a heading" tabindex="-1">This is a heading</h2>',
    );
  });

  it('should retain the capitalization of I in h2 tags', () => {
    const inputHtml = '<h2>What SPECIAL PRECAUTIONS should I follow?</h2>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<h2 id="What special precautions should I follow?" tabindex="-1">What special precautions should I follow?</h2>',
    );
  });

  it('should properly manage <p> tags inside of <ul> tags by restructuring the DOM', () => {
    const inputHtml = `<ul>
                        <li>Item 1</li>
                        <p>Paragraph inside list</p>
                        <li>Item 2</li>
                      </ul>`;
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<ul><li>Item 1</li></ul><p>Paragraph inside list</p><ul><li>Item 2</li></ul>',
    );
  });

  it('should properly manage <p> tags inside of nested <ul> tags by restructuring the DOM', () => {
    const inputHtml = `<ul>
                        <li>Item 1</li>
                        <ul>
                        <li>Item 1.1</li>
                        <p>Paragraph inside nested list</p>
                        </ul>
                        <p>Paragraph inside list</p>
                        <li>Item 2</li>
                      </ul>`;
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<ul><li>Item 1</li></ul><p>Paragraph inside list</p><ul><li>Item 2</li><li>Item 1.1</li><p>Paragraph inside nested list</p></ul>',
    );
  });
});

describe('Provider name function', () => {
  it('should return no provider available constant when no values are passed', () => {
    expect(displayProviderName()).to.equal(NO_PROVIDER_NAME);
  });

  it('should return provider name "first last" format', () => {
    const firstName = 'Tony';
    const lastName = 'Stark';
    expect(displayProviderName(firstName, lastName)).to.equal(
      `${firstName} ${lastName}`,
    );
  });
});

describe('isRefillTakingLongerThanExpected function', () => {
  const now = new Date();
  const isoNow = now.toISOString();
  // 8 days ago (past threshold)
  const eightDaysAgoDate = new Date();
  eightDaysAgoDate.setDate(now.getDate() - 8);
  const eightDaysAgo = eightDaysAgoDate.toISOString();
  // Tomorrow
  const tomorrowDate = new Date();
  tomorrowDate.setDate(now.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString();
  // Yesterday
  const yesterdayDate = new Date();
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterday = yesterdayDate.toISOString();

  it('returns false if rx is null', () => {
    expect(isRefillTakingLongerThanExpected(null)).to.be.false;
  });

  it('returns true if both refillDate and refillSubmitDate are present and valid for refillinprocess', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: eightDaysAgo,
      refillSubmitDate: eightDaysAgo,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.true;
  });

  it('returns false if both refillDate and refillSubmitDate are not parsable', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: 'not-a-date',
      refillSubmitDate: 'not-a-date',
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if rxRfRecords is present but empty', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      rxRfRecords: [],
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if both refillDate and refillSubmitDate are empty strings', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: '',
      refillSubmitDate: '',
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if both refillDate and refillSubmitDate are null', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: null,
      refillSubmitDate: null,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if both refillDate and refillSubmitDate are undefined', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: undefined,
      refillSubmitDate: undefined,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if dispStatus is unexpected value', () => {
    const rx = {
      dispStatus: 'unknownstatus',
      refillDate: isoNow,
      refillSubmitDate: isoNow,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if rxRfRecords is not an array', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      rxRfRecords: null,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if rx is an empty object', () => {
    expect(isRefillTakingLongerThanExpected({})).to.be.false;
  });

  it('returns false if both dates are valid but dispStatus is submitted', () => {
    const rx = {
      dispStatus: dispStatusObj.submitted,
      refillDate: isoNow,
      refillSubmitDate: isoNow,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns true if refillDate is in the future and refillSubmitDate is in the past', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: tomorrow,
      refillSubmitDate: eightDaysAgo,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns true if refillDate is in the past and refillSubmitDate is in the past', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: eightDaysAgo,
      refillSubmitDate: eightDaysAgo,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.true;
  });

  it('returns true if refillSubmitDate is more than 7 days ago and dispStatus is submitted', () => {
    const rx = {
      dispStatus: dispStatusObj.submitted,
      refillSubmitDate: eightDaysAgo,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.true;
  });

  it('returns false if refillSubmitDate is less than 7 days ago and dispStatus is submitted', () => {
    const rx = {
      dispStatus: dispStatusObj.submitted,
      refillSubmitDate: yesterday,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if rxRfRecords[0] is an empty object', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      rxRfRecords: [{}],
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });
});
