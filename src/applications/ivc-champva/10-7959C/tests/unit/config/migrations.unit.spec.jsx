import { expect } from 'chai';
import migrations from '../../../config/migrations';

const EXAMPLE_SIP_METADATA = {
  version: 0,
  prefill: true,
  returnUrl: '/form-signature',
};

const deepCopy = obj => JSON.parse(JSON.stringify(obj));

const runMigration = (
  migrationIndex,
  formData,
  metadata = EXAMPLE_SIP_METADATA,
) => migrations[migrationIndex](deepCopy({ formData, metadata }));

const upload = (side, overrides = {}) => ({
  name: `${side}.png`,
  confirmationCode: `${side}-confirmation-code`,
  attachmentId: `${side.charAt(0).toUpperCase() +
    side.slice(1)} of insurance card`,
  isEncrypted: false,
  ...overrides,
});

describe('10-7959c migrations', () => {
  context('migration 0 -> 1: migrateCardUploadKeys', () => {
    const oldKeys = [
      'applicantMedicarePartAPartBCard',
      'applicantMedicarePartDCard',
      'primaryInsuranceCard',
      'secondaryInsuranceCard',
    ];

    it('should split a card upload into front/back arrays', () => {
      const formData = {
        applicantMedicarePartAPartBCard: [upload('front'), upload('back')],
      };
      const { formData: migrated } = runMigration(0, formData);
      expect(
        migrated.applicantMedicarePartAPartBCardFront,
      ).to.exist.and.to.have.lengthOf(1);
      expect(
        migrated.applicantMedicarePartAPartBCardBack,
      ).to.exist.and.to.have.lengthOf(1);
      expect(migrated.applicantMedicarePartAPartBCard).to.be.undefined;
    });

    it('should not modify form data when no legacy card upload keys exist', () => {
      const formData = { applicantName: { first: 'John', last: 'Lastname' } };
      const { formData: migrated } = runMigration(0, formData);
      expect(migrated).to.deep.equal(formData);
    });

    it('should remove all legacy card upload keys when present', () => {
      const formData = {
        applicantName: { first: 'John', last: 'Lastname' },
        applicantMedicarePartAPartBCard: [upload('front')],
        primaryInsuranceCard: [upload('back')],
      };
      const { formData: migrated } = runMigration(0, formData);
      oldKeys.forEach(k => expect(migrated[k]).to.be.undefined);
    });

    it('should remove legacy keys from `missingUploads` if present', () => {
      const formData = {
        missingUploads: [
          {
            name: 'applicantMedicarePartAPartBCard',
            path: 'medicare-ab-upload',
            required: true,
            uploaded: false,
          },
          {
            name: 'someOtherField',
            path: 'other-upload',
            required: true,
            uploaded: false,
          },
        ],
      };
      const { formData: migrated } = runMigration(0, formData);
      expect(migrated.missingUploads).to.have.lengthOf(1);
      expect(migrated.missingUploads[0].name).to.eq('someOtherField');
    });
  });

  context('migration 1 -> 2: migrateBenefitStatusToViewField', () => {
    it('should rename `champvaBenefitStatus` to `view:champvaBenefitStatus`', () => {
      const formData = {
        champvaBenefitStatus: 'enrolled',
        applicantName: { first: 'John', last: 'Lastname' },
      };
      const { formData: migrated } = runMigration(1, formData);
      expect(migrated['view:champvaBenefitStatus']).to.eq('enrolled');
      expect(migrated.champvaBenefitStatus).to.be.undefined;
    });

    it('should not modify form data when `champvaBenefitStatus` is not present', () => {
      const formData = { applicantName: { first: 'John', last: 'Lastname' } };
      const { formData: migrated } = runMigration(1, formData);
      expect(migrated).to.deep.equal(formData);
      expect(migrated['view:champvaBenefitStatus']).to.be.undefined;
    });

    it('should preserve other form data fields', () => {
      const formData = {
        champvaBenefitStatus: 'enrolled',
        applicantName: { first: 'John', last: 'Lastname' },
        otherField: 'some value',
      };
      const { formData: migrated } = runMigration(1, formData);
      expect(migrated.applicantName).to.deep.equal({
        first: 'John',
        last: 'Lastname',
      });
      expect(migrated.otherField).to.eq('some value');
    });

    it('should preserve metadata', () => {
      const formData = { champvaBenefitStatus: 'enrolled' };
      const { metadata } = runMigration(1, formData);
      expect(metadata).to.deep.equal(EXAMPLE_SIP_METADATA);
    });
  });
});
