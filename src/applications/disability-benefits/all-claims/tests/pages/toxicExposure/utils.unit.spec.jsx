import { expect } from 'chai';
import { makeDateConfirmationField } from '../../../pages/toxicExposure/utils';

describe('toxic exposure utils', () => {
  describe('makeDateConfirmationField', () => {
    const testLabel = 'Service start date (approximate)';
    const confirmationField = makeDateConfirmationField(testLabel);

    it('returns an object with data and label', () => {
      const result = confirmationField({ formData: '2020-06' });
      expect(result).to.have.keys('data', 'label');
      expect(result.label).to.equal(testLabel);
    });

    it('formats YYYY-MM as month and year', () => {
      expect(confirmationField({ formData: '2023-01' }).data).to.equal(
        'January 2023',
      );
      expect(confirmationField({ formData: '2023-12' }).data).to.equal(
        'December 2023',
      );
    });

    it('formats YYYY-MM-XX as month and year', () => {
      expect(confirmationField({ formData: '2020-12-XX' }).data).to.equal(
        'December 2020',
      );
      expect(confirmationField({ formData: '2021-06-XX' }).data).to.equal(
        'June 2021',
      );
    });

    it('formats YYYY-MM-DD as month and year', () => {
      expect(confirmationField({ formData: '2000-05-15' }).data).to.equal(
        'May 2000',
      );
      expect(confirmationField({ formData: '2020-12-31' }).data).to.equal(
        'December 2020',
      );
    });

    it('formats year-only YYYY-XX as year', () => {
      expect(confirmationField({ formData: '2015-XX' }).data).to.equal('2015');
      expect(confirmationField({ formData: '2000-XX' }).data).to.equal('2000');
    });

    it('formats year-only YYYY-XX-XX as year', () => {
      expect(confirmationField({ formData: '2010-XX-XX' }).data).to.equal(
        '2010',
      );
      expect(confirmationField({ formData: '2015-XX-XX' }).data).to.equal(
        '2015',
      );
    });

    it('displays "Unknown" for missing or empty dates', () => {
      expect(confirmationField({ formData: null }).data).to.equal('Unknown');
      expect(confirmationField({ formData: undefined }).data).to.equal(
        'Unknown',
      );
      expect(confirmationField({ formData: '' }).data).to.equal('Unknown');
      expect(confirmationField({}).data).to.equal('Unknown');
    });

    it('displays "Unknown" for invalid date strings', () => {
      expect(confirmationField({ formData: 'invalid' }).data).to.equal(
        'Unknown',
      );
    });

    it('handles non-string input types', () => {
      expect(confirmationField({ formData: 123 }).data).to.equal('Unknown');
      expect(confirmationField({ formData: {} }).data).to.equal('Unknown');
      expect(confirmationField({ formData: [] }).data).to.equal('Unknown');
    });

    it('uses the label passed to the factory', () => {
      const customLabel = 'Exposure start date (approximate)';
      const customField = makeDateConfirmationField(customLabel);
      const result = customField({ formData: '1999-03' });
      expect(result.label).to.equal(customLabel);
      expect(result.data).to.equal('March 1999');
    });
  });
});
