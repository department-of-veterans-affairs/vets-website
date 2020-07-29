import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import InstitutionSearchForm from '../../components/search/InstitutionSearchForm';

const search = {
  facets: {
    category: { school: 1, employer: 0 },
    type: { PRIVATE: 1 },
    state: { VA: 1 },
    country: [{ name: 'USA', count: 1 }],
    studentVetGroup: { true: null, false: null },
    yellowRibbonScholarship: { true: null, false: null },
    principlesOfExcellence: { true: null, false: null },
    eightKeysToVeteranSuccess: { true: null, false: null },
    stemOffered: { true: null, false: null },
    independentStudy: { true: null, false: null },
    onlineOnly: { true: null, false: null },
    distanceLearning: { true: null, false: null },
    priorityEnrollment: { true: null, false: null },
    menonly: { true: null, false: null },
    womenonly: { true: null, false: null },
    hbcu: { true: null, false: null },
    relaffil: { '66': 1 },
    provider: [],
  },
  links: {},
  results: [
    {
      name: 'MARY BALDWIN UNIVERSITY',
      facilityCode: '31901746',
      type: 'PRIVATE',
      city: 'STAUNTON',
      state: 'VA',
      zip: '24401',
      country: 'USA',
      highestDegree: 4,
      localeType: 'city',
      studentCount: 75,
      cautionFlag: null,
      cautionFlagReason: null,
      cautionFlags: [],
      createdAt: '2020-07-28T18:33:05.000Z',
      updatedAt: '2020-07-28T18:33:05.000Z',
      address1: '318 PROSPECT ST',
      address2: null,
      address3: null,
      physicalCity: 'STAUNTON',
      physicalState: 'VA',
      physicalCountry: 'USA',
      onlineOnly: false,
      distanceLearning: true,
      dodBah: 1389,
      physicalZip: '24401',
      bah: 1478,
      tuitionInState: 29595,
      tuitionOutOfState: 29595,
      books: 900,
      studentVeteran: null,
      yr: true,
      poe: false,
      eightKeys: null,
      stemOffered: false,
      independentStudy: true,
      priorityEnrollment: false,
      schoolClosing: false,
      schoolClosingOn: null,
      closure109: null,
      vetTecProvider: false,
      parentFacilityCodeId: null,
      campusType: 'Y',
      preferredProvider: false,
      countOfCautionFlags: 0,
      hbcu: 0,
      hcm2: 0,
      menonly: 0,
      pctfloan: 0.7033,
      relaffil: 66,
      womenonly: 1,
    },
  ],
  count: 1,
  version: { number: 2, createdAt: '2020-07-28T18:33:05.243Z', preview: false },
  query: {
    name: 'university',
    category: 'school',
    relaffil: '66',
    womenonly: 'true',
  },
  pagination: { currentPage: 1, totalPages: 1, perPage: 10 },
  inProgress: false,
  error: null,
  filterOpened: false,
};

const filters = {
  category: 'school',
  type: 'ALL',
  country: 'ALL',
  state: 'ALL',
  studentVeteranGroup: false,
  yellowRibbonScholarship: false,
  principlesOfExcellence: false,
  eightKeysToVeteranSuccess: false,
  stemIndicator: false,
  typeName: 'ALL',
  preferredProvider: false,
  provider: [],
  excludeWarnings: false,
  excludeCautionFlags: false,
  relaffil: '66',
  womenonly: true,
  distanceLearning: false,
  onlineOnly: false,
  priorityEnrollment: false,
  independentStudy: false,
  menonly: false,
  hbcu: false,
};

const location = {
  pathname: '/search',
  search: '?category=school&name=university&relaffil=66&womenonly=true',
  hash: '',
  action: 'POP',
  key: 'zgvxoo',
  basename: '/gi-bill-comparison-tool',
  query: {
    category: 'school',
    name: 'university',
    relaffil: '66',
    womenonly: 'true',
  },
};

const autocomplete = {
  inProgress: false,
  previewVersion: null,
  searchTerm: 'university',
  facilityCode: null,
  suggestions: [],
};

const eligibility = {
  militaryStatus: 'veteran',
  giBillChapter: '33',
  cumulativeService: '1.0',
  onlineClasses: 'no',
  spouseActiveDuty: 'no',
  enlistmentService: '3',
  consecutiveService: '0.8',
  eligForPostGiBill: 'no',
  numberOfDependents: '0',
  learningFormat: { inPerson: false, online: false },
};

describe('<InstitutionSearchForm>', () => {
  it('should render', () => {
    const wrapper = shallow(
      <InstitutionSearchForm
        search={search}
        autocomplete={autocomplete}
        filters={filters}
        eligibility={eligibility}
        gibctEstimateYourBenefits
        gibctFilterEnhancement
        gibctCh33BenefitRateUpdate
      />,
    );
    expect(wrapper).to.not.be.undefined;
    wrapper.unmount();
  });
});
