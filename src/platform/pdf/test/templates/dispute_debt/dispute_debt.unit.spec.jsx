import { expect } from 'chai';
import sinon from 'sinon';
import { MissingFieldsException } from '../../../utils/exceptions/MissingFieldsException';

const getStream = require('get-stream');

const pdfjs = require('pdfjs-dist/legacy/build/pdf');

describe('Dispute Debt PDF template', () => {
  let template;
  let fetchStub;
  let platformStub;

  before(() => {
    // Mock fetch for the logo with a proper absolute URL
    fetchStub = sinon.stub(global, 'fetch');

    // Mock navigator.platform with sinon for pdf.js incompatibility.
    platformStub = sinon.stub(navigator, 'platform').value('');

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
    platformStub.restore();
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

    beforeEach(() => {
      validData = require('./fixture.json');
      validData.submissionDetails.submissionDateTime = new Date(
        '2024-01-15T14:30:00.000Z',
      );
    });

    it('should pass validation with complete valid data', async () => {
      await expect(template.generate(validData)).to.not.be.rejected;
    });

    it('should throw MissingFieldsException when top-level data fields are missing', async () => {
      const invalidData = {};

      await expect(template.generate(invalidData)).to.be.rejectedWith(
        MissingFieldsException,
        'The following fields are required: data.selectedDebts, data.submissionDetails, data.veteran',
      );
    });

    it('should throw MissingFieldsException when selectedDebts is missing', async () => {
      const invalidData = {
        ...validData,
        selectedDebts: undefined,
      };

      await expect(template.generate(invalidData)).to.be.rejectedWith(
        MissingFieldsException,
        'data.selectedDebts',
      );
    });

    it('should throw MissingFieldsException when selectedDebts is empty array', async () => {
      const invalidData = {
        ...validData,
        selectedDebts: [],
      };

      await expect(template.generate(invalidData)).to.be.rejectedWith(
        MissingFieldsException,
        'selectedDebts (must be a non-empty array)',
      );
    });

    it('should throw MissingFieldsException when submissionDetails.submissionDateTime is missing', async () => {
      const invalidData = {
        ...validData,
        submissionDetails: {},
      };

      await expect(template.generate(invalidData)).to.be.rejectedWith(
        MissingFieldsException,
        'submissionDetails.submissionDateTime',
      );
    });

    it('should throw MissingFieldsException when veteran required fields are missing', async () => {
      const invalidData = {
        ...validData,
        veteran: {
          veteranFullName: validData.veteran.veteranFullName,
          mailingAddress: validData.veteran.mailingAddress,
          mobilePhone: validData.veteran.mobilePhone,
        },
      };

      await expect(template.generate(invalidData)).to.be.rejectedWith(
        MissingFieldsException,
        /veteran\.dob.*veteran\.ssnLastFour.*veteran\.email/,
      );
    });

    it('should throw MissingFieldsException when veteranFullName fields are missing', async () => {
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

      await expect(template.generate(invalidData)).to.be.rejectedWith(
        MissingFieldsException,
        /veteran\.veteranFullName\.first.*veteran\.veteranFullName\.last/,
      );
    });

    it('should throw MissingFieldsException when mailingAddress fields are missing', async () => {
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

      await expect(template.generate(invalidData)).to.be.rejectedWith(
        MissingFieldsException,
        /veteran\.mailingAddress\.addressLine1.*veteran\.mailingAddress\.city.*veteran\.mailingAddress\.countryName.*veteran\.mailingAddress\.zipCode.*veteran\.mailingAddress\.stateCode/,
      );
    });

    it('should throw MissingFieldsException when mobilePhone fields are missing', async () => {
      const invalidData = {
        ...validData,
        veteran: {
          ...validData.veteran,
          mobilePhone: {
            extension: '123',
          },
        },
      };

      await expect(template.generate(invalidData)).to.be.rejectedWith(
        MissingFieldsException,
        /veteran\.mobilePhone\.phoneNumber.*veteran\.mobilePhone\.countryCode.*veteran\.mobilePhone\.areaCode/,
      );
    });

    it('should throw MissingFieldsException when debt fields are missing', async () => {
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

      await expect(template.generate(invalidData)).to.be.rejectedWith(
        MissingFieldsException,
        /selectedDebts\[0\]\.label.*selectedDebts\[0\]\.disputeReason.*selectedDebts\[0\]\.supportStatement/,
      );
    });

    it('should handle multiple missing fields correctly', async () => {
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
        await template.generate(invalidData);
        expect.fail('Should have thrown MissingFieldsException');
      } catch (error) {
        expect(error).to.be.instanceOf(MissingFieldsException);
        expect(error.message).to.include(
          'submissionDetails.submissionDateTime',
        );
        expect(error.message).to.include('veteran.dob');
        expect(error.message).to.include('selectedDebts[0].label');
      }
    });
  });

  describe('PDF Generation', () => {
    let validData;

    beforeEach(() => {
      validData = require('./fixture.json');
      validData.submissionDetails.submissionDateTime = new Date(
        '2024-01-15T14:30:00.000Z',
      );
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
      expect(textItems).to.include('DMC routing: C&P Dispute');
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
      expect(textItems).to.include('DMC routing: Education Dispute');
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
      expect(textItems).to.include('1234');
      expect(textItems).to.include('6789');
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

      const pageNumber = 2;
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const textItems = content.items.map(item => item.str).join(' ');
      expect(textItems).to.include('Education debt for period');
      expect(textItems).to.include('think I owe this debt to VA');
      expect(textItems).to.include('Compensation and pension overpayment');
      expect(textItems).to.include('think the amount is correct on this debt');
    });
  });

  describe('Edge cases', () => {
    let validData;

    beforeEach(() => {
      validData = require('./fixture.json');
      validData.submissionDetails.submissionDateTime = new Date(
        '2024-01-15T14:30:00.000Z',
      );
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
