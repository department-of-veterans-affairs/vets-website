import { expect } from 'chai';
import {
  fieldsToPdf,
  fieldsToTxt,
  renderNonVAPrescriptionPdf,
  renderNonVAPrescriptionTxt,
  renderPrescriptionListPdf,
  renderPrescriptionListTxt,
  renderAllergiesPdfSection,
  renderAllergiesTxtSection,
  // Backward-compatible wrappers
  buildNonVAPrescriptionPDFList,
  buildPrescriptionsPDFList,
  buildVAPrescriptionPDFList,
  buildAllergiesPDFList,
  buildNonVAPrescriptionTXT,
  buildPrescriptionsTXT,
  buildVAPrescriptionTXT,
  buildAllergiesTXT,
  buildAllergyPdfItem,
  buildAllergyTxtItem,
  buildAllergiesPdfList,
  buildAllergiesPdfSection,
  buildAllergiesTxtSection,
  buildMedicationInformationPDF,
} from '../../../util/rxExport/rxRenderer';
import {
  ALLERGIES_SECTION_HEADER,
  ALLERGIES_ERROR_MESSAGE,
  ALLERGIES_EMPTY_MESSAGE,
} from '../../../util/rxExport/staticContent';

describe('Prescription Renderer', () => {
  describe('fieldsToPdf', () => {
    it('should convert text fields to PDF format', () => {
      const fields = [
        { label: 'Status', value: 'Active', type: 'text' },
        { label: 'Facility', value: 'VA Medical Center', type: 'text' },
      ];

      const result = fieldsToPdf(fields);

      expect(result).to.have.length(2);
      expect(result[0]).to.deep.include({
        title: 'Status',
        value: 'Active',
        inline: true,
      });
    });

    it('should handle rich fields', () => {
      const fields = [
        { label: '', value: ['Line 1', 'Line 2'], type: 'rich' },
      ];

      const result = fieldsToPdf(fields);

      expect(result[0]).to.deep.include({
        isRich: true,
        value: ['Line 1', 'Line 2'],
      });
    });

    it('should filter out null fields', () => {
      const fields = [
        { label: 'Status', value: 'Active', type: 'text' },
        null,
        { label: 'Facility', value: 'VA', type: 'text' },
      ];

      const result = fieldsToPdf(fields);
      expect(result).to.have.length(2);
    });

    it('should apply indent when provided', () => {
      const fields = [{ label: 'Status', value: 'Active', type: 'text' }];

      const result = fieldsToPdf(fields, { indent: 32 });

      expect(result[0].indent).to.equal(32);
    });
  });

  describe('fieldsToTxt', () => {
    it('should convert fields to text lines', () => {
      const fields = [
        { label: 'Status', value: 'Active', type: 'text' },
        { label: 'Facility', value: 'VA Medical Center', type: 'text' },
      ];

      const result = fieldsToTxt(fields);

      expect(result).to.include('Status: Active');
      expect(result).to.include('Facility: VA Medical Center');
    });

    it('should filter out PDF-only fields', () => {
      const fields = [
        { label: 'Status', value: 'Active', type: 'text' },
        { label: 'Rich', value: [], type: 'rich', pdfOnly: true },
      ];

      const result = fieldsToTxt(fields);

      expect(result).to.include('Status: Active');
      expect(result).to.not.include('Rich');
    });

    it('should use txtValue when available', () => {
      const fields = [
        {
          label: 'Status',
          value: 'Active (PDF)',
          txtValue: 'Active (TXT)',
          type: 'text',
        },
      ];

      const result = fieldsToTxt(fields);

      expect(result).to.include('Active (TXT)');
      expect(result).to.not.include('Active (PDF)');
    });
  });

  describe('renderNonVAPrescriptionPdf', () => {
    const nonVaData = {
      name: 'Ibuprofen 200mg',
      type: 'non-va',
      fields: [
        { label: 'Instructions', value: 'Take as needed', type: 'text' },
        { label: 'Status', value: 'Active: Non-VA', type: 'text' },
      ],
    };

    it('should render Non-VA prescription to PDF format', () => {
      const result = renderNonVAPrescriptionPdf(nonVaData);

      expect(result.header).to.equal('Ibuprofen 200mg');
      expect(result.sections).to.be.an('array');
      expect(result.sections[0].items).to.be.an('array');
    });
  });

  describe('renderNonVAPrescriptionTxt', () => {
    const nonVaData = {
      name: 'Ibuprofen 200mg',
      type: 'non-va',
      fields: [
        { label: 'Instructions', value: 'Take as needed', type: 'text' },
        { label: 'Status', value: 'Active: Non-VA', type: 'text' },
        {
          label: 'When you started taking this medication',
          value: 'June 15, 2024',
          type: 'date',
        },
        { label: 'Documented by', value: 'Jane Smith', type: 'text' },
        {
          label: 'Documented at this facility',
          value: 'VA Medical Center',
          type: 'text',
        },
      ],
    };

    it('should render Non-VA prescription to TXT format', () => {
      const result = renderNonVAPrescriptionTxt(nonVaData);

      expect(result).to.include('Ibuprofen 200mg');
      expect(result).to.include('Instructions');
    });

    it('should include separator when includeSeparators is true', () => {
      const result = renderNonVAPrescriptionTxt(nonVaData, {
        includeSeparators: true,
      });

      expect(result).to.include('---');
    });

    it('should exclude separator when includeSeparators is false', () => {
      const result = renderNonVAPrescriptionTxt(nonVaData, {
        includeSeparators: false,
      });

      expect(result).to.not.match(/^[\n]*-+/);
    });
  });

  describe('renderPrescriptionListPdf', () => {
    it('should render mixed prescription list to PDF', () => {
      const prescriptions = [
        {
          name: 'VA Med',
          type: 'va',
          fields: [{ label: 'Status', value: 'Active', type: 'text' }],
        },
        {
          name: 'Non-VA Med',
          type: 'non-va',
          fields: [{ label: 'Status', value: 'Active: Non-VA', type: 'text' }],
        },
      ];

      const result = renderPrescriptionListPdf(prescriptions);

      expect(result).to.have.length(2);
      expect(result[0].header).to.equal('VA Med');
      expect(result[1].header).to.equal('Non-VA Med');
    });
  });

  describe('renderPrescriptionListTxt', () => {
    it('should render prescription list to TXT with separator', () => {
      const prescriptions = [
        {
          name: 'VA Med',
          type: 'va',
          fields: [{ label: 'Status', value: 'Active', type: 'text' }],
        },
      ];

      const result = renderPrescriptionListTxt(prescriptions);

      expect(result).to.include('---');
      expect(result).to.include('VA Med');
    });
  });

  describe('renderAllergiesPdfSection', () => {
    it('should render error state', () => {
      const result = renderAllergiesPdfSection({ state: 'error', items: [] });

      expect(result.header).to.equal(ALLERGIES_SECTION_HEADER);
      expect(result.preface[0].value).to.equal(ALLERGIES_ERROR_MESSAGE);
      expect(result.list).to.be.empty;
    });

    it('should render empty state', () => {
      const result = renderAllergiesPdfSection({ state: 'empty', items: [] });

      expect(result.preface).to.equal(ALLERGIES_EMPTY_MESSAGE);
    });

    it('should render loaded state with allergies', () => {
      const allergiesData = {
        state: 'loaded',
        count: 1,
        items: [
          {
            name: 'Penicillin',
            fields: [
              { label: 'Signs and symptoms', value: ['Rash'], type: 'list' },
              { label: 'Type of allergy', value: 'Drug', type: 'text' },
              { label: 'Observed or historical', value: 'Observed', type: 'text' },
            ],
          },
        ],
      };

      const result = renderAllergiesPdfSection(allergiesData);

      expect(result.list).to.have.length(1);
      expect(result.list[0].header).to.equal('Penicillin');
    });
  });

  describe('renderAllergiesTxtSection', () => {
    it('should render error state', () => {
      const result = renderAllergiesTxtSection({ state: 'error', items: [] });

      expect(result).to.include(ALLERGIES_SECTION_HEADER);
      expect(result).to.include("couldn't access");
    });

    it('should render empty state', () => {
      const result = renderAllergiesTxtSection({ state: 'empty', items: [] });

      expect(result).to.include('no allergies');
    });

    it('should render loaded state with allergies', () => {
      const allergiesData = {
        state: 'loaded',
        count: 1,
        items: [
          {
            name: 'Penicillin',
            fields: [
              { label: 'Signs and symptoms', value: ['Rash'], type: 'list' },
              { label: 'Type of allergy', value: 'Drug', type: 'text' },
              { label: 'Observed or historical', value: 'Observed', type: 'text' },
            ],
          },
        ],
      };

      const result = renderAllergiesTxtSection(allergiesData);

      expect(result).to.include('Penicillin');
      expect(result).to.include('Showing 1 record');
    });
  });

  // ============================================================================
  // Backward-Compatible Wrapper Tests
  // ============================================================================

  describe('Backward-Compatible Wrappers', () => {
    // Sample prescription data for testing
    const mockNonVAPrescription = {
      prescriptionName: 'Non-VA Med',
      prescriptionSource: 'NON_VA',
      sig: 'Take once daily',
      indicationForUse: 'For pain',
      dispensedDate: '2024-01-15',
      providerFirstName: 'John',
      providerLastName: 'Doe',
      facilityName: 'Community Hospital',
    };

    const mockVAPrescription = {
      prescriptionId: 123,
      prescriptionName: 'VA Med',
      prescriptionSource: 'VA',
      prescriptionNumber: 'RX123456',
      sig: 'Take twice daily',
      indicationForUse: 'For treatment',
      sortedDispensedDate: '2024-01-15',
      orderedDate: '2024-01-01',
      expirationDate: '2025-01-01',
      refillRemaining: 3,
      facilityName: 'VA Medical Center',
      phoneNumber: '123-456-7890',
      providerFirstName: 'Jane',
      providerLastName: 'Smith',
      quantity: 30,
      dispStatus: 'Active',
      refillStatus: null,
    };

    const mockAllergy = {
      name: 'Penicillin',
      reaction: ['Rash', 'Hives'],
      type: 'Drug',
      observedOrReported: 'Observed',
    };

    describe('buildNonVAPrescriptionPDFList', () => {
      it('should return an array with PDF config', () => {
        const result = buildNonVAPrescriptionPDFList(mockNonVAPrescription);

        expect(result).to.be.an('array');
        expect(result).to.have.length(1);
        expect(result[0]).to.have.property('sections');
      });

      it('should include prescription name', () => {
        const result = buildNonVAPrescriptionPDFList(mockNonVAPrescription);

        expect(result[0].header).to.equal('Non-VA Med');
      });
    });

    describe('buildPrescriptionsPDFList', () => {
      it('should handle array of prescriptions', () => {
        const prescriptions = [mockNonVAPrescription];
        const result = buildPrescriptionsPDFList(prescriptions);

        expect(result).to.be.an('array');
        expect(result).to.have.length(1);
      });

      it('should return empty array for empty input', () => {
        const result = buildPrescriptionsPDFList([]);
        expect(result).to.be.an('array').that.is.empty;
      });
    });

    describe('buildVAPrescriptionPDFList', () => {
      it('should return PDF config for VA prescription', () => {
        const result = buildVAPrescriptionPDFList(mockVAPrescription);

        expect(result).to.be.an('array');
        expect(result.length).to.be.at.least(1);
      });
    });

    describe('buildAllergiesPDFList', () => {
      it('should convert allergies to PDF format', () => {
        const result = buildAllergiesPDFList([mockAllergy]);

        expect(result).to.have.length(1);
        expect(result[0].header).to.equal('Penicillin');
      });

      it('should return empty array for null input', () => {
        const result = buildAllergiesPDFList(null);
        expect(result).to.be.empty;
      });
    });

    describe('buildNonVAPrescriptionTXT', () => {
      it('should return string content', () => {
        const result = buildNonVAPrescriptionTXT(mockNonVAPrescription);

        expect(result).to.be.a('string');
        expect(result).to.include('Non-VA Med');
      });
    });

    describe('buildPrescriptionsTXT', () => {
      it('should handle array of prescriptions', () => {
        const prescriptions = [mockNonVAPrescription];
        const result = buildPrescriptionsTXT(prescriptions);

        expect(result).to.be.a('string');
        expect(result).to.include('Non-VA Med');
      });
    });

    describe('buildVAPrescriptionTXT', () => {
      it('should return string content for VA prescription', () => {
        const result = buildVAPrescriptionTXT(mockVAPrescription);

        expect(result).to.be.a('string');
        expect(result).to.include('VA Med');
      });
    });

    describe('buildAllergiesTXT', () => {
      it('should convert allergies to TXT format', () => {
        const result = buildAllergiesTXT([mockAllergy]);

        expect(result).to.be.a('string');
        expect(result).to.include('Penicillin');
      });

      it('should handle null (error state)', () => {
        const result = buildAllergiesTXT(null);
        expect(result).to.include("couldn't access");
      });

      it('should handle empty array', () => {
        const result = buildAllergiesTXT([]);
        expect(result).to.include('no allergies');
      });
    });

    describe('buildAllergyPdfItem', () => {
      it('should create PDF item for single allergy', () => {
        const result = buildAllergyPdfItem(mockAllergy);

        expect(result.header).to.equal('Penicillin');
        expect(result.sections).to.have.length(1);
      });
    });

    describe('buildAllergyTxtItem', () => {
      it('should create TXT content for single allergy', () => {
        const result = buildAllergyTxtItem(mockAllergy);

        expect(result).to.include('Penicillin');
        expect(result).to.include('Rash');
      });
    });

    describe('buildAllergiesPdfList', () => {
      it('should create PDF list from allergies', () => {
        const result = buildAllergiesPdfList([mockAllergy]);

        expect(result).to.have.length(1);
        expect(result[0].header).to.equal('Penicillin');
      });

      it('should return empty array for null', () => {
        const result = buildAllergiesPdfList(null);
        expect(result).to.be.empty;
      });
    });

    describe('buildAllergiesPdfSection', () => {
      it('should create PDF section with allergies', () => {
        const result = buildAllergiesPdfSection([mockAllergy]);

        expect(result.header).to.equal(ALLERGIES_SECTION_HEADER);
        expect(result.list).to.have.length(1);
      });

      it('should handle null (error state)', () => {
        const result = buildAllergiesPdfSection(null);

        expect(result.preface[0].value).to.equal(ALLERGIES_ERROR_MESSAGE);
      });

      it('should handle empty array', () => {
        const result = buildAllergiesPdfSection([]);

        expect(result.preface).to.equal(ALLERGIES_EMPTY_MESSAGE);
      });
    });

    describe('buildAllergiesTxtSection', () => {
      it('should create TXT section with allergies', () => {
        const result = buildAllergiesTxtSection([mockAllergy]);

        expect(result).to.include(ALLERGIES_SECTION_HEADER);
        expect(result).to.include('Penicillin');
      });

      it('should handle null (error state)', () => {
        const result = buildAllergiesTxtSection(null);
        expect(result).to.include("couldn't access");
      });

      it('should handle empty array', () => {
        const result = buildAllergiesTxtSection([]);
        expect(result).to.include('no allergies');
      });
    });

    describe('buildMedicationInformationPDF', () => {
      it('should convert parsed HTML to PDF sections', () => {
        const htmlList = [
          { type: 'h2', text: 'Overview' },
          { type: 'p', text: 'This is a description' },
          { type: 'h3', text: 'Dosage' },
          { type: 'li', text: 'Item 1' },
          { type: 'li', text: 'Item 2' },
        ];

        const result = buildMedicationInformationPDF(htmlList);

        expect(result).to.have.property('sections');
        expect(result.sections).to.be.an('array');
        expect(result.sections[0].header).to.equal('Overview');
      });

      it('should handle empty list', () => {
        const result = buildMedicationInformationPDF([]);
        expect(result.sections).to.be.empty;
      });
    });
  });
});
