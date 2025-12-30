import { expect } from 'chai';
import {
  generateVitalsIntro,
  generateVitalsContent,
  generateVitalContent,
  generateVitalsItem,
  generateVitalsContentByType,
} from '../../../util/pdfHelpers/vitals';
import { vitalTypeDisplayNames } from '../../../util/constants';

describe('PDF Helpers for Vitals - Undefined Access Protection Tests', () => {
  describe('generateVitalsIntro', () => {
    it('should not throw when records array is empty', () => {
      const records = [];
      expect(() => generateVitalsIntro(records, 'Last updated')).to.not.throw();
      const result = generateVitalsIntro(records, 'Last updated');
      expect(result.title).to.be.undefined;
    });

    it('should not throw when records[0] is undefined', () => {
      const records = [undefined];
      expect(() => generateVitalsIntro(records, 'Last updated')).to.not.throw();
      const result = generateVitalsIntro(records, 'Last updated');
      expect(result.title).to.be.undefined;
    });

    it('should not throw when records[0].type is undefined', () => {
      const records = [{}];
      expect(() => generateVitalsIntro(records, 'Last updated')).to.not.throw();
      const result = generateVitalsIntro(records, 'Last updated');
      expect(result.title).to.be.undefined;
    });

    it('should handle null records gracefully', () => {
      const records = null;
      expect(() => generateVitalsIntro(records, 'Last updated')).to.not.throw();
    });

    it('should correctly generate intro when valid data exists', () => {
      const records = [
        { type: 'BLOOD_PRESSURE', name: 'Blood Pressure' },
        { type: 'BLOOD_PRESSURE', name: 'Blood Pressure' },
      ];
      const result = generateVitalsIntro(records, 'Last updated: Jan 1, 2024');
      expect(result.title).to.equal(vitalTypeDisplayNames.BLOOD_PRESSURE);
      expect(result.subject).to.equal('VA Medical Record');
      expect(result.subtitles).to.include('Last updated: Jan 1, 2024');
      expect(result.subtitles[2]).to.equal(
        'Showing 2 records from newest to oldest',
      );
    });

    it('should handle records with missing length property', () => {
      const records = { type: 'WEIGHT' };
      expect(() => generateVitalsIntro(records, 'Last updated')).to.not.throw();
    });
  });

  describe('generateVitalsContent', () => {
    it('should not throw when records array is empty', () => {
      const records = [];
      expect(() => generateVitalsContent(records)).to.not.throw();
      const result = generateVitalsContent(records);
      expect(result.results.header).to.be.undefined;
    });

    it('should not throw when records[0] is undefined', () => {
      const records = [undefined];
      expect(() => generateVitalsContent(records)).to.not.throw();
      const result = generateVitalsContent(records);
      expect(result.results.header).to.be.undefined;
    });

    it('should not throw when records[0].name is undefined', () => {
      const records = [{}];
      expect(() => generateVitalsContent(records)).to.not.throw();
      const result = generateVitalsContent(records);
      expect(result.results.header).to.be.undefined;
    });

    it('should handle null records gracefully', () => {
      const records = null;
      expect(() => generateVitalsContent(records)).to.not.throw();
    });

    it('should correctly generate content when valid data exists', () => {
      const records = [
        {
          name: 'Blood Pressure',
          date: 'January 15, 2024',
          measurement: '120/80',
          location: 'VA Medical Center',
          notes: 'Patient stable',
        },
      ];
      const result = generateVitalsContent(records);
      expect(result.results.header).to.equal('Blood Pressure');
      expect(result.results.headerType).to.equal('H3');
      expect(result.results.items).to.have.lengthOf(1);
      expect(result.results.items[0].header).to.equal('January 15, 2024');
    });

    it('should handle multiple records correctly', () => {
      const records = [
        {
          name: 'Weight',
          date: 'January 15, 2024',
          measurement: '180 lb',
          location: 'VA Clinic',
          notes: 'None recorded',
        },
        {
          name: 'Weight',
          date: 'January 1, 2024',
          measurement: '185 lb',
          location: 'VA Clinic',
          notes: 'None recorded',
        },
      ];
      const result = generateVitalsContent(records);
      expect(result.results.header).to.equal('Weight');
      expect(result.results.items).to.have.lengthOf(2);
    });
  });

  describe('generateVitalsItem', () => {
    it('should generate item with all fields', () => {
      const record = {
        date: 'January 15, 2024',
        measurement: '98.6°F',
        location: 'VA Medical Center',
        notes: 'Patient feeling well',
      };
      const result = generateVitalsItem(record);
      expect(result.header).to.equal('January 15, 2024');
      expect(result.items).to.have.lengthOf(3);
      expect(result.items[0].value).to.equal('98.6°F');
      expect(result.items[1].value).to.equal('VA Medical Center');
      expect(result.items[2].value).to.equal('Patient feeling well');
    });

    it('should handle record with missing fields', () => {
      const record = {};
      expect(() => generateVitalsItem(record)).to.not.throw();
      const result = generateVitalsItem(record);
      expect(result.items).to.have.lengthOf(3);
    });
  });

  describe('generateVitalContent', () => {
    it('should handle empty records array', () => {
      const records = [];
      expect(() => generateVitalContent(records)).to.not.throw();
      const result = generateVitalContent(records);
      expect(result.results.items).to.be.an('array');
      expect(result.results.items).to.have.lengthOf(0);
    });

    it('should map records correctly', () => {
      const records = [
        {
          date: 'January 15, 2024',
          measurement: '120/80',
          location: 'VA Clinic',
          notes: 'None recorded',
        },
      ];
      const result = generateVitalContent(records);
      expect(result.results.items).to.have.lengthOf(1);
      expect(result.results.items[0].header).to.equal('January 15, 2024');
    });
  });

  describe('generateVitalsContentByType', () => {
    it('should handle empty records array', () => {
      const records = [];
      expect(() => generateVitalsContentByType(records)).to.not.throw();
      const result = generateVitalsContentByType(records);
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(0);
    });

    it('should group records by type', () => {
      const records = [
        {
          type: 'BLOOD_PRESSURE',
          name: 'Blood Pressure',
          date: 'January 15, 2024',
          measurement: '120/80',
          location: 'VA Clinic',
          notes: 'None recorded',
        },
        {
          type: 'WEIGHT',
          name: 'Weight',
          date: 'January 15, 2024',
          measurement: '180 lb',
          location: 'VA Clinic',
          notes: 'None recorded',
        },
        {
          type: 'BLOOD_PRESSURE',
          name: 'Blood Pressure',
          date: 'January 10, 2024',
          measurement: '118/78',
          location: 'VA Clinic',
          notes: 'None recorded',
        },
      ];
      const result = generateVitalsContentByType(records);
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
    });

    it('should handle records with undefined type', () => {
      const records = [
        {
          name: 'Blood Pressure',
          date: 'January 15, 2024',
          measurement: '120/80',
        },
      ];
      expect(() => generateVitalsContentByType(records)).to.not.throw();
    });
  });
});
