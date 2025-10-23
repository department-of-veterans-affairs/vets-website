import { assert, expect } from 'chai';
import { replacementFunctions } from '@department-of-veterans-affairs/platform-utilities';

import { MEDICATION_SOURCES, MEDICATION_TYPES } from '../../../utils/constants';
import {
  addMedicationSource,
  filterMedicationsByType,
  getCombinedMedications,
  getMedicationsNotTaking,
  getMedicationsTaking,
} from '../../../utils/medications/index';

const testAvs = {
  meta: { stationNo: '500' },
  vaMedications: [
    {
      name: 'medication 1',
      patientTaking: false,
      prescriptionType: 'drug',
      stationNo: '500',
    },
    {
      name: 'supply 1',
      patientTaking: true,
      prescriptionType: 'supply',
      stationNo: '500',
    },
    {
      name: 'medication 2',
      patientTaking: false,
      prescriptionType: 'drug',
      stationNo: '530',
    },
    {
      name: 'medication 4',
      patientTaking: true,
      prescriptionType: 'drug',
      stationNo: '530',
    },
  ],
  nonvaMedications: [
    {
      name: 'external medication 1',
      patientTaking: false,
      prescriptionType: 'drug',
      stationNo: '530',
    },
  ],
};

describe('avs', () => {
  describe('medications utils', () => {
    describe('addMedicationSource', () => {
      it('should add the source to each medication', () => {
        const result = addMedicationSource(
          testAvs.vaMedications,
          MEDICATION_SOURCES.VA,
        );

        assert.deepEqual(result, [
          {
            name: 'medication 1',
            patientTaking: false,
            prescriptionType: 'drug',
            stationNo: '500',
            medicationSource: 'VA',
          },
          {
            name: 'supply 1',
            patientTaking: true,
            prescriptionType: 'supply',
            stationNo: '500',
            medicationSource: 'VA',
          },
          {
            name: 'medication 2',
            patientTaking: false,
            prescriptionType: 'drug',
            stationNo: '530',
            medicationSource: 'VA',
          },
          {
            name: 'medication 4',
            patientTaking: true,
            prescriptionType: 'drug',
            stationNo: '530',
            medicationSource: 'VA',
          },
        ]);
      });

      it('should return an empty array when medications is empty', () => {
        const medications = [];
        const source = 'VA';

        const result = addMedicationSource(medications, source);

        assert.deepEqual(result, []);
      });
    });

    describe('get combined medications list', () => {
      it('correctly combines medications lists', () => {
        const combinedMeds = getCombinedMedications(testAvs);
        expect(combinedMeds.length).to.equal(5);
        expect(combinedMeds[1].name).to.equal('supply 1');
        expect(combinedMeds[1].medicationSource).to.equal(
          MEDICATION_SOURCES.VA,
        );
        expect(combinedMeds[4].medicationSource).to.equal(
          MEDICATION_SOURCES.NON_VA,
        );
      });
      it('correctly combines medications lists when non-va meds are empty', () => {
        const avs = replacementFunctions.cloneDeep(testAvs);
        avs.nonvaMedications = null;
        const combinedMeds = getCombinedMedications(avs);
        expect(combinedMeds.length).to.equal(4);
        expect(combinedMeds[1].name).to.equal('supply 1');
      });
      it('correctly combines medications lists when va meds are empty', () => {
        const avs = replacementFunctions.cloneDeep(testAvs);
        avs.vaMedications = null;
        const combinedMeds = getCombinedMedications(avs);
        expect(combinedMeds.length).to.equal(1);
        expect(combinedMeds[0].name).to.equal('external medication 1');
      });
      it('returns an empty array when no medications are available', () => {
        const avs = replacementFunctions.cloneDeep(testAvs);
        avs.vaMedications = null;
        avs.nonvaMedications = null;
        const combinedMeds = getCombinedMedications(avs);
        assert.deepEqual(combinedMeds, []);
      });
    });

    describe('get medications taking', () => {
      it('returns medications that are from the current station or marked as being taken', () => {
        const medicationsTaking = getMedicationsTaking(testAvs);
        expect(medicationsTaking.length).to.equal(3);
        expect(medicationsTaking[2].name).to.equal('medication 4');
      });
    });

    describe('get medications not taking', () => {
      it('returns medications that are not from the current station and marked as not being taken', () => {
        const medicationsNotTaking = getMedicationsNotTaking(testAvs);
        expect(medicationsNotTaking.length).to.equal(2);
        expect(medicationsNotTaking[0].name).to.equal('medication 2');
      });
    });

    describe('filter medications by type', () => {
      it('correctly returns medications', () => {
        const medications = filterMedicationsByType(
          testAvs.vaMedications,
          MEDICATION_TYPES.DRUG,
        );
        expect(medications.length).to.equal(3);
        expect(medications[1].name).to.equal('medication 2');
      });

      it('correctly returns supplies', () => {
        const medications = filterMedicationsByType(
          testAvs.vaMedications,
          MEDICATION_TYPES.SUPPLY,
        );
        expect(medications.length).to.equal(1);
        expect(medications[0].name).to.equal('supply 1');
      });
    });
  });
});
