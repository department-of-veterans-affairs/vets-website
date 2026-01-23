import { expect } from 'chai';
import {
  createPdfField,
  createTxtField,
  buildInstructionsField,
  buildReasonForUseField,
  buildFacilityField,
  buildProviderField,
  buildDateField,
  buildAllergyPdfItem,
  buildAllergyTxtItem,
  buildAllergiesPdfList,
  buildAllergiesPdfSection,
  buildAllergiesTxtSection,
} from '../../../util/rxExport/rxBuilders';
import {
  ALLERGIES_SECTION_HEADER,
  ALLERGIES_ERROR_MESSAGE,
  ALLERGIES_EMPTY_MESSAGE,
} from '../../../util/rxExport/staticContent';

describe('Rx Export Builders', () => {
  describe('createPdfField', () => {
    it('should create field with title and value', () => {
      const result = createPdfField('Status', 'Active');
      expect(result).to.deep.equal({
        title: 'Status',
        value: 'Active',
        inline: true,
      });
    });

    it('should allow inline override', () => {
      const result = createPdfField('Description', 'Long text', {
        inline: false,
      });
      expect(result.inline).to.equal(false);
    });

    it('should pass through additional options', () => {
      const result = createPdfField('Test', 'Value', { isRich: true });
      expect(result.isRich).to.equal(true);
    });
  });

  describe('createTxtField', () => {
    it('should create formatted text line', () => {
      const result = createTxtField('Status', 'Active');
      expect(result).to.equal('Status: Active');
    });

    it('should handle missing value', () => {
      const result = createTxtField('Status', null);
      expect(result).to.equal('Status: Status not available');
    });
  });

  describe('buildInstructionsField', () => {
    it('should build PDF instructions field', () => {
      const prescription = { sig: 'Take twice daily' };
      const result = buildInstructionsField(prescription, 'pdf');
      expect(result.title).to.equal('Instructions');
      expect(result.value).to.equal('Take twice daily');
    });

    it('should build TXT instructions field', () => {
      const prescription = { sig: 'Take twice daily' };
      const result = buildInstructionsField(prescription, 'txt');
      expect(result).to.equal('Instructions: Take twice daily');
    });

    it('should handle missing instructions', () => {
      const prescription = {};
      const result = buildInstructionsField(prescription, 'pdf');
      expect(result.value).to.equal('Instructions not available');
    });
  });

  describe('buildReasonForUseField', () => {
    it('should build PDF reason for use field', () => {
      const prescription = { indicationForUse: 'Pain relief' };
      const result = buildReasonForUseField(prescription, 'pdf');
      expect(result.title).to.equal('Reason for use');
      expect(result.value).to.equal('Pain relief');
    });

    it('should handle missing reason', () => {
      const prescription = {};
      const result = buildReasonForUseField(prescription, 'pdf');
      expect(result.value).to.equal('Reason for use not available');
    });
  });

  describe('buildFacilityField', () => {
    it('should build PDF facility field', () => {
      const prescription = { facilityName: 'VA Medical Center' };
      const result = buildFacilityField(prescription, 'pdf');
      expect(result.title).to.equal('Facility');
      expect(result.value).to.equal('VA Medical Center');
    });
  });

  describe('buildProviderField', () => {
    it('should format provider name', () => {
      const prescription = {
        providerFirstName: 'Jane',
        providerLastName: 'Smith',
      };
      const result = buildProviderField(prescription, 'pdf');
      expect(result.value).to.equal('Jane Smith');
    });

    it('should use custom label', () => {
      const prescription = {
        providerFirstName: 'Jane',
        providerLastName: 'Smith',
      };
      const result = buildProviderField(prescription, 'pdf', 'Documented by');
      expect(result.title).to.equal('Documented by');
    });
  });

  describe('buildDateField', () => {
    it('should format date for PDF', () => {
      const result = buildDateField('2024-06-15', 'pdf', 'Last filled on');
      expect(result.title).to.equal('Last filled on');
      expect(result.value).to.equal('June 15, 2024');
    });

    it('should format date for TXT', () => {
      const result = buildDateField('2024-06-15', 'txt', 'Last filled on');
      expect(result).to.equal('Last filled on: June 15, 2024');
    });

    it('should handle missing date', () => {
      const result = buildDateField(null, 'pdf', 'Last filled on');
      expect(result.value).to.equal('Date not available');
    });
  });

  describe('buildAllergyPdfItem', () => {
    it('should build allergy PDF item', () => {
      const allergy = {
        name: 'Penicillin',
        reaction: ['Rash', 'Hives'],
        type: 'Drug',
        observedOrReported: 'Observed',
      };
      const result = buildAllergyPdfItem(allergy);
      expect(result.header).to.equal('Penicillin');
      expect(result.sections[0].items).to.have.length(3);
    });
  });

  describe('buildAllergyTxtItem', () => {
    it('should build allergy TXT item', () => {
      const allergy = {
        name: 'Penicillin',
        reaction: ['Rash'],
        type: 'Drug',
        observedOrReported: 'Observed',
      };
      const result = buildAllergyTxtItem(allergy);
      expect(result).to.include('Penicillin');
      expect(result).to.include('Signs and symptoms: Rash');
      expect(result).to.include('Type of allergy: Drug');
    });
  });

  describe('buildAllergiesPdfList', () => {
    it('should build list of allergy PDF items', () => {
      const allergies = [
        {
          name: 'Penicillin',
          reaction: [],
          type: 'Drug',
          observedOrReported: 'Observed',
        },
        {
          name: 'Peanuts',
          reaction: [],
          type: 'Food',
          observedOrReported: 'Reported',
        },
      ];
      const result = buildAllergiesPdfList(allergies);
      expect(result).to.have.length(2);
    });

    it('should return empty array for null', () => {
      expect(buildAllergiesPdfList(null)).to.deep.equal([]);
    });
  });

  describe('buildAllergiesPdfSection', () => {
    it('should build section with allergies', () => {
      const allergies = [
        {
          name: 'Penicillin',
          reaction: [],
          type: 'Drug',
          observedOrReported: 'Observed',
        },
      ];
      const result = buildAllergiesPdfSection(allergies);
      expect(result.header).to.equal(ALLERGIES_SECTION_HEADER);
      expect(result.list).to.have.length(1);
      expect(result.preface).to.be.an('array');
    });

    it('should handle empty allergies', () => {
      const result = buildAllergiesPdfSection([]);
      expect(result.preface).to.equal(ALLERGIES_EMPTY_MESSAGE);
      expect(result.list).to.deep.equal([]);
    });

    it('should handle null allergies (error state)', () => {
      const result = buildAllergiesPdfSection(null);
      expect(result.preface[0].value).to.equal(ALLERGIES_ERROR_MESSAGE);
    });
  });

  describe('buildAllergiesTxtSection', () => {
    it('should build TXT section with allergies', () => {
      const allergies = [
        {
          name: 'Penicillin',
          reaction: ['Rash'],
          type: 'Drug',
          observedOrReported: 'Observed',
        },
      ];
      const result = buildAllergiesTxtSection(allergies);
      expect(result).to.include(ALLERGIES_SECTION_HEADER);
      expect(result).to.include('Penicillin');
    });

    it('should handle empty allergies', () => {
      const result = buildAllergiesTxtSection([]);
      expect(result).to.include(ALLERGIES_SECTION_HEADER);
      expect(result).to.include('no allergies');
    });

    it('should handle null allergies (error state)', () => {
      const result = buildAllergiesTxtSection(null);
      expect(result).to.include("couldn't access");
    });
  });
});
