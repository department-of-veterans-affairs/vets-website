import { expect } from 'chai';

import { facilityTypeSubmissionChoices } from '../../content/facilityTypes';
import { getFacilityType } from '../../utils/submit/facilities';

import {
  SC_NEW_FORM_DATA,
  TREATMENT_FACILITY_OTHER_MAX,
} from '../../constants';

describe('getFacilityType', () => {
  const setup = ({
    toggle = true,
    vetCenter,
    ccp,
    vamc,
    cboc,
    mtf,
    nonVa,
    other,
  } = {}) =>
    getFacilityType({
      [SC_NEW_FORM_DATA]: toggle,
      facilityTypes: {
        vetCenter,
        ccp,
        vamc,
        cboc,
        mtf,
        nonVa,
        other,
      },
    });

  it('should return null if not in new form', () => {
    expect(setup({ toggle: false })).to.be.null;
  });

  it('should return empty objectl if nothing selected', () => {
    expect(setup({ toggle: true })).to.deep.equal({});
  });

  it('should return all treatmentLocations and treatmentLocationOther', () => {
    const settings = {
      vetCenter: true,
      ccp: true,
      vamc: true,
      cboc: true,
      mtf: true,
      nonVa: true,
      other: 'Test Facility',
    };
    expect(setup(settings)).to.deep.equal({
      treatmentLocations: [
        facilityTypeSubmissionChoices.vetCenter,
        facilityTypeSubmissionChoices.ccp,
        facilityTypeSubmissionChoices.vamcCobc,
        facilityTypeSubmissionChoices.mtf,
        facilityTypeSubmissionChoices.nonVa,
        facilityTypeSubmissionChoices.other,
      ],
      treatmentLocationOther: 'Test Facility',
    });
  });

  it('should return a truncated treatmentLocationOther if text is too long', () => {
    const settings = {
      other: 'lorem ipsum'.repeat(TREATMENT_FACILITY_OTHER_MAX / 9),
    };
    const result = setup(settings);
    expect(result.treatmentLocations).to.deep.equal([
      facilityTypeSubmissionChoices.other,
    ]);
    expect(result.treatmentLocationOther).to.have.lengthOf(
      TREATMENT_FACILITY_OTHER_MAX,
    );
  });
});
