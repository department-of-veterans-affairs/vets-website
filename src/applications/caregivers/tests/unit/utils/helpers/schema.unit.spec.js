import { expect } from 'chai';
import { setPlannedClinics } from '../../../../utils/helpers/schema';

describe('CG `setPlannedClinics` method', () => {
  it('should set an empty array if no state is set', () => {
    const result = setPlannedClinics({});
    expect(result.enum).to.be.empty;
  });

  it('should set an empty array if selected state does not have an available clinic', () => {
    const result = setPlannedClinics({ 'view:plannedClinicState': 'AS' });
    expect(result.enum).to.be.empty;
  });

  it('should populate the array with clinics when available', () => {
    const result = setPlannedClinics({ 'view:plannedClinicState': 'IN' });
    expect(result.enum).to.not.be.empty;
  });
});
