import { expect } from 'chai';
import * as selectors from '../../source-files/va-health-services/selectors';

const emptyState = [];
const state = {
  drupalStaticData: {
    vaHealthServicesData: [
      [
        'Returning service member care',
        'Post-9/11 Veterans (OEF, OIF, OND) transition and care management services',
        null,
        'transitionCounseling',
        'Social programs and services',
        true, // fieldShowForVetCenters,
        false, // fieldShowForVbaFacilities,
        false, // fieldShowForVamcFacilities,
        false, // fieldTricareSpecificService,
        451,
      ],
      [
        'Mental health care',
        'Behavioral health',
        'addiction, depression, anxiety, trauma, PTSD, bipolar disorder, schizophrenia, OCD ',
        'mentalHealth',
        'Mental health care',
        false, // fieldShowForVetCenters,
        true, // fieldShowForVbaFacilities,
        false, // fieldShowForVamcFacilities,
        false, // fieldTricareSpecificService,
        441,
      ],
      [
        'Suicide prevention',
        'Veterans Crisis Line',
        null,
        'suicidePrevention',
        'Mental health care',
        false, // fieldShowForVetCenters,
        false, // fieldShowForVbaFacilities,
        true, // fieldShowForVamcFacilities,
        false, // fieldTricareSpecificService,
        440,
      ],
      [
        'Register for care',
        null,
        null,
        'registerForCare',
        'Non-clinical services',
        false, // fieldShowForVetCenters,
        false, // fieldShowForVbaFacilities,
        true, // fieldShowForVamcFacilities,
        false, // fieldTricareSpecificService,
        402,
      ],
      [
        'xyz',
        null,
        null,
        'xyz',
        'abc',
        false, // fieldShowForVetCenters,
        false, // fieldShowForVbaFacilities,
        false, // fieldShowForVamcFacilities,
        true, // fieldTricareSpecificService,
        200,
      ],
    ],
  },
};

describe('selectCernerFacilities', () => {
  it('pulls out state.drupalStaticData.vamcEhrData.cernerFacilities.data when set on state', () => {
    expect(selectors.selectVaHealthServicesData(state)).to.deep.equal(
      state.drupalStaticData.vaHealthServicesData,
    );
  });
  it('returns empty array when empty services', () => {
    expect(selectors.selectTRICAREHealthServicesData(emptyState)).to.deep.equal(
      [],
    );
  });
});

describe('select different services', () => {
  it('returns non-empty, 2d array of services for TRICARE only', () => {
    expect(selectors.selectTRICAREHealthServicesData(state)).to.have.length(1);
  });
  it('returns non-empty, 2d array of services for VAMC facilities only', () => {
    expect(selectors.selectVAMCHealthServicesData(state)).to.have.length(2);
  });
  it('returns non-empty, 2d array of services for VBA facilities only', () => {
    expect(selectors.selectVBAHealthServicesData(state)).to.have.length(1);
  });
  it('returns non-empty, 2d array of services for Vet Centers only', () => {
    expect(selectors.selectVCHealthServicesData(state)).to.have.length(1);
  });
});
