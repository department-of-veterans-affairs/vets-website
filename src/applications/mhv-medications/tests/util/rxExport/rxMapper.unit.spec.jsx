import { expect } from 'chai';
import {
  mapNonVAPrescription,
  mapVAPrescriptionForList,
  mapVAPrescriptionForDetail,
  mapPrescriptionList,
  mapAllergy,
  mapAllergies,
} from '../../../util/rxExport/rxMapper';
import { RX_SOURCE, DISPENSE_STATUS } from '../../../util/constants';
import { ACTIVE_NON_VA } from '../../../util/rxExport/staticContent';

describe('Prescription Mapper', () => {
  describe('mapNonVAPrescription', () => {
    const nonVaRx = {
      prescriptionName: 'Ibuprofen 200mg',
      orderableItem: 'Ibuprofen Tab',
      sig: 'Take 1 tablet by mouth twice daily',
      indicationForUse: 'Pain relief',
      dispensedDate: '2024-06-15',
      providerFirstName: 'Jane',
      providerLastName: 'Smith',
      facilityName: 'VA Medical Center',
      prescriptionSource: RX_SOURCE.NON_VA,
    };

    it('should map Non-VA prescription with all fields', () => {
      const result = mapNonVAPrescription(nonVaRx);

      expect(result.name).to.equal('Ibuprofen 200mg');
      expect(result.type).to.equal('non-va');
      expect(result.fields).to.be.an('array');

      const instructionsField = result.fields.find(
        f => f.label === 'Instructions',
      );
      expect(instructionsField.value).to.equal(
        'Take 1 tablet by mouth twice daily',
      );

      const statusField = result.fields.find(f => f.label === 'Status');
      expect(statusField.value).to.equal(ACTIVE_NON_VA);
    });

    it('should exclude reason for use when isCernerPilot is true', () => {
      const result = mapNonVAPrescription(nonVaRx, { isCernerPilot: true });

      const reasonField = result.fields.find(
        f => f.label === 'Reason for use',
      );
      expect(reasonField).to.be.undefined;
    });

    it('should use orderableItem when prescriptionName is missing', () => {
      const rxWithoutName = { ...nonVaRx, prescriptionName: null };
      const result = mapNonVAPrescription(rxWithoutName);

      expect(result.name).to.equal('Ibuprofen Tab');
    });
  });

  describe('mapVAPrescriptionForList', () => {
    const vaRx = {
      prescriptionName: 'Metformin 500mg',
      prescriptionNumber: '123456',
      sortedDispensedDate: '2024-06-15',
      expirationDate: '2025-06-15',
      refillRemaining: 3,
      facilityName: 'VA Medical Center',
      phoneNumber: '555-1234',
      sig: 'Take 1 tablet by mouth daily',
      indicationForUse: 'Diabetes',
      orderedDate: '2024-01-15',
      providerFirstName: 'John',
      providerLastName: 'Doe',
      dispStatus: 'Active',
      refillStatus: 'active',
      prescriptionSource: RX_SOURCE.VA,
    };

    it('should map VA prescription for list view', () => {
      const result = mapVAPrescriptionForList(vaRx);

      expect(result.name).to.equal('Metformin 500mg');
      expect(result.type).to.equal('va');
      expect(result.isPending).to.be.false;
      expect(result.fields).to.be.an('array');

      const lastFilledField = result.fields.find(
        f => f.label === 'Last filled on',
      );
      expect(lastFilledField).to.exist;
      expect(lastFilledField.value).to.include('June 15, 2024');
    });

    it('should exclude last filled for pending prescriptions', () => {
      const pendingRx = {
        ...vaRx,
        prescriptionSource: RX_SOURCE.PENDING_DISPENSE,
        dispStatus: DISPENSE_STATUS.NEW_ORDER,
      };
      const result = mapVAPrescriptionForList(pendingRx);

      expect(result.isPending).to.be.true;
      const lastFilledField = result.fields.find(
        f => f.label === 'Last filled on',
      );
      expect(lastFilledField).to.be.undefined;
    });

    it('should use Cerner-specific pharmacy contact when isCernerPilot is true', () => {
      const result = mapVAPrescriptionForList(vaRx, { isCernerPilot: true });

      const pharmacyField = result.fields.find(
        f => f.label === 'Pharmacy contact information',
      );
      expect(pharmacyField).to.exist;
      expect(pharmacyField.value).to.include('Check your prescription label');
    });
  });

  describe('mapVAPrescriptionForDetail', () => {
    const vaRx = {
      prescriptionName: 'Metformin 500mg',
      prescriptionNumber: '123456',
      sortedDispensedDate: '2024-06-15',
      expirationDate: '2025-06-15',
      refillRemaining: 3,
      quantity: 30,
      facilityName: 'VA Medical Center',
      phoneNumber: '555-1234',
      sig: 'Take 1 tablet by mouth daily',
      indicationForUse: 'Diabetes',
      orderedDate: '2024-01-15',
      providerFirstName: 'John',
      providerLastName: 'Doe',
      dispStatus: 'Active',
      refillStatus: 'active',
      prescriptionSource: RX_SOURCE.VA,
      rxRfRecords: [],
      groupedMedications: [],
    };

    it('should map VA prescription for detail view with sections', () => {
      const result = mapVAPrescriptionForDetail(vaRx);

      expect(result.name).to.equal('Metformin 500mg');
      expect(result.type).to.equal('va');
      expect(result.sections).to.exist;
      expect(result.sections.main).to.exist;
      expect(result.sections.main.header).to.equal('Most recent prescription');
      expect(result.sections.main.fields).to.be.an('array');
    });

    it('should include quantity field in detail view', () => {
      const result = mapVAPrescriptionForDetail(vaRx);

      const quantityField = result.sections.main.fields.find(
        f => f.label === 'Quantity',
      );
      expect(quantityField).to.exist;
    });

    it('should include previous prescriptions when groupedMedications exists', () => {
      const rxWithGrouped = {
        ...vaRx,
        groupedMedications: [
          {
            prescriptionNumber: '654321',
            sortedDispensedDate: '2024-01-15',
            quantity: 30,
            orderedDate: '2023-06-15',
            providerFirstName: 'Jane',
            providerLastName: 'Smith',
          },
        ],
      };
      const result = mapVAPrescriptionForDetail(rxWithGrouped);

      expect(result.sections.previousPrescriptions).to.exist;
      expect(result.sections.previousPrescriptions.count).to.equal(1);
      expect(result.sections.previousPrescriptions.items[0].prescriptionNumber).to.equal('654321');
    });
  });

  describe('mapPrescriptionList', () => {
    it('should map mixed prescription list', () => {
      const prescriptions = [
        {
          prescriptionName: 'VA Med',
          prescriptionSource: RX_SOURCE.VA,
          dispStatus: 'Active',
        },
        {
          prescriptionName: 'Non-VA Med',
          prescriptionSource: RX_SOURCE.NON_VA,
        },
      ];

      const result = mapPrescriptionList(prescriptions);

      expect(result).to.have.length(2);
      expect(result[0].type).to.equal('va');
      expect(result[1].type).to.equal('non-va');
    });

    it('should handle empty list', () => {
      const result = mapPrescriptionList([]);
      expect(result).to.be.an('array').that.is.empty;
    });

    it('should handle null/undefined', () => {
      const result = mapPrescriptionList(null);
      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('mapAllergy', () => {
    it('should map allergy to normalized format', () => {
      const allergy = {
        name: 'Penicillin',
        reaction: ['Rash', 'Hives'],
        type: 'Drug',
        observedOrReported: 'Observed',
      };

      const result = mapAllergy(allergy);

      expect(result.name).to.equal('Penicillin');
      expect(result.fields).to.have.length(3);
      expect(result.fields[0].label).to.equal('Signs and symptoms');
      expect(result.fields[0].value).to.deep.equal(['Rash', 'Hives']);
      expect(result.fields[0].type).to.equal('list');
    });
  });

  describe('mapAllergies', () => {
    it('should return error state for null allergies', () => {
      const result = mapAllergies(null);
      expect(result.state).to.equal('error');
      expect(result.items).to.be.empty;
    });

    it('should return empty state for empty array', () => {
      const result = mapAllergies([]);
      expect(result.state).to.equal('empty');
      expect(result.items).to.be.empty;
    });

    it('should return loaded state with mapped items', () => {
      const allergies = [
        { name: 'Penicillin', reaction: [], type: 'Drug', observedOrReported: 'Observed' },
        { name: 'Peanuts', reaction: [], type: 'Food', observedOrReported: 'Reported' },
      ];

      const result = mapAllergies(allergies);

      expect(result.state).to.equal('loaded');
      expect(result.count).to.equal(2);
      expect(result.items).to.have.length(2);
    });
  });
});
