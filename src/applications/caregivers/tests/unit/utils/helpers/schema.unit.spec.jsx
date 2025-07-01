import { expect } from 'chai';
import { setPlannedClinics } from '../../../../utils/helpers';

describe('CG `setPlannedClinics` method', () => {
  const testCases = [
    {
      title: 'should set an empty array if no state is set',
      data: {},
      expectedLength: 0,
    },
    {
      title:
        'should set an empty array if selected state does not have an available clinic',
      data: { 'view:plannedClinicState': 'AS' },
      expectedLength: 0,
    },
    {
      title: 'should populate the array with clinics when available',
      data: { 'view:plannedClinicState': 'IN' },
      expectedLength: '>0',
    },
  ];

  testCases.forEach(({ title, data, expectedLength }) => {
    it(title, () => {
      const result = setPlannedClinics(data);
      if (expectedLength === '>0') {
        expect(result.enum).to.not.be.empty;
      } else {
        expect(result.enum).have.lengthOf(expectedLength);
      }
    });
  });
});
