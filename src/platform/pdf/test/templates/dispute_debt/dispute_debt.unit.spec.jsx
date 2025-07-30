import { expect } from 'chai';
import sinon from 'sinon';
import { MissingFieldsException } from '../../../utils/exceptions/MissingFieldsException';

const getStream = require('get-stream');

// Workaround for pdf.js incompatibility.
// cf. https://github.com/mozilla/pdf.js/issues/15728
const originalPlatform = navigator.platform;
navigator.platform = '';

const pdfjs = require('pdfjs-dist/legacy/build/pdf');

describe('Dispute Debt PDF template', () => {
  let template;
  let fetchStub;

  before(() => {
    // Mock fetch for the logo with a proper absolute URL
    fetchStub = sinon.stub(global, 'fetch');
    const mockArrayBuffer = new ArrayBuffer(8);
    // Mock any URL that contains the logo path
    fetchStub.callsFake(url => {
      if (url.includes('logo-black-and-white.png')) {
        return Promise.resolve({
          arrayBuffer: () => Promise.resolve(mockArrayBuffer),
        });
      }
      return Promise.reject(new Error(`Unexpected fetch to ${url}`));
    });
  });

  after(() => {
    navigator.platform = originalPlatform;
    fetchStub.restore();
  });

  beforeEach(() => {
    template = require('../../../templates/dispute_debt');
  });

  const generatePdf = async (data, config) => {
    const doc = await template.generate(data, config);
    doc.end();
    return getStream.buffer(doc);
  };

  const generateAndParsePdf = async (data, config) => {
    const pdfData = await generatePdf(data, config);
    const pdf = await pdfjs.getDocument(pdfData).promise;
    const metadata = await pdf.getMetadata();

    return { metadata, pdf };
  };

  describe('Validation function', () => {
    let validData;
    let validate;

    beforeEach(() => {
      validData = require('./fixture.json');
      validate = template.validate;
    });

    it('should pass validation with complete valid data', () => {
      expect(() => validate(validData)).to.not.throw();
    });

    it('should throw MissingFieldsException when top-level data fields are missing', () => {
      const invalidData = {};

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        'The following fields are required: data.selectedDebts, data.submissionDetails, data.veteran',
      );
    });

    it('should throw MissingFieldsException when selectedDebts is missing', () => {
      const invalidData = {
        ...validData,
        selectedDebts: undefined,
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        'data.selectedDebts',
      );
    });

    it('should throw MissingFieldsException when selectedDebts is empty array', () => {
      const invalidData = {
        ...validData,
        selectedDebts: [],
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        'selectedDebts (must be a non-empty array)',
      );
    });

    it('should throw MissingFieldsException when submissionDetails.submissionDateTime is missing', () => {
      const invalidData = {
        ...validData,
        submissionDetails: {},
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        'submissionDetails.submissionDateTime',
      );
    });

    it('should throw MissingFieldsException when veteran required fields are missing', () => {
      const invalidData = {
        ...validData,
        veteran: {
          veteranFullName: validData.veteran.veteranFullName,
          mailingAddress: validData.veteran.mailingAddress,
          mobilePhone: validData.veteran.mobilePhone,
        },
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        /veteran\.dob.*veteran\.ssnLastFour.*veteran\.email/,
      );
    });

    it('should throw MissingFieldsException when veteranFullName fields are missing', () => {
      const invalidData = {
        ...validData,
        veteran: {
          ...validData.veteran,
          veteranFullName: {
            middle: 'Michael',
            suffix: 'Jr',
          },
        },
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        /veteran\.veteranFullName\.first.*veteran\.veteranFullName\.last/,
      );
    });

    it('should throw MissingFieldsException when mailingAddress fields are missing', () => {
      const invalidData = {
        ...validData,
        veteran: {
          ...validData.veteran,
          mailingAddress: {
            addressLine2: 'Apt 4B',
            addressLine3: '',
          },
        },
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        /veteran\.mailingAddress\.addressLine1.*veteran\.mailingAddress\.city.*veteran\.mailingAddress\.countryName.*veteran\.mailingAddress\.zipCode.*veteran\.mailingAddress\.stateCode/,
      );
    });

    it('should throw MissingFieldsException when mobilePhone fields are missing', () => {
      const invalidData = {
        ...validData,
        veteran: {
          ...validData.veteran,
          mobilePhone: {
            extension: '123',
          },
        },
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        /veteran\.mobilePhone\.phoneNumber.*veteran\.mobilePhone\.countryCode.*veteran\.mobilePhone\.areaCode/,
      );
    });

    it('should throw MissingFieldsException when debt fields are missing', () => {
      const invalidData = {
        ...validData,
        selectedDebts: [
          {
            deductionCode: '41',
          },
          {
            label: 'Valid debt',
            disputeReason: 'Valid reason',
            supportStatement: 'Valid statement',
          },
        ],
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        /selectedDebts\[0\]\.label.*selectedDebts\[0\]\.disputeReason.*selectedDebts\[0\]\.supportStatement/,
      );
    });

    it('should handle multiple missing fields correctly', () => {
      const invalidData = {
        selectedDebts: [
          {
            // missing all required debt fields
          },
        ],
        submissionDetails: {
          // missing submissionDateTime
        },
        veteran: {
          // missing all required veteran fields
        },
      };

      try {
        validate(invalidData);
        expect.fail('Should have thrown MissingFieldsException');
      } catch (error) {
        expect(error).to.be.instanceOf(MissingFieldsException);
        // Check that field paths are properly constructed
        expect(error.message).to.include(
          'submissionDetails.submissionDateTime',
        );
        expect(error.message).to.include('veteran.dob');
        expect(error.message).to.include('veteran.veteranFullName');
        expect(error.message).to.include('veteran.mailingAddress');
        expect(error.message).to.include('veteran.mobilePhone');
        expect(error.message).to.include('selectedDebts[0].label');
      }
    });

    it('should handle multiple debts validation correctly', () => {
      const invalidData = {
        ...validData,
        selectedDebts: [
          {
            label: 'Valid debt 1',
            disputeReason: 'Valid reason 1',
            supportStatement: 'Valid statement 1',
          },
          {
            // missing all required fields
            deductionCode: '41',
          },
          {
            label: 'Valid debt 3',
            // missing disputeReason and supportStatement
          },
        ],
      };

      expect(() => validate(invalidData)).to.throw(
        MissingFieldsException,
        /selectedDebts\[1\]\.label.*selectedDebts\[1\]\.disputeReason.*selectedDebts\[1\]\.supportStatement.*selectedDebts\[2\]\.disputeReason.*selectedDebts\[2\]\.supportStatement/,
      );
    });

    it('should validate exports are available', () => {
      expect(template.generate).to.be.a('function');
      expect(template.validate).to.be.a('function');
    });
  });

  describe('PDF Generation', () => {
    let validData;

    beforeEach(() => {
      validData = require('./fixture.json');
    });

    it('should generate a valid PDF with correct metadata', async () => {
      const { metadata } = await generateAndParsePdf(validData);

      expect(metadata.info.Author).to.equal(
        'U.S. Department of Veterans Affairs',
      );
      expect(metadata.info.Subject).to.equal('Debt dispute from VA.gov');
      expect(metadata.info.Title).to.equal('Debt Dispute');
    });

    it('should include main heading in PDF', async () => {
      const { pdf } = await generateAndParsePdf(validData);

      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const textItems = content.items.map(item => item.str).join(' ');
      expect(textItems).to.include('Debt dispute from VA.gov');
    });

    it('should include DMC routing information based on deduction codes', async () => {
      const { pdf } = await generateAndParsePdf(validData);

      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const textItems = content.items.map(item => item.str).join(' ');
      // Since fixture has deductionCode "30", should show C&P Dispute
      expect(textItems).to.include('DMC Routing: C&P Dispute');
    });

    it('should show Education Dispute when no C&P debts are present', async () => {
      const educationOnlyData = {
        ...validData,
        selectedDebts: [
          {
            ...validData.selectedDebts[0],
            deductionCode: '41', // Education code
          },
        ],
      };

      const { pdf } = await generateAndParsePdf(educationOnlyData);

      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const textItems = content.items.map(item => item.str).join(' ');
      expect(textItems).to.include('DMC Routing: Education Dispute');
    });

    it('should include veteran personal information', async () => {
      const { pdf } = await generateAndParsePdf(validData);

      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const textItems = content.items.map(item => item.str).join(' ');
      expect(textItems).to.include('John');
      expect(textItems).to.include('Doe');
      expect(textItems).to.include('March 15, 1985');
    });

    it('should include submission details with formatted date and time', async () => {
      const { pdf } = await generateAndParsePdf(validData);

      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const textItems = content.items.map(item => item.str).join(' ');
      expect(textItems).to.include('January 15, 2024');
      expect(textItems).to.include('ET');
    });

    it('should include all selected debts with dispute information', async () => {
      const { pdf } = await generateAndParsePdf(validData);

      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const textItems = content.items.map(item => item.str).join(' ');
      expect(textItems).to.include('Education debt for period');
      expect(textItems).to.include('I believe this debt is incorrect');
      expect(textItems).to.include('Compensation and pension overpayment');
      expect(textItems).to.include(
        'Medical records were not properly reviewed',
      );
    });
  });

  describe('Edge cases', () => {
    let validData;

    beforeEach(() => {
      validData = require('./fixture.json');
    });

    it('should handle veteran name without middle name or suffix', async () => {
      const dataWithoutMiddleName = {
        ...validData,
        veteran: {
          ...validData.veteran,
          veteranFullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      };

      await expect(template.generate(dataWithoutMiddleName)).to.not.be.rejected;
      const { pdf } = await generateAndParsePdf(dataWithoutMiddleName);

      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const textItems = content.items.map(item => item.str).join(' ');
      expect(textItems).to.include('John');
      expect(textItems).to.include('Doe');
    });

    it('should handle mailing address without optional address lines', async () => {
      const dataWithMinimalAddress = {
        ...validData,
        veteran: {
          ...validData.veteran,
          mailingAddress: {
            addressLine1: '123 Main Street',
            city: 'Washington',
            countryName: 'United States',
            zipCode: '20001',
            stateCode: 'DC',
          },
        },
      };

      await expect(template.generate(dataWithMinimalAddress)).to.not.be
        .rejected;
    });

    it('should handle phone number without extension', async () => {
      const dataWithoutExtension = {
        ...validData,
        veteran: {
          ...validData.veteran,
          mobilePhone: {
            phoneNumber: '5551234',
            countryCode: '+1',
            areaCode: '202',
          },
        },
      };

      await expect(template.generate(dataWithoutExtension)).to.not.be.rejected;
    });
  });
});
